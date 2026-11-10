/**
 * Scoped stylesheet for the whole game (every class is prefixed `fl-`). Injected once by the
 * root component so the game looks identical inside the site and in the standalone harness.
 * `--u` is the pixel-UI scale in CSS px, set on the stage from its size.
 */
export const FL_CSS = `
.fl-root{--u:2px;--fl-bg:#0b0814;--fl-panel:#1f1636;--fl-panel2:#2b1f4a;--fl-edge:#0b0814;--fl-hi:#3f2f6b;--fl-gold:#f5c84a;--fl-red:#e0434c;--fl-ink:#f4efe6;--fl-dim:#9a8fb8;color:var(--fl-ink);font-family:ui-monospace,Menlo,Consolas,monospace;-webkit-tap-highlight-color:transparent}
.fl-root *,.fl-root *::before,.fl-root *::after{box-sizing:border-box}
.fl-px{display:block;image-rendering:pixelated;image-rendering:crisp-edges;pointer-events:none;flex:none}
.fl-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* poster (server-rendered, inline in the page) */
.fl-poster{position:relative;width:100%;aspect-ratio:16/9;min-height:220px;max-height:72vh;overflow:hidden;border-radius:12px;background:#140e24;display:flex;align-items:flex-start;justify-content:center;padding-top:5%}
.fl-poster-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fl-poster-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,8,20,.15) 0%,rgba(11,8,20,.55) 60%,rgba(11,8,20,.85) 100%)}
.fl-poster-body{position:relative;display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*6);padding:calc(var(--u)*6);text-align:center}

/* stage (fixed, below the site header) */
.fl-stage{position:fixed;left:0;right:0;bottom:0;top:var(--fl-top,0px);z-index:var(--fl-z,40);background:var(--fl-bg);overflow:hidden;user-select:none;-webkit-user-select:none;overscroll-behavior:contain;touch-action:none;outline:none}
.fl-canvas{position:absolute;display:block;image-rendering:pixelated;image-rendering:crisp-edges;background:#000}
.fl-dim{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(11,8,20,.62) 0%,rgba(11,8,20,.84) 70%,rgba(11,8,20,.94) 100%);pointer-events:none}
.fl-dim-fight{background:rgba(9,6,16,.72)}
.fl-layer{position:absolute;left:0;right:0;bottom:0;top:0}
.fl-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:calc(var(--u)*5);padding:calc(var(--u)*6) calc(var(--u)*4);overflow-y:auto;overflow-x:hidden;touch-action:pan-y;scrollbar-width:thin}
.fl-screen-top{justify-content:flex-start}
.fl-screen-top>*:first-child{margin-top:0}
.fl-screen>*{flex:none}
.fl-screen>*:first-child{margin-top:auto}
.fl-screen>*:last-child{margin-bottom:auto}
.fl-col{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*3)}
.fl-row{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:calc(var(--u)*3);flex-wrap:wrap}
.fl-menu{display:flex;flex-direction:column;align-items:stretch;gap:calc(var(--u)*3);min-width:calc(var(--u)*120)}
.fl-panel{background:var(--fl-panel);box-shadow:0 0 0 var(--u) var(--fl-edge),inset 0 0 0 var(--u) var(--fl-hi);padding:calc(var(--u)*5)}

/* pixel buttons */
.fl-btn{appearance:none;border:0;margin:0;font:inherit;color:inherit;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--u)*2);padding:calc(var(--u)*3) calc(var(--u)*6);min-height:44px;background:var(--fl-panel2);box-shadow:0 0 0 var(--u) var(--fl-edge),inset 0 calc(var(--u)*-2) 0 #1a1230,inset 0 var(--u) 0 #4a3a7c;touch-action:manipulation;outline:none;transition:transform .06s}
.fl-btn:hover{background:#352760}
.fl-btn:focus,.fl-btn[aria-pressed="true"]{background:#3b2a6a;box-shadow:0 0 0 var(--u) var(--fl-edge),0 0 0 calc(var(--u)*2) var(--fl-gold),inset 0 calc(var(--u)*-2) 0 #241848,inset 0 var(--u) 0 #6a56a8}
.fl-btn:active{transform:translateY(var(--u))}
.fl-btn[disabled]{opacity:.45;cursor:default}
.fl-btn-primary{background:#8a2a3a;box-shadow:0 0 0 var(--u) var(--fl-edge),inset 0 calc(var(--u)*-2) 0 #5a1626,inset 0 var(--u) 0 #c4505e}
.fl-btn-primary:hover{background:#a23446}
.fl-btn-primary:focus{background:#b23a4c;box-shadow:0 0 0 var(--u) var(--fl-edge),0 0 0 calc(var(--u)*2) var(--fl-gold),inset 0 calc(var(--u)*-2) 0 #6a1a2c,inset 0 var(--u) 0 #e06a78}
.fl-btn-small{padding:calc(var(--u)*2) calc(var(--u)*3);min-height:40px;min-width:40px}
.fl-btn-row{flex-direction:row;justify-content:space-between;gap:calc(var(--u)*6)}
.fl-btn-on{color:var(--fl-gold)}

/* corner buttons over the stage */
.fl-corner{position:absolute;top:6px;z-index:5;display:flex;gap:6px}
.fl-corner-l{left:6px}
.fl-corner-r{right:6px}
.fl-icon{display:block;width:16px;height:16px;fill:currentColor;flex:none}

/* title */
.fl-logo{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*2)}
.fl-blink{animation:fl-blink 1.1s steps(2,start) infinite}
@keyframes fl-blink{to{visibility:hidden}}

/* mode */
.fl-mode-card{min-width:calc(var(--u)*150);align-items:flex-start}
.fl-levels{display:flex;gap:calc(var(--u)*2)}

/* character select */
.fl-select{display:grid;grid-template-columns:auto auto;gap:calc(var(--u)*5);align-items:center;justify-content:center}
.fl-select-portrait{grid-template-columns:auto;justify-items:center}
.fl-select-info{display:flex;flex-direction:column;gap:calc(var(--u)*3);align-items:flex-start}
.fl-preview{display:flex;align-items:flex-end;justify-content:center;gap:calc(var(--u)*2)}
.fl-preview-stage{position:relative;background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.07));box-shadow:inset 0 calc(var(--u)*-3) 0 rgba(0,0,0,.35)}
.fl-grid{display:grid;grid-template-columns:repeat(7,auto);gap:calc(var(--u)*2)}
.fl-grid-3{grid-template-columns:repeat(4,auto)}
.fl-tile{padding:var(--u);min-height:0;gap:0}
.fl-tile-sel{box-shadow:0 0 0 var(--u) var(--fl-edge),0 0 0 calc(var(--u)*2) var(--tile-accent,#fff)}
.fl-bars{display:grid;grid-template-columns:auto auto;gap:var(--u) calc(var(--u)*4);align-items:center}
.fl-bars-2{grid-template-columns:auto auto auto auto}
.fl-bar{display:flex;gap:calc(var(--u)*1)}
.fl-bar i{display:block;width:calc(var(--u)*8);height:calc(var(--u)*5);background:#2a2142;box-shadow:inset 0 calc(var(--u)*-1) 0 rgba(0,0,0,.35)}
.fl-bar i.fl-on{background:var(--bar,#f5c84a)}
.fl-q{width:calc(var(--u)*24);height:calc(var(--u)*24);display:flex;align-items:center;justify-content:center;background:#151026}

/* map select */
.fl-maps{display:flex;gap:calc(var(--u)*4);flex-wrap:wrap;justify-content:center}
.fl-map-btn{padding:calc(var(--u)*2);gap:calc(var(--u)*2)}

/* fight overlays */
.fl-tut{position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:var(--u);padding:calc(var(--u)*2) calc(var(--u)*4);background:rgba(15,10,28,.82);box-shadow:0 0 0 var(--u) var(--fl-edge),inset 0 0 0 var(--u) var(--fl-hi);pointer-events:none;max-width:96%}
.fl-tut-skip{position:absolute;z-index:6}
.fl-progress{width:calc(var(--u)*90);height:calc(var(--u)*3);background:#2a2142;box-shadow:0 0 0 var(--u) var(--fl-edge)}
.fl-progress>i{display:block;height:100%;background:var(--fl-gold);transition:width .15s}
.fl-pause{min-width:calc(var(--u)*130)}
.fl-controls-table{display:grid;grid-template-columns:auto auto auto;gap:calc(var(--u)*2) calc(var(--u)*6);align-items:center}
.fl-result-card{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*3)}

/* touch controls */
.fl-touch{position:absolute;left:0;right:0;bottom:0;pointer-events:none;z-index:4}
.fl-touch-below{background:linear-gradient(180deg,#120d20,#0b0814)}
.fl-pad,.fl-acts{position:absolute;bottom:12px;pointer-events:auto;touch-action:none}
.fl-pad{left:12px;width:128px;height:128px}
.fl-acts{right:12px;width:204px;height:152px}
.fl-tbtn{position:absolute;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(43,31,74,.78);box-shadow:0 0 0 2px rgba(11,8,20,.9),inset 0 -4px 0 rgba(0,0,0,.35),inset 0 2px 0 rgba(255,255,255,.12);color:#f4efe6;touch-action:none;pointer-events:none}
.fl-tbtn-on{background:rgba(245,200,74,.9);color:#1a1230;transform:translateY(2px)}
.fl-tbtn-pill{border-radius:14px;width:92px;height:56px}
.fl-acts .fl-tbtn{pointer-events:auto}
.fl-tbtn svg{width:26px;height:26px;fill:currentColor}
.fl-touch-overlay .fl-tbtn{background:rgba(43,31,74,.5)}
.fl-touch-overlay .fl-tbtn-on{background:rgba(245,200,74,.8)}
.fl-rotate{position:absolute;left:50%;transform:translateX(-50%);top:14px;display:flex;align-items:center;gap:6px;opacity:.8;pointer-events:none}
.fl-compact .fl-screen{gap:calc(var(--u)*3);padding:calc(var(--u)*3) calc(var(--u)*4)}
.fl-compact .fl-menu{gap:calc(var(--u)*2)}
.fl-compact .fl-btn{min-height:40px;padding:calc(var(--u)*2) calc(var(--u)*5)}
.fl-compact .fl-tile{padding:var(--u)}
.fl-compact .fl-mode-desc{display:none}
.fl-compact .fl-pause{display:grid;grid-template-columns:1fr 1fr}
.fl-compact .fl-pause>:first-child{grid-column:1 / -1}
.fl-compact .fl-result-card{flex-direction:row;flex-wrap:wrap;justify-content:center}
@media (prefers-reduced-motion:reduce){.fl-blink{animation:none}.fl-btn{transition:none}}
`;
