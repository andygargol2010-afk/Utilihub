/**
 * Signaling for the WebRTC handshake. The only implementation speaks the PeerJS cloud server
 * protocol by hand over a WebSocket (no library, no account): the server is used just to pass
 * the offer / answer / ICE candidates between the two browsers and is dropped once the data
 * channel is open. Nothing here runs at module scope, so it is safe to import during SSR.
 */

export const DEFAULT_SIGNAL_URL = "wss://0.peerjs.com/peerjs";

export type SignalType = "OFFER" | "ANSWER" | "CANDIDATE";

export interface SignalHandlers {
  /** The server accepted our id. */
  onOpen(): void;
  onMessage(type: SignalType, src: string, payload: unknown): void;
  /** A message could not be delivered: nobody is registered under `peer`. */
  onExpire(peer: string): void;
  /** "taken": the id is in use. "failed": the server is unreachable or dropped us. */
  onError(kind: "taken" | "failed"): void;
}

export interface Signaling {
  send(type: SignalType, dst: string, payload: unknown): void;
  close(): void;
}

function randomToken(): string {
  let out = "";
  for (let i = 0; i < 12; i++) out += Math.floor(Math.random() * 36).toString(36);
  return out;
}

/** Connect to a PeerJS-protocol signaling server at `baseUrl` (ws/wss URL ending in /peerjs) as `peerId`. */
export function openPeerJsSignaling(baseUrl: string, peerId: string, handlers: SignalHandlers): Signaling {
  let closed = false;
  let opened = false;
  let beat = 0;
  const pending: string[] = [];
  const sep = baseUrl.includes("?") ? "&" : "?";
  const url = `${baseUrl}${sep}key=peerjs&id=${encodeURIComponent(peerId)}&token=${randomToken()}&version=1.5.4`;
  let ws: WebSocket | null = null;

  const fail = (kind: "taken" | "failed"): void => {
    if (closed) return;
    close();
    handlers.onError(kind);
  };

  function close(): void {
    if (closed) return;
    closed = true;
    if (beat) clearInterval(beat);
    beat = 0;
    const w = ws;
    ws = null;
    if (w) {
      w.onopen = null;
      w.onmessage = null;
      w.onerror = null;
      w.onclose = null;
      try {
        w.close();
      } catch {
        // already closed
      }
    }
  }

  try {
    ws = new WebSocket(url);
  } catch {
    setTimeout(() => fail("failed"), 0);
    return { send: () => undefined, close };
  }

  ws.onmessage = (e: MessageEvent): void => {
    if (closed || typeof e.data !== "string") return;
    let m: { type?: unknown; src?: unknown; payload?: unknown };
    try {
      m = JSON.parse(e.data) as { type?: unknown; src?: unknown; payload?: unknown };
    } catch {
      return;
    }
    const src = typeof m.src === "string" ? m.src : "";
    switch (m.type) {
      case "OPEN":
        opened = true;
        for (const p of pending) ws?.send(p);
        pending.length = 0;
        beat = window.setInterval(() => {
          if (ws && ws.readyState === 1) ws.send('{"type":"HEARTBEAT"}');
        }, 5000);
        handlers.onOpen();
        break;
      case "ID-TAKEN":
        fail("taken");
        break;
      case "ERROR":
      case "INVALID-KEY":
        fail("failed");
        break;
      case "EXPIRE":
        handlers.onExpire(src);
        break;
      case "OFFER":
      case "ANSWER":
      case "CANDIDATE":
        if (src) handlers.onMessage(m.type, src, m.payload);
        break;
      default:
        break;
    }
  };
  ws.onerror = (): void => fail("failed");
  ws.onclose = (): void => fail("failed");

  return {
    send(type, dst, payload): void {
      if (closed) return;
      const text = JSON.stringify({ type, dst, payload });
      if (opened && ws && ws.readyState === 1) ws.send(text);
      else pending.push(text);
    },
    close,
  };
}
