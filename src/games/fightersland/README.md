# Fightersland

Pixel-art 1 vs 1 fighting game: six fighters, two arenas, VS CPU, two players on one keyboard,
a tutorial and **online 1v1** (two players, each on their own device).

Layout: `core/` shared types and constants, `sim/` deterministic input-driven simulation,
`render/` canvas renderer, `app/game.ts` loop + UI store, `ui/` React screens, `input/`
keyboard / gamepad / touch, `net/` online play, `dev/` standalone harness and `simcheck`.

## Online 1v1

No account, no registration, no server of ours and no extra dependency.

**Flow.** Mode screen → ONLINE → *Create room* or *Join room*. The host gets a 4-character
code (alphabet without 0/O/1/I) and a *Copy link* button; the link is the current page URL
with `?room=CODE`, which opens the game straight into joining that room. The guest types the
code or opens the link. Once connected both are in the room: the host is player 0 (left),
the guest player 1 (right). Each picks only their own fighter; the match starts when both have
picked. The HUD tags read YOU / RIVAL. An online match cannot be paused: the pause button is
"leave match" (with confirmation, the fight keeps running). On the result screen a rematch
needs both players to accept.

**Room rules (host).** In the room the host can change, and the guest sees live, read-only:
arena (or random), health multiplier per player (x0.5 / x1 / x2 / x3), damage multiplier per
player (damage that player deals, chip included), round time (30 / 60 / 120 s or ∞), rounds to
win (1 / 2 / 3) and the finisher cinematic on/off. They travel in the `start` message and
become the optional `FightConfig.rules` (plus `roundsToWin`), which the simulation honours;
without `rules` every mode behaves exactly as before.

**Connection** (`net/signal.ts`, `net/link.ts`). The two browsers talk directly over one
WebRTC data channel (ordered, reliable). The handshake (offer / answer / ICE candidates) goes
through the public PeerJS cloud server (`wss://0.peerjs.com/peerjs`), whose protocol is spoken
by hand over a WebSocket: the host registers as `fightersland-<CODE>`, the guest under a
throw-away id. The server validates what it relays, so the payloads carry the same fields as
the PeerJS client's. The socket is closed as soon as the data channel opens. ICE uses public
STUN only (`stun.l.google.com`, `stun1.l.google.com`).

**Netcode** (`net/session.ts`): rollback by re-simulation. Each peer keeps a *confirmed* state
that only advances with the real inputs of both players, and every drawn frame is a
*predicted* state: `cloneFight(confirmed)` stepped up to the local clock with the real local
inputs and the rival's last known input repeated. Local input delay is 2 frames; the local
clock stalls when it is more than 8 frames ahead of the rival's last input, prediction is
capped at 10 frames, and a clock that runs ahead of the rival's drops a tick now and then.
Effects, sound and match flow come only from confirmed ticks; the renderer is updated with
the confirmed state and draws the predicted one. Every 120 confirmed frames the peers exchange
`hashFight(state)`; a mismatch ends the match with "connection out of sync".

Messages (`net/protocol.ts`, compact JSON, validated on receipt): `input`, `pick`, `settings`,
`start` (fighters, arena, seed, countdown, rules), `hash`, `rematch`, `leave`, `ping` / `pong`
(RTT indicator). If the channel closes or nothing arrives for 5 s the match ends with "rival
disconnected". In a hidden tab the match keeps running on timers with neutral inputs.

**Limits.**

- No TURN relay: two players behind symmetric NATs, some mobile carriers and strict corporate
  or school networks cannot connect ("connection failed").
- The public PeerJS server is needed for the initial handshake only; if it is down or
  rate-limiting, rooms cannot be created or joined (matches already running are unaffected).
- Room codes are not secret: anyone who guesses the 4 characters while the room is waiting can
  join. One guest per room.
- The simulation must be bit-identical on both devices. It only uses basic arithmetic, and the
  hash check catches a divergence, but different builds of the game on the two sides are not
  detected before the first hash.
- High latency (beyond roughly 150 ms each way) slows the game down instead of predicting
  further; sound and hit effects wait for the rival's inputs, so they trail by the latency.
- A phone that suspends the page in the background drops the match after 5 s.

## Development

```
npx tsc --noEmit -p tsconfig.fightersland.json
npx esbuild src/games/fightersland/dev/simcheck.ts --bundle --platform=node --alias:@=./src --outfile=/tmp/simcheck.cjs && node /tmp/simcheck.cjs
node src/games/fightersland/dev/harness.mjs --port 5178      # standalone page, ?fldebug=1
```

`simcheck` includes `clone` (clone mid-match, step both, compare state and hash) and `rules`
(multipliers, infinite time, finisher off). With `?fldebug=1` the page exposes `window.__FL__`
(`net()` returns the online session: frames, hashes, config) and accepts
`&flsignal=ws://localhost:9000/peerjs` (another PeerJS-protocol signaling server) and
`&fllag=60-120` (delay received data-channel messages by 60–120 ms).
