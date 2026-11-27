/**
 * Peer-to-peer link: one ordered, reliable RTCDataChannel negotiated through a Signaling
 * server (public STUN only, no TURN). The host registers the room id and answers the first
 * offer; the guest registers a throw-away id and sends the offer. The signaling socket is
 * closed as soon as the data channel opens.
 */
import { openPeerJsSignaling } from "./signal";
import type { SignalHandlers, Signaling } from "./signal";
import { roomPeerId } from "./protocol";

const ICE_SERVERS: RTCIceServer[] = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];
const JOIN_TIMEOUT_MS = 15000;

export type LinkError = "notFound" | "failed" | "timeout" | "taken";

export interface NetLink {
  send(text: string): void;
  close(): void;
  isOpen(): boolean;
}

export interface LinkHandlers {
  /** Host only: the room id is registered and guests can join. */
  onReady?(): void;
  onOpen(link: NetLink): void;
  onMessage(text: string): void;
  /** The open link went away (after onOpen). */
  onClose(): void;
  /** The handshake failed (before onOpen). */
  onError(kind: LinkError): void;
}

export interface LinkOptions {
  signalUrl: string;
  /** Debug: delay every received message by a random time in [min, max] ms (order preserved). */
  lagMs?: readonly [number, number] | null;
  /** Injectable signaling (tests); defaults to the PeerJS protocol client. */
  signaling?: (url: string, peerId: string, handlers: SignalHandlers) => Signaling;
}

export interface Connecting {
  cancel(): void;
}

/**
 * The public PeerJS server validates what it relays and drops the socket on anything that does
 * not look like the PeerJS client's own messages, so the payloads carry the same fields.
 */
const CONNECTION_ID = "dc_fightersland";
const PEERJS_META = { type: "data", connectionId: CONNECTION_ID } as const;
const PEERJS_OFFER_META = { ...PEERJS_META, label: CONNECTION_ID, reliable: true, serialization: "binary", browser: "chrome" } as const;

interface SdpPayload {
  sdp: RTCSessionDescriptionInit;
}

function readSdp(payload: unknown, type: "offer" | "answer"): RTCSessionDescriptionInit | null {
  const p = payload as Partial<SdpPayload> | null;
  const d = p && typeof p === "object" ? p.sdp : null;
  if (!d || typeof d !== "object" || typeof d.sdp !== "string" || d.type !== type) return null;
  return { type, sdp: d.sdp };
}

function readCandidate(payload: unknown): RTCIceCandidateInit | null {
  const p = payload as { candidate?: unknown } | null;
  const c = p && typeof p === "object" ? p.candidate : null;
  if (!c || typeof c !== "object") return null;
  const o = c as { candidate?: unknown; sdpMid?: unknown; sdpMLineIndex?: unknown };
  if (typeof o.candidate !== "string") return null;
  return {
    candidate: o.candidate,
    sdpMid: typeof o.sdpMid === "string" ? o.sdpMid : null,
    sdpMLineIndex: typeof o.sdpMLineIndex === "number" ? o.sdpMLineIndex : null,
  };
}

