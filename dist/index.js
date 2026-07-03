// src/styles.generated.ts
var css = '.ga-toast-container{--gat-width: 380px;--gat-radius: 14px;--gat-gap: 14px;--gat-edge: 22px;--gat-font: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;--gat-surface: rgba(255, 255, 255, .82);--gat-surface-solid: #ffffff;--gat-border: rgba(15, 23, 42, .07);--gat-ring: rgba(15, 23, 42, .05);--gat-highlight: rgba(255, 255, 255, .75);--gat-text: #0f172a;--gat-text-soft: #475569;--gat-text-muted: #64748b;--gat-shadow: 0 1px 2px rgba(15, 23, 42, .05), 0 8px 20px -12px rgba(15, 23, 42, .16);--gat-shadow-hover: 0 2px 4px -2px rgba(15, 23, 42, .12), 0 14px 32px -12px rgba(15, 23, 42, .26);--gat-chip: rgba(15, 23, 42, .05);--gat-success: #16a34a;--gat-error: #e11d48;--gat-warning: #d97706;--gat-info: #2563eb;--gat-primary: #6366f1;--gat-secondary: #64748b;--gat-loading: #2563eb;--gat-ease: cubic-bezier(.22, 1, .36, 1)}[data-ga-theme=dark] .ga-toast-container,.ga-theme-dark .ga-toast-container,.ga-toast-container.ga-theme-dark{--gat-surface: rgba(24, 27, 34, .82);--gat-surface-solid: #191c22;--gat-border: rgba(255, 255, 255, .09);--gat-ring: rgba(255, 255, 255, .06);--gat-highlight: rgba(255, 255, 255, .07);--gat-text: #f8fafc;--gat-text-soft: #cbd5e1;--gat-text-muted: #9aa7ba;--gat-shadow: 0 1px 2px rgba(0, 0, 0, .35), 0 10px 28px -14px rgba(0, 0, 0, .5);--gat-shadow-hover: 0 2px 6px -2px rgba(0, 0, 0, .5), 0 16px 38px -12px rgba(0, 0, 0, .64);--gat-chip: rgba(255, 255, 255, .08)}@media(prefers-color-scheme:dark){:root:not([data-ga-theme]):not(.ga-theme-light):not(.ga-theme-dark) .ga-toast-container{--gat-surface: rgba(24, 27, 34, .82);--gat-surface-solid: #191c22;--gat-border: rgba(255, 255, 255, .09);--gat-ring: rgba(255, 255, 255, .06);--gat-highlight: rgba(255, 255, 255, .07);--gat-text: #f8fafc;--gat-text-soft: #cbd5e1;--gat-text-muted: #9aa7ba;--gat-shadow: 0 1px 2px rgba(0, 0, 0, .35), 0 10px 28px -14px rgba(0, 0, 0, .5);--gat-chip: rgba(255, 255, 255, .08)}}.ga-toast-backdrop{position:fixed;inset:0;z-index:2147482990;background:#0a0c146b;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);opacity:0;transition:opacity .22s ease}.ga-toast-backdrop-show{opacity:1}@media(prefers-reduced-transparency:reduce){.ga-toast-backdrop{backdrop-filter:none;-webkit-backdrop-filter:none}}.ga-toast-container{position:fixed;z-index:2147483000;width:var(--gat-width);max-width:calc(100vw - 2 * var(--gat-edge));pointer-events:none;font-family:var(--gat-font)}.ga-toast-container-top-start{inset-block-start:var(--gat-edge);inset-inline-start:var(--gat-edge)}.ga-toast-container-top-end{inset-block-start:var(--gat-edge);inset-inline-end:var(--gat-edge)}.ga-toast-container-top-center{inset-block-start:var(--gat-edge);left:50%;transform:translate(-50%)}.ga-toast-container-bottom-start{inset-block-end:var(--gat-edge);inset-inline-start:var(--gat-edge)}.ga-toast-container-bottom-end{inset-block-end:var(--gat-edge);inset-inline-end:var(--gat-edge)}.ga-toast-container-bottom-center{inset-block-end:var(--gat-edge);left:50%;transform:translate(-50%)}.ga-toast-container-middle-start{top:50%;inset-inline-start:var(--gat-edge)}.ga-toast-container-middle-end{top:50%;inset-inline-end:var(--gat-edge)}.ga-toast-container-middle-center{top:50%;left:50%;transform:translate(-50%)}.ga-toast{position:absolute;inset-inline:0;width:100%;box-sizing:border-box;display:flex;flex-direction:row;align-items:flex-start;gap:11px;padding:12px 16px;color:var(--gat-text);background:var(--gat-surface-solid);border:none;border-radius:var(--gat-radius);box-shadow:var(--gat-shadow),inset 0 1px 0 var(--gat-highlight);pointer-events:auto;opacity:0;transform:translateY(-140%);transition:transform .5s var(--gat-ease),opacity .35s ease,box-shadow .2s ease;will-change:transform,opacity;overflow:hidden;font-size:.875rem;line-height:1.5;-webkit-font-smoothing:antialiased;text-align:start;touch-action:pan-y;overscroll-behavior:contain}@media(hover:hover){.ga-toast:hover{box-shadow:var(--gat-shadow-hover),inset 0 1px 0 var(--gat-highlight)}}[data-ga-position^=top] .ga-toast,[data-ga-position^=middle] .ga-toast{top:0;transform-origin:top center}[data-ga-position^=bottom] .ga-toast{bottom:0;transform-origin:bottom center}.ga-toast-glass{background:var(--gat-surface);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%)}.ga-toast-hide{pointer-events:none}.ga-toast-swiping,.ga-toast-swiping *{user-select:none;-webkit-user-select:none;cursor:grabbing}.ga-toast-success{--gat-accent: var(--gat-success)}.ga-toast-error{--gat-accent: var(--gat-error)}.ga-toast-warning{--gat-accent: var(--gat-warning)}.ga-toast-info{--gat-accent: var(--gat-info)}.ga-toast-primary{--gat-accent: var(--gat-primary)}.ga-toast-secondary{--gat-accent: var(--gat-secondary)}.ga-toast-loading{--gat-accent: var(--gat-loading)}.ga-toast-content{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}.ga-toast-header{display:flex;align-items:center;gap:8px;min-width:0}.ga-toast-icon{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;margin-top:1px;color:var(--gat-accent, var(--gat-info))}.ga-toast-icon svg{width:1.25rem;height:1.25rem;display:block;overflow:visible}.ga-toast-spinner{animation:ga-toast-spin .8s linear infinite}@media(prefers-reduced-motion:no-preference){.ga-toast-icon .ga-ic-ring{stroke-dasharray:64;stroke-dashoffset:64;animation:ga-toast-ic-draw .5s var(--gat-ease) .02s forwards}.ga-toast-icon .ga-ic-draw{stroke-dasharray:28;stroke-dashoffset:28;animation:ga-toast-ic-draw .4s var(--gat-ease) .16s forwards}}@keyframes ga-toast-ic-draw{to{stroke-dashoffset:0}}.ga-toast-avatar{flex-shrink:0;width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid var(--gat-border)}.ga-toast-unread-dot{flex-shrink:0;width:8px;height:8px;border-radius:50%;background:var(--gat-accent, var(--gat-info))}.ga-toast-title{font-weight:600;font-size:.9rem;color:var(--gat-text);flex:1;min-width:0;letter-spacing:-.011em}.ga-toast-title-truncate{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ga-toast-status{flex-shrink:0;padding:2px 9px;border-radius:999px;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--gat-accent, var(--gat-info));color:color-mix(in srgb,var(--gat-accent, var(--gat-info)) 58%,var(--gat-text));background:var(--gat-chip);background:color-mix(in srgb,var(--gat-accent, var(--gat-info)) 18%,transparent)}.ga-toast-close{flex-shrink:0;align-self:flex-start;margin-top:-1px;margin-inline-end:-4px;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:none;border-radius:7px;color:var(--gat-text-muted);background:transparent;cursor:pointer;opacity:.9;transition:background .15s ease,color .15s ease,opacity .15s ease}.ga-toast:hover .ga-toast-close,.ga-toast:focus-within .ga-toast-close{opacity:1}.ga-toast-close svg{width:15px;height:15px;display:block}.ga-toast-close:hover{background:var(--gat-chip);color:var(--gat-text)}.ga-toast-close:focus-visible{outline:2px solid currentColor;outline-offset:2px}.ga-toast-body{min-width:0}.ga-toast-meta{font-size:.75rem;color:var(--gat-text-muted);margin-bottom:2px}.ga-toast-message{color:var(--gat-text-soft);font-size:.85rem;word-break:break-word;max-height:40vh;overflow-y:auto;overscroll-behavior:contain}.ga-toast-message a{color:var(--gat-accent, var(--gat-info));font-weight:500;text-decoration:underline}.ga-toast:not([class*=-filled]) .ga-toast-content>.ga-toast-body:only-child .ga-toast-message{color:var(--gat-text)}.ga-toast-actions{display:flex;gap:8px;margin-top:2px}.ga-toast-btn{flex:1;padding:8px 14px;font:inherit;font-size:.8125rem;font-weight:600;border-radius:9px;border:1px solid var(--gat-border);background:var(--gat-chip);color:var(--gat-text);cursor:pointer;transition:filter .15s ease,background .15s ease}.ga-toast-btn:hover{filter:brightness(.97)}.ga-toast-btn:focus-visible{outline:2px solid currentColor;outline-offset:2px}.ga-toast-btn-primary{background:var(--gat-accent, var(--gat-primary));border-color:transparent;color:#fff}.ga-toast-btn-primary:hover{filter:brightness(1.06)}.ga-toast-progress{position:absolute;left:0;bottom:0;height:2px;width:100%;transform:scaleX(1);transform-origin:left center;background:var(--gat-accent, var(--gat-info));opacity:.4}.ga-toast-progress-top{top:0;bottom:auto}.ga-toast-steps{display:flex;gap:4px;margin-top:4px}.ga-toast-step{flex:1;height:3px;border-radius:999px;background:var(--gat-chip)}.ga-toast-step-active{background:var(--gat-accent, var(--gat-info))}.ga-toast[class*=-filled]{background:var(--gat-accent, var(--gat-info));border-color:transparent;color:#fff}.ga-toast-success[class*=-filled]{background:#15803d}.ga-toast-primary[class*=-filled]{background:#4f46e5}.ga-toast[class*=-filled] .ga-toast-title,.ga-toast[class*=-filled] .ga-toast-message,.ga-toast[class*=-filled] .ga-toast-meta,.ga-toast[class*=-filled] .ga-toast-icon,.ga-toast[class*=-filled] .ga-toast-close{color:#fff}.ga-toast[class*=-filled] .ga-toast-close:hover{background:#fff3}.ga-toast[class*=-filled] .ga-toast-progress{background:#fff;opacity:.55}.ga-toast[class*=-filled] .ga-toast-step{background:#ffffff47}.ga-toast[class*=-filled] .ga-toast-step-active{background:#fff}.ga-toast[class*=-filled] .ga-toast-status{color:#fff;background:#ffffff38}.ga-toast[class*=-filled] .ga-toast-message a{color:#fff;text-decoration:underline}.ga-toast-warning[class*=-filled],.ga-toast-warning[class*=-filled] .ga-toast-title,.ga-toast-warning[class*=-filled] .ga-toast-message,.ga-toast-warning[class*=-filled] .ga-toast-meta,.ga-toast-warning[class*=-filled] .ga-toast-icon,.ga-toast-warning[class*=-filled] .ga-toast-close,.ga-toast-warning[class*=-filled] .ga-toast-message a{color:#2e2100}.ga-toast-warning[class*=-filled] .ga-toast-progress{background:#2e2100;opacity:.6}.ga-toast-warning[class*=-filled] .ga-toast-step{background:#0000002e}.ga-toast-warning[class*=-filled] .ga-toast-step-active{background:#2e2100}.ga-toast-warning[class*=-filled] .ga-toast-status{color:#2e2100;background:#00000029}.ga-toast-warning[class*=-filled] .ga-toast-close:hover{background:#00000024}.ga-toast[class*=-light]{background:var(--gat-surface);background-image:linear-gradient(0deg,color-mix(in srgb,var(--gat-accent, var(--gat-info)) 14%,transparent),color-mix(in srgb,var(--gat-accent, var(--gat-info)) 14%,transparent));border-color:color-mix(in srgb,var(--gat-accent, var(--gat-info)) 38%,var(--gat-border))}.ga-toast[class*=-light] .ga-toast-meta{color:var(--gat-text-soft)}.ga-toast[class*=-light] .ga-toast-message a{color:color-mix(in srgb,var(--gat-accent, var(--gat-info)) 55%,var(--gat-text));text-decoration:underline}.ga-toast-xs{padding:10px 13px;font-size:.78rem}.ga-toast-xs .ga-toast-icon svg{width:1.05rem;height:1.05rem}.ga-toast-xs .ga-toast-message{font-size:.78rem}.ga-toast-sm{padding:12px 15px}.ga-toast-lg{padding:18px 20px}.ga-toast-lg .ga-toast-title{font-size:1rem}.ga-toast-lg .ga-toast-message{font-size:.95rem}.ga-toast-lg .ga-toast-icon svg{width:1.4rem;height:1.4rem}.ga-toast-xl{padding:22px 24px}.ga-toast-xl .ga-toast-title{font-size:1.125rem}.ga-toast-xl .ga-toast-message{font-size:1.05rem}.ga-toast-xl .ga-toast-icon svg{width:1.6rem;height:1.6rem}.ga-toast-compact{align-items:center;gap:10px;padding:10px 14px}.ga-toast-compact .ga-toast-content{gap:2px}.ga-toast-compact .ga-toast-icon{margin-top:0}.ga-toast-compact .ga-toast-close{align-self:center;margin-top:0}.ga-toast-compact .ga-toast-steps{display:none}.ga-toast-compact .ga-toast-icon svg{width:1.05rem;height:1.05rem}.ga-toast-live-region{position:fixed;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}@media(max-width:520px){.ga-toast-container{--gat-width: auto;left:var(--gat-edge);right:var(--gat-edge);transform:none}.ga-toast-container-top-center,.ga-toast-container-bottom-center,.ga-toast-container-middle-center{transform:none}}[dir=rtl] .ga-toast-progress{transform-origin:right center}@media(prefers-reduced-motion:reduce){.ga-toast{transition:opacity .15s ease}.ga-toast-spinner{animation-duration:1.4s}}@media(prefers-reduced-transparency:reduce){.ga-toast-glass{background:var(--gat-surface-solid);backdrop-filter:none;-webkit-backdrop-filter:none}}.ga-toast-custom{min-width:0}.ga-toast-has-custom{padding:0}.ga-toast-has-custom .ga-toast-close{position:absolute;inset-block-start:8px;inset-inline-end:8px;z-index:1}@keyframes ga-toast-spin{to{transform:rotate(360deg)}}';