function connect(code: string, host: boolean, handlers: LinkHandlers, opts: LinkOptions): Connecting {
  const roomId = roomPeerId(code);
  const myId = host ? roomId : `${roomId}-guest-${Math.floor(Math.random() * 1e9).toString(36)}`;
  let done = false; // handshake finished (open or failed)
  let dead = false; // everything torn down
  let pc: RTCPeerConnection | null = null;
  let dc: RTCDataChannel | null = null;
  let remote = host ? "" : roomId;
  let remoteSet = false;
  const queued: RTCIceCandidateInit[] = [];
  let timer = 0;
  let lagTimer = 0;
  let lagUntil = 0;
  const lagQueue: { at: number; text: string }[] = [];

  function teardown(): void {
    dead = true;
    if (timer) clearTimeout(timer);
    if (lagTimer) clearTimeout(lagTimer);
    timer = 0;
    lagTimer = 0;
    lagQueue.length = 0;
    sig.close();
    const c = dc;
    const p = pc;
    dc = null;
    pc = null;
    if (c) {
      c.onopen = null;
      c.onmessage = null;
      c.onclose = null;
      try {
        c.close();
      } catch {
        // already closed
      }
    }
    if (p) {
      p.onicecandidate = null;
      p.ondatachannel = null;
      p.onconnectionstatechange = null;
      try {
        p.close();
      } catch {
        // already closed
      }
    }
  }

  function fail(kind: LinkError): void {
    if (dead) return;
    const wasOpen = done;
    teardown();
    if (wasOpen) handlers.onClose();
    else {
      done = true;
      handlers.onError(kind);
    }
  }

  function pumpLag(): void {
    lagTimer = 0;
    const now = performance.now();
    while (!dead && lagQueue.length > 0) {
      const head = lagQueue[0];
      if (!head || head.at > now) break;
      lagQueue.shift();
      handlers.onMessage(head.text);
    }
    const next = lagQueue[0];
    if (!dead && next) lagTimer = window.setTimeout(pumpLag, Math.max(0, next.at - performance.now()));
  }

  function receive(text: string): void {
    const lag = opts.lagMs;
    if (!lag) {
      handlers.onMessage(text);
      return;
    }
    const at = Math.max(lagUntil, performance.now() + lag[0] + Math.random() * Math.max(0, lag[1] - lag[0]));
    lagUntil = at;
    lagQueue.push({ at, text });
    if (!lagTimer) lagTimer = window.setTimeout(pumpLag, Math.max(0, at - performance.now()));
  }

  const link: NetLink = {
    send(text): void {
      const c = dc;
      if (dead || !c || c.readyState !== "open") return;
      try {
        c.send(text);
      } catch {
        fail("failed");
      }
    },
    close(): void {
      if (!dead) teardown();
    },
    isOpen: () => !dead && dc !== null && dc.readyState === "open",
  };

  function wire(channel: RTCDataChannel): void {
    dc = channel;
    const opened = (): void => {
      if (dead || done) return;
      done = true;
      if (timer) clearTimeout(timer);
      timer = 0;
      // the handshake server is no longer needed
      sig.close();
      handlers.onOpen(link);
    };
    channel.onopen = opened;
    if (channel.readyState === "open") opened();
    channel.onmessage = (e: MessageEvent): void => {
      if (!dead && typeof e.data === "string") receive(e.data);
    };
    channel.onclose = (): void => fail("failed");
  }

  function newPeer(): RTCPeerConnection | null {
    let p: RTCPeerConnection;
    try {
      p = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    } catch {
      return null;
    }
    p.onicecandidate = (e): void => {
      if (!dead && e.candidate && remote) sig.send("CANDIDATE", remote, { candidate: e.candidate.toJSON(), ...PEERJS_META });
    };
    p.onconnectionstatechange = (): void => {
      const st = p.connectionState;
      if (st === "failed" || st === "closed") {
        if (host && !done && p === pc) {
          // this guest never made it: free the room for another attempt
          p.onicecandidate = null;
          p.ondatachannel = null;
          p.onconnectionstatechange = null;
          try {
            p.close();
          } catch {
            // already closed
          }
          pc = null;
          remote = "";
          remoteSet = false;
          queued.length = 0;
        } else fail("failed");
      }
    };
    return p;
  }

  async function flushCandidates(p: RTCPeerConnection): Promise<void> {
    remoteSet = true;
    for (const c of queued.splice(0)) {
      try {
        await p.addIceCandidate(c);
      } catch {
        // a bad candidate is not fatal
      }
    }
  }

  async function onOffer(src: string, payload: unknown): Promise<void> {
    if (!host || pc || done) return;
    const offer = readSdp(payload, "offer");
    const p = offer ? newPeer() : null;
    if (!offer || !p) return;
    pc = p;
    remote = src;
    p.ondatachannel = (e): void => {
      if (!dc) wire(e.channel);
    };
    try {
      await p.setRemoteDescription(offer);
      await flushCandidates(p);
      const answer = await p.createAnswer();
      await p.setLocalDescription(answer);
      if (!dead && pc === p) sig.send("ANSWER", src, { sdp: { type: "answer", sdp: answer.sdp ?? "" }, ...PEERJS_META, browser: "chrome" });
    } catch {
      if (pc === p) {
        pc = null;
        remote = "";
        remoteSet = false;
      }
    }
  }

  async function onAnswer(payload: unknown): Promise<void> {
    const p = pc;
    const answer = readSdp(payload, "answer");
    if (host || !p || !answer || remoteSet) return;
    try {
      await p.setRemoteDescription(answer);
      await flushCandidates(p);
    } catch {
      fail("failed");
    }
  }

  async function startGuest(): Promise<void> {
    const p = newPeer();
    if (!p) {
      fail("failed");
      return;
    }
    pc = p;
    wire(p.createDataChannel(CONNECTION_ID, { ordered: true }));
    try {
      const offer = await p.createOffer();
      await p.setLocalDescription(offer);
      if (!dead) sig.send("OFFER", roomId, { sdp: { type: "offer", sdp: offer.sdp ?? "" }, ...PEERJS_OFFER_META });
    } catch {
      fail("failed");
    }
  }

  const sigHandlers: SignalHandlers = {
    onOpen(): void {
      if (dead) return;
      if (host) handlers.onReady?.();
      else void startGuest();
    },
    onMessage(type, src, payload): void {
      if (dead || done) return;
      if (type === "OFFER") void onOffer(src, payload);
      else if (src !== remote) return;
      else if (type === "ANSWER") void onAnswer(payload);
      else {
        const c = readCandidate(payload);
        const p = pc;
        if (!c || !p) return;
        if (remoteSet) p.addIceCandidate(c).catch(() => undefined);
        else queued.push(c);
      }
    },
    onExpire(peer): void {
      if (!host && !done && peer === roomId) fail("notFound");
    },
    onError(kind): void {
      // losing the signaling server only matters while the handshake is still running
      if (!done) fail(kind === "taken" && host ? "taken" : "failed");
    },
  };
  const sig = (opts.signaling ?? openPeerJsSignaling)(opts.signalUrl, myId, sigHandlers);
  if (!host) timer = window.setTimeout(() => fail("timeout"), JOIN_TIMEOUT_MS);

  return {
    cancel(): void {
      if (!dead && !done) {
        done = true;
        teardown();
      }
    },
  };
}

/** Create the room `code` and wait for one guest. */
export function hostRoom(code: string, handlers: LinkHandlers, opts: LinkOptions): Connecting {
  return connect(code, true, handlers, opts);
}

/** Join the room `code` (errors: notFound / failed / timeout). */
export function joinRoom(code: string, handlers: LinkHandlers, opts: LinkOptions): Connecting {
  return connect(code, false, handlers, opts);
}