// src/index.ts
var canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
var PREFIX = "ga-toast";
var STYLE_ID = "ga-toasts-styles";
var PEEK = 14;
var STACK_GAP = 14;
var maxVisible = 3;
var REMOVE_FALLBACK = 450;
var COLLAPSE_DELAY = 140;
var registry = /* @__PURE__ */ new Map();
var containers = /* @__PURE__ */ new Map();
var globalDefaults = {};
var logger = null;
var liveRegions = null;
var escapeBound = false;
var visibilityBound = false;
var idCounter = 0;
var activeModalId = null;
var backdropEl = null;
var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var ICONS = {
  success: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M7.75 12.5l2.75 2.75L16.5 9" class="ga-ic-draw"/></svg>`,
  error: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M15 9l-6 6M9 9l6 6" class="ga-ic-draw"/></svg>`,
  warning: `${S}<path d="M12 3.6 2.4 20.4h19.2L12 3.6z" class="ga-ic-ring"/><path d="M12 10v4" class="ga-ic-draw"/><path d="M12 17.4v.01"/></svg>`,
  info: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M12 11v5" class="ga-ic-draw"/><path d="M12 7.6v.01"/></svg>`,
  primary: `${S}<path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77 6.8 19.5l.99-5.79-4.21-4.1 5.82-.85L12 3.5z" class="ga-ic-draw"/></svg>`,
  secondary: `${S}<path d="M6 9a6 6 0 0112 0c0 4.5 1.8 5.6 1.8 5.6H4.2S6 13.5 6 9z" class="ga-ic-draw"/><path d="M10 19a2 2 0 004 0"/></svg>`,
  loading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" class="ga-toast-spinner"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 3a9 9 0 019 9"/></svg>'
};
var CLOSE_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
var ASSERTIVE_TYPES = /* @__PURE__ */ new Set(["error", "warning"]);
function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
function nextId() {
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${PREFIX}-${idCounter}-${rand}`;
}
function log(event, payload) {
  if (logger) {
    try {
      logger(event, payload);
    } catch {
    }
  }
}
function prefersReducedMotion() {
  return canUseDOM && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function injectStyles() {
  if (!canUseDOM) return;
  if (document.getElementById(STYLE_ID)) return;
  const el2 = document.createElement("style");
  el2.id = STYLE_ID;
  el2.textContent = css;
  document.head.appendChild(el2);
}
function ensureLiveRegions() {
  if (!canUseDOM) return;
  if (liveRegions && liveRegions.polite.isConnected && liveRegions.assertive.isConnected)
    return;
  const make = (politeness) => {
    const region = document.createElement("div");
    region.className = "ga-toast-live-region";
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.setAttribute("role", politeness === "assertive" ? "alert" : "status");
    document.body.appendChild(region);
    return region;
  };
  liveRegions = { polite: make("polite"), assertive: make("assertive") };
}
function announce(text, assertive) {
  if (!text) return;
  ensureLiveRegions();
  if (!liveRegions) return;
  const region = assertive ? liveRegions.assertive : liveRegions.polite;
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = text;
  }, 50);
}
var POSITIONS = [
  "top-start",
  "top-center",
  "top-end",
  "middle-start",
  "middle-center",
  "middle-end",
  "bottom-start",
  "bottom-center",
  "bottom-end"
];
function verticalDir(position) {
  return position.startsWith("bottom") ? -1 : 1;
}
function isRTL() {
  if (!canUseDOM) return false;
  const dir = document.documentElement.getAttribute("dir") || document.body && document.body.getAttribute("dir");
  return dir === "rtl";
}
function offscreenTransform(position) {
  const inFromLeft = "translateX(-115%)";
  const inFromRight = "translateX(115%)";
  const rtl = isRTL();
  if (position.endsWith("start")) return rtl ? inFromRight : inFromLeft;
  if (position.endsWith("end")) return rtl ? inFromLeft : inFromRight;
  return verticalDir(position) === 1 ? "translateY(-140%)" : "translateY(140%)";
}
function getContainer(position) {
  const existing = containers.get(position);
  if (existing && existing.isConnected) return existing;
  const container = document.createElement("div");
  container.className = `ga-toast-container ga-toast-container-${position}`;
  container.setAttribute("data-ga-position", position);
  container.setAttribute("role", "region");
  container.setAttribute("aria-label", "Notifications");
  let collapseTimer = null;
  const cancelCollapse = () => {
    if (collapseTimer != null) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
  };
  const expand = () => {
    cancelCollapse();
    setExpanded(container, true);
  };
  const collapse = () => {
    cancelCollapse();
    collapseTimer = setTimeout(() => {
      collapseTimer = null;
      setExpanded(container, false);
    }, COLLAPSE_DELAY);
  };
  container.addEventListener("pointerenter", expand);
  container.addEventListener("pointerleave", collapse);
  container.addEventListener("focusin", expand);
  container.addEventListener("focusout", (e) => {
    if (!container.contains(e.relatedTarget)) collapse();
  });
  document.body.appendChild(container);
  containers.set(position, container);
  return container;
}
function setExpanded(container, expanded) {
  if (container.dataset.gaExpanded === "true" === expanded) return;
  container.dataset.gaExpanded = expanded ? "true" : "false";
  layout(container);
}
function instancesIn(container) {
  return Array.from(container.children).map((child) => registry.get(child.id)).filter((inst) => !!inst);
}
function layout(container) {
  const all = instancesIn(container);
  const position = container.dataset.gaPosition || "top-end";
  const dir = verticalDir(position);
  const expanded = container.dataset.gaExpanded === "true";
  const reduce = prefersReducedMotion();
  const front = all.slice().reverse();
  container.style.setProperty("--ga-toasts-count", String(front.length));
  let cumulative = 0;
  front.forEach((inst, frontIndex) => {
    if (inst.closing) return;
    if (!inst.el.dataset.gaMounted) {
      cumulative += inst.height + STACK_GAP;
      return;
    }
    let translateY;
    let scale;
    let opacity;
    const overflow = frontIndex >= maxVisible;
    if (overflow) pauseTimer(inst, "overflow");
    else resumeTimer(inst, "overflow");
    if (expanded || reduce) {
      translateY = dir * cumulative;
      scale = 1;
      opacity = 1;
    } else {
      translateY = dir * frontIndex * PEEK;
      scale = Math.max(1 - frontIndex * 0.05, 0.85);
      opacity = overflow ? 0 : 1;
    }
    const swipe = inst.swipeX ? ` translateX(${inst.swipeX}px)` : "";
    const ty = position.startsWith("middle") ? `calc(-50% + ${translateY}px)` : `${translateY}px`;
    inst.el.style.transform = `translateY(${ty})${swipe} scale(${scale})`;
    inst.el.style.opacity = inst.swipeX ? String(swipeOpacity(inst.swipeX)) : String(opacity);
    inst.el.style.zIndex = String(1e3 + front.length - frontIndex);
    inst.el.style.pointerEvents = opacity === 0 ? "none" : "auto";
    inst.el.setAttribute("aria-hidden", opacity === 0 ? "true" : "false");
    cumulative += inst.height + STACK_GAP;
  });
}
function swipeOpacity(dx) {
  return Math.max(0.15, 1 - Math.abs(dx) / 220);
}
function measure(inst) {
  const h = inst.el.offsetHeight;
  if (h > 0) inst.height = h;
}
function resolveOptions(options) {
  const merged = {
    type: "info",
    duration: 5e3,
    closable: true,
    position: "top-end",
    animation: "slide",
    swipeToClose: true,
    closeOnEscape: true,
    progress: true,
    progressPosition: "bottom",
    pauseOnHover: true,
    pauseOnPageHidden: true,
    autoIcon: true,
    glassmorphism: true,
    html: false,
    ...globalDefaults,
    ...options
  };
  merged.position = merged.position || "top-end";
  if (!POSITIONS.includes(merged.position)) merged.position = "top-end";
  return merged;
}
function createCloseButton() {
  const close2 = document.createElement("button");
  close2.type = "button";
  close2.className = "ga-toast-close";
  close2.setAttribute("aria-label", "Close notification");
  close2.setAttribute("data-ga-close", "");
  close2.innerHTML = CLOSE_ICON;
  return close2;
}
function appendProgress(el2, opts, type) {
  if (!opts.progress || (opts.duration || 0) <= 0 || opts.progressPosition === "none")
    return null;
  const p = document.createElement("div");
  p.className = `ga-toast-progress ga-toast-progress-${type}` + (opts.progressPosition === "top" ? " ga-toast-progress-top" : "");
  el2.appendChild(p);
  return p;
}
function buildToastElement(opts, id) {
  const type = opts.type || "info";
  const el2 = document.createElement("div");
  el2.id = id;
  el2.className = [
    "ga-toast",
    `ga-toast-${type}`,
    opts.size ? `ga-toast-${opts.size}` : "",
    opts.variant ? `ga-toast-${type}-${opts.variant}` : "",
    opts.animation || "",
    opts.compact ? "ga-toast-compact" : "",
    opts.glassmorphism ? "ga-toast-glass" : "",
    type === "loading" ? "ga-toast-loading" : "",
    opts.className || ""
  ].filter(Boolean).join(" ");
  const role = opts.role || (ASSERTIVE_TYPES.has(type) ? "alert" : "status");
  el2.setAttribute("role", role);
  el2.setAttribute("aria-live", "off");
  el2.setAttribute("data-ga-type", type);
  if (role === "alertdialog" || role === "dialog") {
    const label = [opts.title, opts.message].filter(Boolean).join(". ");
    if (label) el2.setAttribute("aria-label", label);
  }
  if (opts.content != null) {
    el2.classList.add("ga-toast-has-custom");
    const wrap = document.createElement("div");
    wrap.className = "ga-toast-custom";
    const c = typeof opts.content === "function" ? opts.content() : opts.content;
    if (typeof c === "string") wrap.innerHTML = c;
    else if (c instanceof HTMLElement) wrap.appendChild(c);
    el2.appendChild(wrap);
    if (opts.closable) el2.appendChild(createCloseButton());
    return { el: el2, progressEl: appendProgress(el2, opts, type) };
  }
  if (opts.avatar) {
    const avatar = document.createElement("img");
    avatar.className = "ga-toast-avatar";
    avatar.src = opts.avatar;
    avatar.alt = opts.avatarAlt || opts.title || "Notification";
    el2.appendChild(avatar);
  }
  let iconHtml = null;
  if (opts.icon) iconHtml = String(opts.icon);
  else if (opts.icon !== false && opts.autoIcon !== false && !opts.avatar)
    iconHtml = ICONS[type] || ICONS.info;
  if (iconHtml) {
    const icon = document.createElement("div");
    icon.className = "ga-toast-icon";
    icon.innerHTML = iconHtml;
    el2.appendChild(icon);
  }
  const content = document.createElement("div");
  content.className = "ga-toast-content";
  if (opts.title || opts.showStatus || opts.unread) {
    const header = document.createElement("div");
    header.className = "ga-toast-header";
    if (opts.unread) {
      const dot = document.createElement("span");
      dot.className = "ga-toast-unread-dot";
      header.appendChild(dot);
    }
    if (opts.title) {
      const title = document.createElement("div");
      title.className = "ga-toast-title" + (opts.truncateTitle ? " ga-toast-title-truncate" : "");
      title.textContent = opts.title;
      header.appendChild(title);
    }
    if (opts.showStatus) {
      const status = document.createElement("span");
      status.className = "ga-toast-status";
      const label = String(opts.statusText || type);
      status.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      header.appendChild(status);
    }
    content.appendChild(header);
  }
  if (opts.message || opts.meta) {
    const body = document.createElement("div");
    body.className = "ga-toast-body";
    if (opts.meta) {
      const meta = document.createElement("div");
      meta.className = "ga-toast-meta";
      meta.textContent = opts.meta;
      body.appendChild(meta);
    }
    if (opts.message) {
      const message = document.createElement("div");
      message.className = "ga-toast-message";
      if (opts.html) message.innerHTML = opts.message;
      else message.textContent = opts.message;
      body.appendChild(message);
    }
    content.appendChild(body);
  }
  if (opts.actions && opts.actions.length && !opts.compact) {
    const actions = document.createElement("div");
    actions.className = "ga-toast-actions";
    for (const action of opts.actions) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = [
        "ga-toast-btn",
        action.className || action.class || "ga-toast-btn-secondary"
      ].join(" ");
      btn.textContent = action.text;
      btn.setAttribute("data-ga-action", "");
      actions.appendChild(btn);
    }
    content.appendChild(actions);
  }
  if (opts.steps && opts.steps > 1) {
    const steps = document.createElement("div");
    steps.className = "ga-toast-steps";
    const active = Math.min(opts.steps, Math.max(1, opts.currentStep || 1));
    for (let i = 1; i <= opts.steps; i += 1) {
      const step = document.createElement("div");
      step.className = "ga-toast-step" + (i <= active ? " ga-toast-step-active" : "");
      steps.appendChild(step);
    }
    content.appendChild(steps);
  }
  el2.appendChild(content);
  if (opts.closable) el2.appendChild(createCloseButton());
  return { el: el2, progressEl: appendProgress(el2, opts, type) };
}
function startTimer(inst) {
  const { timer } = inst;
  if (timer.duration <= 0 || timer.remaining <= 0) return;
  if (timer.holds.size > 0) return;
  timer.startedAt = now();
  timer.handle = setTimeout(() => close(inst.id), timer.remaining);
  animateProgress(inst, timer.remaining);
}
function pauseTimer(inst, reason) {
  const { timer } = inst;
  const wasHeld = timer.holds.size > 0;
  timer.holds.add(reason);
  if (wasHeld || timer.handle == null) return;
  clearTimeout(timer.handle);
  timer.handle = null;
  const elapsed = now() - timer.startedAt;
  timer.remaining = Math.max(0, timer.remaining - elapsed);
  freezeProgress(inst);
}
function resumeTimer(inst, reason) {
  const { timer } = inst;
  if (!timer.holds.delete(reason)) return;
  if (timer.holds.size > 0) return;
  startTimer(inst);
}
function animateProgress(inst, ms) {
  const bar = inst.progressEl;
  if (!bar) return;
  const fraction = inst.timer.duration > 0 ? ms / inst.timer.duration : 0;
  bar.style.transition = "none";
  bar.style.transform = `scaleX(${fraction})`;
  void bar.offsetWidth;
  bar.style.transition = `transform ${ms}ms linear`;
  bar.style.transform = "scaleX(0)";
}
function freezeProgress(inst) {
  const bar = inst.progressEl;
  if (!bar) return;
  const fraction = inst.timer.duration > 0 ? inst.timer.remaining / inst.timer.duration : 0;
  bar.style.transition = "none";
  bar.style.transform = `scaleX(${fraction})`;
}
function attachHandlers(inst, opts) {
  const { el: el2, controller } = inst;
  const signal = controller.signal;
  el2.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (target.closest("[data-ga-close]")) {
        e.preventDefault();
        close(inst.id);
        return;
      }
      const actionBtn = target.closest("[data-ga-action]");
      if (actionBtn && opts.actions) {
        const idx = Array.from(
          actionBtn.parentElement?.children || []
        ).indexOf(actionBtn);
        const action = opts.actions[idx];
        if (action) {
          const handler = action.onClick || action.click;
          if (handler) handler(e, inst.handle);
          if (action.closeOnClick !== false) close(inst.id);
        }
        return;
      }
      if (opts.clickToClose && !target.closest(".ga-toast-actions")) {
        close(inst.id);
      }
    },
    { signal }
  );
  if (opts.pauseOnHover) {
    el2.addEventListener("pointerenter", () => pauseTimer(inst, "hover"), { signal });
    el2.addEventListener("pointerleave", () => resumeTimer(inst, "hover"), { signal });
    el2.addEventListener("focusin", () => pauseTimer(inst, "focus"), { signal });
    el2.addEventListener("focusout", () => resumeTimer(inst, "focus"), { signal });
  }
  if (opts.swipeToClose) attachSwipe(inst);
  if (opts.modal) {
    el2.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Tab") return;
        const focusables = el2.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      },
      { signal }
    );
  }
}
function attachSwipe(inst) {
  const { el: el2, controller } = inst;
  const signal = controller.signal;
  const THRESHOLD = 70;
  let dragging = false;
  let swiping = false;
  let startX = 0;
  let startY = 0;
  el2.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("button, a, input, textarea, select"))
        return;
      dragging = true;
      swiping = false;
      startX = e.clientX;
      startY = e.clientY;
      pauseTimer(inst, "swipe");
      try {
        el2.setPointerCapture(e.pointerId);
      } catch {
      }
    },
    { signal }
  );
  el2.addEventListener(
    "pointermove",
    (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      e.preventDefault();
      if (!swiping) {
        swiping = true;
        el2.classList.add("ga-toast-swiping");
        const sel = typeof window !== "undefined" && typeof window.getSelection === "function" ? window.getSelection() : null;
        sel?.removeAllRanges();
      }
      inst.swipeX = dx;
      const container = el2.parentElement;
      if (container) layout(container);
    },
    { signal }
  );
  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    swiping = false;
    el2.classList.remove("ga-toast-swiping");
    const dx = e.clientX - startX;
    if (Math.abs(dx) > THRESHOLD) {
      const dir = dx > 0 ? 1 : -1;
      inst.el.style.transition = "transform 0.2s ease, opacity 0.2s ease";
      inst.el.style.transform = `translateX(${dir * 400}px)`;
      inst.el.style.opacity = "0";
      close(inst.id);
    } else {
      inst.swipeX = 0;
      const container = el2.parentElement;
      if (container) layout(container);
      resumeTimer(inst, "swipe");
    }
  };
  el2.addEventListener("pointerup", end, { signal });
  el2.addEventListener("pointercancel", end, { signal });
}
function bindEscape() {
  if (escapeBound || !canUseDOM) return;
  escapeBound = true;
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    let newest = null;
    for (const inst of registry.values()) {
      if (inst.closing) continue;
      if (inst.opts.closeOnEscape === false || !inst.opts.closable) continue;
      newest = inst;
    }
    if (newest) close(newest.id);
  });
}
function bindVisibility() {
  if (visibilityBound || !canUseDOM || typeof document.addEventListener !== "function")
    return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", () => {
    const hidden = document.hidden;
    for (const inst of registry.values()) {
      if (inst.closing || inst.opts.pauseOnPageHidden === false) continue;
      if (hidden) pauseTimer(inst, "tab");
      else resumeTimer(inst, "tab");
    }
  });
}
function showBackdrop() {
  if (!canUseDOM) return;
  if (!backdropEl) {
    backdropEl = document.createElement("div");
    backdropEl.className = "ga-toast-backdrop";
  }
  if (!backdropEl.isConnected) document.body.appendChild(backdropEl);
  const bd = backdropEl;
  requestAnimationFrame(() => bd.classList.add("ga-toast-backdrop-show"));
}
function hideBackdrop() {
  if (!backdropEl) return;
  const bd = backdropEl;
  bd.classList.remove("ga-toast-backdrop-show");
  setTimeout(() => {
    if (activeModalId == null && bd.parentNode) bd.remove();
  }, 220);
}
function noopHandle(id) {
  const handle = {
    id,
    el: canUseDOM ? document.createElement("div") : {},
    update: () => handle,
    close: () => {
    }
  };
  return handle;
}
function show(options = {}) {
  if (!canUseDOM) return noopHandle(options.id || nextId());
  const opts = resolveOptions(options);
  if (opts.id && registry.has(opts.id)) {
    return update(opts.id, options) || noopHandle(opts.id);
  }
  if (opts.modal) {
    if (activeModalId && registry.has(activeModalId)) {
      return registry.get(activeModalId).handle;
    }
    opts.swipeToClose = false;
    opts.closeOnEscape = false;
    opts.moveFocus = true;
  }
  injectStyles();
  bindEscape();
  bindVisibility();
  const id = opts.id || nextId();
  const { el: el2, progressEl } = buildToastElement(opts, id);
  const controller = new AbortController();
  const timer = {
    duration: opts.duration || 0,
    remaining: opts.duration || 0,
    startedAt: 0,
    handle: null,
    holds: /* @__PURE__ */ new Set()
  };
  const handle = {
    id,
    el: el2,
    update: (o) => update(id, o) ? handle : handle,
    close: () => close(id)
  };
  const inst = {
    id,
    el: el2,
    handle,
    opts,
    controller,
    progressEl,
    timer,
    height: 0,
    closing: false,
    swipeX: 0,
    resizeObserver: null,
    prevFocus: opts.moveFocus ? document.activeElement : null
  };
  registry.set(id, inst);
  if (opts.modal) {
    activeModalId = id;
    el2.setAttribute("aria-modal", "true");
    showBackdrop();
  }
  const container = getContainer(opts.position);
  el2.style.transform = offscreenTransform(opts.position);
  el2.style.opacity = "0";
  container.appendChild(el2);
  attachHandlers(inst, opts);
  if (typeof ResizeObserver !== "undefined") {
    inst.resizeObserver = new ResizeObserver(() => {
      measure(inst);
      const parent = el2.parentElement;
      if (parent) layout(parent);
    });
    inst.resizeObserver.observe(el2);
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!registry.has(id)) return;
      measure(inst);
      el2.dataset.gaMounted = "true";
      el2.style.opacity = "1";
      layout(container);
      startTimer(inst);
      if (opts.moveFocus) {
        const target = el2.querySelector("[data-ga-action]") || el2;
        if (target === el2) el2.tabIndex = -1;
        try {
          target.focus({ preventScroll: true });
        } catch {
        }
      }
    });
  });
  if (!opts.modal && opts.role !== "alertdialog") {
    announce(
      [opts.title, opts.message].filter(Boolean).join(". "),
      ASSERTIVE_TYPES.has(opts.type || "info")
    );
  }
  if (opts.onShow) {
    try {
      opts.onShow(handle);
    } catch (err) {
      log("toast:onShow:error", err);
    }
  }
  log("toast:show", { id, type: opts.type });
  return handle;
}
function close(target) {
  if (!target) return;
  const id = typeof target === "string" ? normalizeId(target) : target.id;
  const inst = registry.get(id);
  if (!inst || inst.closing) return;
  inst.closing = true;
  if (inst.timer.handle != null) {
    clearTimeout(inst.timer.handle);
    inst.timer.handle = null;
  }
  inst.controller.abort();
  inst.resizeObserver?.disconnect();
  const { el: el2 } = inst;
  const container = el2.parentElement;
  if (!inst.swipeX) {
    el2.style.transition = "";
    el2.classList.add("ga-toast-hide");
    el2.style.transform = offscreenTransform(inst.opts.position);
    el2.style.opacity = "0";
  }
  let removed = false;
  const finalize = () => {
    if (removed) return;
    removed = true;
    el2.removeEventListener("transitionend", onEnd);
    registry.delete(id);
    el2.remove();
    if (activeModalId === id) {
      activeModalId = null;
      hideBackdrop();
    }
    if (container) layout(container);
    const prev = inst.prevFocus;
    if (prev && typeof prev.focus === "function" && document.contains(prev)) {
      try {
        prev.focus({ preventScroll: true });
      } catch {
      }
    }
    if (inst.opts.onClose) {
      try {
        inst.opts.onClose(inst.handle);
      } catch (err) {
        log("toast:onClose:error", err);
      }
    }
    log("toast:close", { id });
  };
  const onEnd = (e) => {
    if (e.target === el2 && (e.propertyName === "transform" || e.propertyName === "opacity"))
      finalize();
  };
  el2.addEventListener("transitionend", onEnd);
  setTimeout(finalize, REMOVE_FALLBACK);
}
function normalizeId(idOrSelector) {
  return idOrSelector.startsWith("#") ? idOrSelector.slice(1) : idOrSelector;
}
function update(target, options) {
  const id = typeof target === "string" ? normalizeId(target) : target.id;
  const inst = registry.get(id);
  if (!inst) {
    log("toast:update:not-found", id);
    return null;
  }
  const opts = inst.opts;
  if (options.title !== void 0) {
    let title = inst.el.querySelector(".ga-toast-title");
    if (!title && options.title) {
      const content = inst.el.querySelector(".ga-toast-content");
      if (content) {
        let header = content.querySelector(".ga-toast-header");
        if (!header) {
          header = document.createElement("div");
          header.className = "ga-toast-header";
          content.insertBefore(header, content.firstChild);
        }
        title = document.createElement("div");
        title.className = "ga-toast-title";
        header.appendChild(title);
      }
    }
    if (title) title.textContent = options.title;
    opts.title = options.title;
  }
  if (options.message !== void 0) {
    const useHtml = options.html ?? opts.html;
    let message = inst.el.querySelector(".ga-toast-message");
    if (!message && options.message) {
      let body = inst.el.querySelector(".ga-toast-body");
      if (!body) {
        body = document.createElement("div");
        body.className = "ga-toast-body";
        const content = inst.el.querySelector(".ga-toast-content");
        const anchor = content?.querySelector(".ga-toast-actions, .ga-toast-steps");
        if (anchor) content.insertBefore(body, anchor);
        else content?.appendChild(body);
      }
      message = document.createElement("div");
      message.className = "ga-toast-message";
      body.appendChild(message);
    }
    if (message) {
      if (useHtml) message.innerHTML = options.message;
      else message.textContent = options.message;
    }
    opts.message = options.message;
  }
  if (options.type && options.type !== opts.type) {
    const prev = opts.type;
    inst.el.classList.remove(`ga-toast-${prev}`, "ga-toast-loading");
    inst.el.classList.add(`ga-toast-${options.type}`);
    inst.el.setAttribute("data-ga-type", options.type);
    if (options.type === "loading") inst.el.classList.add("ga-toast-loading");
    if (inst.progressEl) {
      inst.progressEl.className = inst.progressEl.className.replace(
        /ga-toast-progress-\w+/,
        `ga-toast-progress-${options.type}`
      );
    }
    const iconEl = inst.el.querySelector(".ga-toast-icon");
    if (iconEl && opts.autoIcon !== false && !options.icon)
      iconEl.innerHTML = ICONS[options.type] || ICONS.info;
    opts.type = options.type;
  }
  if (options.icon !== void 0) {
    let iconEl = inst.el.querySelector(".ga-toast-icon");
    if (options.icon) {
      if (!iconEl) {
        iconEl = document.createElement("div");
        iconEl.className = "ga-toast-icon";
        const content = inst.el.querySelector(".ga-toast-content");
        inst.el.insertBefore(iconEl, content);
      }
      iconEl.innerHTML = String(options.icon);
    } else if (iconEl) {
      iconEl.remove();
    }
  }
  if (options.closable !== void 0) {
    const existing = inst.el.querySelector(":scope > .ga-toast-close");
    if (options.closable && !existing) {
      inst.el.insertBefore(createCloseButton(), inst.progressEl || null);
    } else if (!options.closable && existing) {
      existing.remove();
    }
    opts.closable = options.closable;
  }
  if (options.duration !== void 0) {
    if (inst.timer.handle != null) clearTimeout(inst.timer.handle);
    inst.timer.duration = options.duration;
    inst.timer.remaining = options.duration;
    opts.duration = options.duration;
    if (options.duration > 0 && el(inst).dataset.gaMounted) startTimer(inst);
  }
  const parent = inst.el.parentElement;
  if (parent) layout(parent);
  log("toast:update", { id });
  return inst.handle;
}
function el(inst) {
  return inst.el;
}
function closeAll() {
  for (const id of Array.from(registry.keys())) close(id);
}
function clear(type) {
  if (!type) return closeAll();
  for (const inst of Array.from(registry.values()))
    if (inst.opts.type === type) close(inst.id);
}
function getCount(type) {
  if (!type) return registry.size;
  let n = 0;
  for (const inst of registry.values()) if (inst.opts.type === type) n += 1;
  return n;
}
function exists(id) {
  return registry.has(normalizeId(id));
}
function get(id) {
  return registry.get(normalizeId(id))?.el || null;
}
function typed(type, fallbackDuration) {
  return (message, options = {}) => show({ ...options, type, message, duration: options.duration ?? fallbackDuration });
}
var success = typed("success", 5e3);
var error = typed("error", 8e3);
var warning = typed("warning", 6e3);
var info = typed("info", 4e3);
function loading(message = "Loading\u2026", options = {}) {
  return show({
    closable: false,
    ...options,
    type: "loading",
    message,
    duration: 0,
    progress: false
  });
}
function confirm(message, options = {}) {
  const { confirmText, cancelText, onConfirm, onCancel, ...rest } = options;
  return show({
    type: "warning",
    duration: 0,
    closable: false,
    swipeToClose: false,
    role: "alertdialog",
    moveFocus: true,
    modal: true,
    position: "middle-center",
    ...rest,
    message,
    actions: [
      {
        text: cancelText || "Cancel",
        className: "ga-toast-btn-secondary",
        onClick: () => onCancel?.()
      },
      {
        text: confirmText || "Confirm",
        className: "ga-toast-btn-primary",
        onClick: () => onConfirm?.()
      }
    ]
  });
}
function promise(input, messages, options = {}) {
  const p = typeof input === "function" ? input() : input;
  const handle = loading(messages.loading, options);
  return p.then(
    (value) => {
      handle.update({
        type: "success",
        message: typeof messages.success === "function" ? messages.success(value) : messages.success,
        duration: options.duration ?? 5e3,
        closable: true
      });
      return value;
    },
    (err) => {
      handle.update({
        type: "error",
        message: typeof messages.error === "function" ? messages.error(err) : messages.error,
        duration: options.duration ?? 8e3,
        closable: true
      });
      throw err;
    }
  );
}
function setDefaults(defaults) {
  globalDefaults = { ...globalDefaults, ...defaults };
}
function setLogger(fn) {
  logger = typeof fn === "function" ? fn : null;
}
function setMaxVisible(count) {
  maxVisible = Math.max(1, Math.floor(count) || 1);
  containers.forEach((container) => layout(container));
}
function custom(content, options = {}) {
  return show({ ...options, content });
}
var toast = Object.assign(
  (message, options) => info(message, options),
  {
    show,
    success,
    error,
    warning,
    info,
    loading,
    confirm,
    promise,
    custom,
    close,
    closeAll,
    dismiss: close,
    dismissAll: closeAll,
    clear,
    update,
    get,
    exists,
    getCount,
    setDefaults,
    setMaxVisible,
    setLogger,
    injectStyles
  }
);
var GaToasts = toast;
var src_default = toast;

export { GaToasts, src_default as default, toast };
