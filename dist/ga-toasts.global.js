"use strict";var GaToasts=(()=>{var H=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var rt=Object.prototype.hasOwnProperty;var it=(t,e)=>{for(var n in e)H(t,n,{get:e[n],enumerable:!0})},lt=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of st(e))!rt.call(t,l)&&l!==n&&H(t,l,{get:()=>e[l],enumerable:!(a=ot(e,l))||a.enumerable});return t};var ct=t=>lt(H({},"__esModule",{value:!0}),t);var Gt={};it(Gt,{default:()=>Vt});var $=`/**
 * GA Toasts 2.x \u2014 stylesheet.
 *
 * Self-contained: all design tokens are namespaced (--gat-*) and scoped to the
 * toast elements so they never collide with a host app's own variables.
 * Vertical position + stacking is driven by inline transforms from the engine;
 * this file only styles the cards and provides the transition timing.
 */

/* ---------------- Design tokens ---------------- */
.ga-toast-container {
  --gat-width: 380px;
  --gat-radius: 14px;
  --gat-gap: 14px;
  --gat-edge: 22px;

  --gat-font: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;

  --gat-surface: rgba(255, 255, 255, 0.82);
  --gat-surface-solid: #ffffff;
  --gat-border: rgba(15, 23, 42, 0.07);
  --gat-ring: rgba(15, 23, 42, 0.05); /* hairline definition ring */
  --gat-highlight: rgba(255, 255, 255, 0.75); /* inset top edge highlight */
  --gat-text: #0f172a;
  --gat-text-soft: #475569;
  --gat-text-muted: #64748b; /* meets WCAG AA on the surface */
  --gat-shadow: 0 1px 2px rgba(15, 23, 42, 0.05),
    0 8px 20px -12px rgba(15, 23, 42, 0.16);
  --gat-shadow-hover: 0 2px 4px -2px rgba(15, 23, 42, 0.12),
    0 14px 32px -12px rgba(15, 23, 42, 0.26);
  --gat-chip: rgba(15, 23, 42, 0.05);

  --gat-success: #16a34a;
  --gat-error: #e11d48;
  --gat-warning: #d97706;
  --gat-info: #2563eb;
  --gat-primary: #6366f1;
  --gat-secondary: #64748b;
  --gat-loading: #2563eb;

  --gat-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Dark theme \u2014 via explicit attribute/class or the OS preference. */
[data-ga-theme="dark"] .ga-toast-container,
.ga-theme-dark .ga-toast-container,
.ga-toast-container.ga-theme-dark {
  --gat-surface: rgba(24, 27, 34, 0.82);
  --gat-surface-solid: #191c22;
  --gat-border: rgba(255, 255, 255, 0.09);
  --gat-ring: rgba(255, 255, 255, 0.06);
  --gat-highlight: rgba(255, 255, 255, 0.07);
  --gat-text: #f8fafc;
  --gat-text-soft: #cbd5e1;
  --gat-text-muted: #9aa7ba;
  --gat-shadow: 0 1px 2px rgba(0, 0, 0, 0.35),
    0 10px 28px -14px rgba(0, 0, 0, 0.5);
  --gat-shadow-hover: 0 2px 6px -2px rgba(0, 0, 0, 0.5),
    0 16px 38px -12px rgba(0, 0, 0, 0.64);
  --gat-chip: rgba(255, 255, 255, 0.08);
}

/* Auto (OS) dark mode \u2014 applies ONLY when no explicit theme is set on the root,
   so an app that pins data-ga-theme="light" (like the demo) is never overridden. */
@media (prefers-color-scheme: dark) {
  :root:not([data-ga-theme]):not(.ga-theme-light):not(.ga-theme-dark) .ga-toast-container {
    --gat-surface: rgba(24, 27, 34, 0.82);
    --gat-surface-solid: #191c22;
    --gat-border: rgba(255, 255, 255, 0.09);
    --gat-ring: rgba(255, 255, 255, 0.06);
    --gat-highlight: rgba(255, 255, 255, 0.07);
    --gat-text: #f8fafc;
    --gat-text-soft: #cbd5e1;
    --gat-text-muted: #9aa7ba;
    --gat-shadow: 0 1px 2px rgba(0, 0, 0, 0.35),
      0 10px 28px -14px rgba(0, 0, 0, 0.5);
    --gat-chip: rgba(255, 255, 255, 0.08);
  }
}

/* ---------------- Modal backdrop (confirm) ---------------- */
.ga-toast-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147482990; /* just under the toast containers */
  background: rgba(10, 12, 20, 0.42);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.22s ease;
}
.ga-toast-backdrop-show { opacity: 1; }
@media (prefers-reduced-transparency: reduce) {
  .ga-toast-backdrop { backdrop-filter: none; -webkit-backdrop-filter: none; }
}

/* ---------------- Container + positioning ---------------- */
.ga-toast-container {
  position: fixed;
  z-index: 2147483000;
  width: var(--gat-width);
  max-width: calc(100vw - 2 * var(--gat-edge));
  pointer-events: none;
  font-family: var(--gat-font);
}

/* Logical inline positioning so -start/-end mirror automatically under RTL. */
.ga-toast-container-top-start { inset-block-start: var(--gat-edge); inset-inline-start: var(--gat-edge); }
.ga-toast-container-top-end { inset-block-start: var(--gat-edge); inset-inline-end: var(--gat-edge); }
.ga-toast-container-top-center {
  inset-block-start: var(--gat-edge); left: 50%; transform: translateX(-50%);
}
.ga-toast-container-bottom-start { inset-block-end: var(--gat-edge); inset-inline-start: var(--gat-edge); }
.ga-toast-container-bottom-end { inset-block-end: var(--gat-edge); inset-inline-end: var(--gat-edge); }
.ga-toast-container-bottom-center {
  inset-block-end: var(--gat-edge); left: 50%; transform: translateX(-50%);
}
.ga-toast-container-middle-start { top: 50%; inset-inline-start: var(--gat-edge); }
.ga-toast-container-middle-end { top: 50%; inset-inline-end: var(--gat-edge); }
.ga-toast-container-middle-center { top: 50%; left: 50%; transform: translateX(-50%); }

/* ---------------- Toast card ---------------- */
.ga-toast {
  position: absolute;
  inset-inline: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 11px;
  padding: 14px 16px;
  color: var(--gat-text);
  background: var(--gat-surface-solid);
  border: none;
  border-radius: var(--gat-radius);
  box-shadow:
    var(--gat-shadow),
    inset 0 1px 0 var(--gat-highlight);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(-140%);
  transition:
    transform 0.5s var(--gat-ease),
    opacity 0.35s ease,
    box-shadow 0.2s ease;
  will-change: transform, opacity;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-align: start;
  touch-action: pan-y;
  overscroll-behavior: contain;
}

/* Subtle lift on hover (shadow only \u2014 transforms are owned by the engine, so
   changing them here would fight the stack layout). */
@media (hover: hover) {
  .ga-toast:hover {
    box-shadow:
      var(--gat-shadow-hover),
      inset 0 1px 0 var(--gat-highlight);
  }
}

[data-ga-position^="top"] .ga-toast,
[data-ga-position^="middle"] .ga-toast { top: 0; transform-origin: top center; }
[data-ga-position^="bottom"] .ga-toast { bottom: 0; transform-origin: bottom center; }

.ga-toast-glass {
  background: var(--gat-surface);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

/* No leading accent stripe \u2014 the colored icon carries the type identity, for a
   cleaner, more minimal card (\xE0 la Sonner/Linear). */

.ga-toast-hide { pointer-events: none; }

/* Per-type accent colors. */
.ga-toast-success { --gat-accent: var(--gat-success); }
.ga-toast-error { --gat-accent: var(--gat-error); }
.ga-toast-warning { --gat-accent: var(--gat-warning); }
.ga-toast-info { --gat-accent: var(--gat-info); }
.ga-toast-primary { --gat-accent: var(--gat-primary); }
.ga-toast-secondary { --gat-accent: var(--gat-secondary); }
.ga-toast-loading { --gat-accent: var(--gat-loading); }

/* ---------------- Content column ---------------- */
/* The content column sits between the leading icon and the trailing close. */
.ga-toast-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.ga-toast-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* Small inline colored glyph \u2014 no chunky chip (Sonner/Linear style). Leads the
   row and aligns with the first line of text, so title-less toasts read well. */
.ga-toast-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  color: var(--gat-accent, var(--gat-info));
}
.ga-toast-icon svg { width: 1.25rem; height: 1.25rem; display: block; overflow: visible; }

.ga-toast-spinner { animation: ga-toast-spin 0.8s linear infinite; }

/* Icons draw themselves in on mount (skipped under reduced motion). */
@media (prefers-reduced-motion: no-preference) {
  .ga-toast-icon .ga-ic-ring {
    stroke-dasharray: 64;
    stroke-dashoffset: 64;
    animation: ga-toast-ic-draw 0.5s var(--gat-ease) 0.02s forwards;
  }
  .ga-toast-icon .ga-ic-draw {
    stroke-dasharray: 28;
    stroke-dashoffset: 28;
    animation: ga-toast-ic-draw 0.4s var(--gat-ease) 0.16s forwards;
  }
}
@keyframes ga-toast-ic-draw {
  to { stroke-dashoffset: 0; }
}

.ga-toast-avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--gat-border);
}

.ga-toast-unread-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gat-accent, var(--gat-info));
}

.ga-toast-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gat-text);
  flex: 1;
  min-width: 0;
  letter-spacing: -0.011em;
}
.ga-toast-title-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ga-toast-status {
  flex-shrink: 0;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  /* Darkened accent ink on a stronger tint so the small label clears AA. */
  color: var(--gat-accent, var(--gat-info));
  color: color-mix(in srgb, var(--gat-accent, var(--gat-info)) 58%, var(--gat-text));
  background: var(--gat-chip); /* fallback if color-mix is unsupported */
  background: color-mix(in srgb, var(--gat-accent, var(--gat-info)) 18%, transparent);
}

/* ---------------- Close button ---------------- */
.ga-toast-close {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: -1px;
  margin-inline-end: -4px; /* pull toward the corner without losing hit area */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 7px;
  color: var(--gat-text-muted);
  background: transparent;
  cursor: pointer;
  opacity: 0.9; /* stays >=3:1 at rest; full on hover/focus */
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.ga-toast:hover .ga-toast-close,
.ga-toast:focus-within .ga-toast-close { opacity: 1; }
.ga-toast-close svg { width: 15px; height: 15px; display: block; }
.ga-toast-close:hover {
  background: var(--gat-chip);
  color: var(--gat-text);
}
/* currentColor is guaranteed to contrast with its own surface (white on filled,
   muted on default, etc.), so the focus ring is never accent-on-accent. */
.ga-toast-close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* ---------------- Body ---------------- */
.ga-toast-body { min-width: 0; }
.ga-toast-meta {
  font-size: 0.75rem;
  color: var(--gat-text-muted);
  margin-bottom: 2px;
}
.ga-toast-message {
  color: var(--gat-text-soft);
  font-size: 0.85rem;
  word-break: break-word;
  /* Clamp very long content so a toast can't fill the viewport. */
  max-height: 40vh;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.ga-toast-message a {
  color: var(--gat-accent, var(--gat-info));
  font-weight: 500;
  text-decoration: underline; /* affordance beyond color (WCAG 1.4.1) */
}

/* When there's no header, let the message carry the toast on its own \u2014 but not
   on filled toasts, whose message must stay light (specificity guard). */
.ga-toast:not([class*="-filled"]) .ga-toast-content > .ga-toast-body:only-child .ga-toast-message {
  color: var(--gat-text);
}

/* ---------------- Actions ---------------- */
.ga-toast-actions {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}
.ga-toast-btn {
  flex: 1;
  padding: 8px 14px;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9px;
  border: 1px solid var(--gat-border);
  background: var(--gat-chip);
  color: var(--gat-text);
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease;
}
.ga-toast-btn:hover { filter: brightness(0.97); }
.ga-toast-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.ga-toast-btn-primary {
  background: var(--gat-accent, var(--gat-primary));
  border-color: transparent;
  color: #fff;
}
.ga-toast-btn-primary:hover { filter: brightness(1.06); }

/* ---------------- Progress bar ---------------- */
.ga-toast-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  transform: scaleX(1);
  transform-origin: left center;
  background: var(--gat-accent, var(--gat-info));
  opacity: 0.4; /* a quiet hint, not a slab */
}
.ga-toast-progress-top { top: 0; bottom: auto; }

/* ---------------- Segmented steps ---------------- */
.ga-toast-steps { display: flex; gap: 4px; margin-top: 4px; }
.ga-toast-step {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: var(--gat-chip);
}
.ga-toast-step-active { background: var(--gat-accent, var(--gat-info)); }

/* ---------------- Variants ---------------- */
/* Filled: solid accent, white ink, white stroke glyph directly on the fill.
   Per-type fills are darkened where needed so white body text clears WCAG AA
   (4.5:1); no top sheen (it dragged the top region under AA). */
.ga-toast[class*="-filled"] {
  background: var(--gat-accent, var(--gat-info));
  border-color: transparent;
  color: #fff;
}
.ga-toast-success[class*="-filled"] { background: #15803d; } /* white \u2248 5.0:1 */
.ga-toast-primary[class*="-filled"] { background: #4f46e5; } /* white \u2248 6.3:1 */
.ga-toast[class*="-filled"] .ga-toast-title,
.ga-toast[class*="-filled"] .ga-toast-message,
.ga-toast[class*="-filled"] .ga-toast-meta,
.ga-toast[class*="-filled"] .ga-toast-icon,
.ga-toast[class*="-filled"] .ga-toast-close { color: #fff; }
.ga-toast[class*="-filled"] .ga-toast-close:hover { background: rgba(255, 255, 255, 0.2); }
/* Accent-colored bits would vanish on the accent fill \u2014 force them light. */
.ga-toast[class*="-filled"] .ga-toast-progress { background: #fff; opacity: 0.55; }
.ga-toast[class*="-filled"] .ga-toast-step { background: rgba(255, 255, 255, 0.28); }
.ga-toast[class*="-filled"] .ga-toast-step-active { background: #fff; }
.ga-toast[class*="-filled"] .ga-toast-status {
  color: #fff;
  background: rgba(255, 255, 255, 0.22);
}
.ga-toast[class*="-filled"] .ga-toast-message a { color: #fff; text-decoration: underline; }

/* Amber is too light for white text \u2014 filled warnings use dark ink throughout. */
.ga-toast-warning[class*="-filled"],
.ga-toast-warning[class*="-filled"] .ga-toast-title,
.ga-toast-warning[class*="-filled"] .ga-toast-message,
.ga-toast-warning[class*="-filled"] .ga-toast-meta,
.ga-toast-warning[class*="-filled"] .ga-toast-icon,
.ga-toast-warning[class*="-filled"] .ga-toast-close,
.ga-toast-warning[class*="-filled"] .ga-toast-message a {
  color: #2e2100; /* \u2248 5.2:1 on the amber fill */
}
.ga-toast-warning[class*="-filled"] .ga-toast-progress { background: #2e2100; opacity: 0.6; }
.ga-toast-warning[class*="-filled"] .ga-toast-step { background: rgba(0, 0, 0, 0.18); }
.ga-toast-warning[class*="-filled"] .ga-toast-step-active { background: #2e2100; }
.ga-toast-warning[class*="-filled"] .ga-toast-status {
  color: #2e2100;
  background: rgba(0, 0, 0, 0.16);
}
.ga-toast-warning[class*="-filled"] .ga-toast-close:hover { background: rgba(0, 0, 0, 0.14); }

/* Light: a translucent accent wash over the (translucent) surface so glass still
   shows through, plus an accent-tinted border. Secondary text is darkened to
   keep AA over the tint. */
.ga-toast[class*="-light"] {
  background: var(--gat-surface); /* stays translucent \u2192 glass blur still works */
  background-image: linear-gradient(
    0deg,
    color-mix(in srgb, var(--gat-accent, var(--gat-info)) 14%, transparent),
    color-mix(in srgb, var(--gat-accent, var(--gat-info)) 14%, transparent)
  );
  border-color: color-mix(in srgb, var(--gat-accent, var(--gat-info)) 38%, var(--gat-border));
}
.ga-toast[class*="-light"] .ga-toast-meta { color: var(--gat-text-soft); }
.ga-toast[class*="-light"] .ga-toast-message a {
  color: color-mix(in srgb, var(--gat-accent, var(--gat-info)) 55%, var(--gat-text));
  text-decoration: underline;
}

/* ---------------- Sizes (density) ---------------- */
.ga-toast-xs { padding: 10px 13px; font-size: 0.78rem; }
.ga-toast-xs .ga-toast-icon svg { width: 1.05rem; height: 1.05rem; }
.ga-toast-xs .ga-toast-message { font-size: 0.78rem; }
.ga-toast-sm { padding: 12px 15px; }
.ga-toast-lg { padding: 18px 20px; }
.ga-toast-lg .ga-toast-title { font-size: 1rem; }
.ga-toast-lg .ga-toast-message { font-size: 0.95rem; }
.ga-toast-lg .ga-toast-icon svg { width: 1.4rem; height: 1.4rem; }
.ga-toast-xl { padding: 22px 24px; }
.ga-toast-xl .ga-toast-title { font-size: 1.125rem; }
.ga-toast-xl .ga-toast-message { font-size: 1.05rem; }
.ga-toast-xl .ga-toast-icon svg { width: 1.6rem; height: 1.6rem; }

/* ---------------- Compact ---------------- */
/* The card is already an icon \xB7 content \xB7 close row, so compact just tightens
   the padding and vertically centres the single line. */
.ga-toast-compact {
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
}
.ga-toast-compact .ga-toast-content { gap: 2px; }
.ga-toast-compact .ga-toast-icon { margin-top: 0; }
.ga-toast-compact .ga-toast-close { align-self: center; margin-top: 0; }
.ga-toast-compact .ga-toast-steps { display: none; }
.ga-toast-compact .ga-toast-icon svg { width: 1.05rem; height: 1.05rem; }

/* ---------------- Live region (screen-reader only) ---------------- */
.ga-toast-live-region {
  position: fixed;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 520px) {
  .ga-toast-container {
    --gat-width: auto;
    left: var(--gat-edge);
    right: var(--gat-edge);
    transform: none;
  }
  .ga-toast-container-top-center,
  .ga-toast-container-bottom-center,
  .ga-toast-container-middle-center { transform: none; }
}

/* ---------------- RTL ---------------- */
[dir="rtl"] .ga-toast-progress { transform-origin: right center; }

/* ---------------- Reduced motion ---------------- */
@media (prefers-reduced-motion: reduce) {
  .ga-toast {
    transition: opacity 0.15s ease;
  }
  .ga-toast-spinner { animation-duration: 1.4s; }
}

/* ---------------- Reduced transparency ---------------- */
@media (prefers-reduced-transparency: reduce) {
  .ga-toast-glass {
    background: var(--gat-surface-solid);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

/* ---------------- Custom content (toast.custom) ---------------- */
.ga-toast-custom { min-width: 0; }
.ga-toast-has-custom { padding: 0; }
.ga-toast-has-custom .ga-toast-close {
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  z-index: 1;
}

@keyframes ga-toast-spin {
  to { transform: rotate(360deg); }
}
`;var p=typeof window<"u"&&typeof document<"u",dt="ga-toast",X="ga-toasts-styles",gt=14,B=14,ut=3,ft=450,g=new Map,R=new Map,A={},S=null,b=null,F=!1,q=!1,D=0,v=null,h=null,x='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',E={success:`${x}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M7.75 12.5l2.75 2.75L16.5 9" class="ga-ic-draw"/></svg>`,error:`${x}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M15 9l-6 6M9 9l6 6" class="ga-ic-draw"/></svg>`,warning:`${x}<path d="M12 3.6 2.4 20.4h19.2L12 3.6z" class="ga-ic-ring"/><path d="M12 10v4" class="ga-ic-draw"/><path d="M12 17.4v.01"/></svg>`,info:`${x}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M12 11v5" class="ga-ic-draw"/><path d="M12 7.6v.01"/></svg>`,primary:`${x}<path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77 6.8 19.5l.99-5.79-4.21-4.1 5.82-.85L12 3.5z" class="ga-ic-draw"/></svg>`,secondary:`${x}<path d="M6 9a6 6 0 0112 0c0 4.5 1.8 5.6 1.8 5.6H4.2S6 13.5 6 9z" class="ga-ic-draw"/><path d="M10 19a2 2 0 004 0"/></svg>`,loading:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" class="ga-toast-spinner"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 3a9 9 0 019 9"/></svg>'},pt='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',K=new Set(["error","warning"]);function U(){return typeof performance<"u"?performance.now():Date.now()}function j(){D+=1;let t=Math.random().toString(36).slice(2,8);return`${dt}-${D}-${t}`}function w(t,e){if(S)try{S(t,e)}catch{}}function mt(){return p&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function J(){if(!p||document.getElementById(X))return;let t=document.createElement("style");t.id=X,t.textContent=$,document.head.appendChild(t)}function ht(){if(!p||b&&b.polite.isConnected&&b.assertive.isConnected)return;let t=e=>{let n=document.createElement("div");return n.className="ga-toast-live-region",n.setAttribute("aria-live",e),n.setAttribute("aria-atomic","true"),n.setAttribute("role",e==="assertive"?"alert":"status"),document.body.appendChild(n),n};b={polite:t("polite"),assertive:t("assertive")}}function bt(t,e){if(!t||(ht(),!b))return;let n=e?b.assertive:b.polite;n.textContent="",window.setTimeout(()=>{n.textContent=t},50)}var vt=["top-start","top-center","top-end","middle-start","middle-center","middle-end","bottom-start","bottom-center","bottom-end"];function Q(t){return t.startsWith("bottom")?-1:1}function yt(){return p?(document.documentElement.getAttribute("dir")||document.body&&document.body.getAttribute("dir"))==="rtl":!1}function Z(t){let e="translateX(-115%)",n="translateX(115%)",a=yt();return t.endsWith("start")?a?n:e:t.endsWith("end")?a?e:n:Q(t)===1?"translateY(-140%)":"translateY(140%)"}function xt(t){let e=R.get(t);if(e&&e.isConnected)return e;let n=document.createElement("div");n.className=`ga-toast-container ga-toast-container-${t}`,n.setAttribute("data-ga-position",t),n.setAttribute("role","region"),n.setAttribute("aria-label","Notifications");let a=()=>Y(n,!0),l=()=>Y(n,!1);return n.addEventListener("pointerenter",a),n.addEventListener("pointerleave",l),n.addEventListener("focusin",a),n.addEventListener("focusout",c=>{n.contains(c.relatedTarget)||l()}),document.body.appendChild(n),R.set(t,n),n}function Y(t,e){t.dataset.gaExpanded==="true"!==e&&(t.dataset.gaExpanded=e?"true":"false",y(t))}function wt(t){return Array.from(t.children).map(e=>g.get(e.id)).filter(e=>!!e)}function y(t){let e=wt(t),n=t.dataset.gaPosition||"top-end",a=Q(n),l=t.dataset.gaExpanded==="true",c=mt(),r=e.slice().reverse();t.style.setProperty("--ga-toasts-count",String(r.length));let s=0;r.forEach((o,i)=>{if(o.closing)return;if(!o.el.dataset.gaMounted){s+=o.height+B;return}let d,u,m;l||c?(d=a*s,u=1,m=1):(d=a*i*gt,u=Math.max(1-i*.05,.85),m=i>=ut?0:1);let nt=o.swipeX?` translateX(${o.swipeX}px)`:"",at=n.startsWith("middle")?`calc(-50% + ${d}px)`:`${d}px`;o.el.style.transform=`translateY(${at})${nt} scale(${u})`,o.el.style.opacity=o.swipeX?String(Tt(o.swipeX)):String(m),o.el.style.zIndex=String(1e3+r.length-i),o.el.style.pointerEvents=m===0?"none":"auto",o.el.setAttribute("aria-hidden",m===0?"true":"false"),s+=o.height+B})}function Tt(t){return Math.max(.15,1-Math.abs(t)/220)}function W(t){let e=t.el.offsetHeight;e>0&&(t.height=e)}function Et(t){let e={type:"info",duration:5e3,closable:!0,position:"top-end",animation:"slide",swipeToClose:!0,closeOnEscape:!0,progress:!0,progressPosition:"bottom",pauseOnHover:!0,pauseOnPageHidden:!0,autoIcon:!0,glassmorphism:!0,html:!1,...A,...t};return e.position=e.position||"top-end",vt.includes(e.position)||(e.position="top-end"),e}function O(){let t=document.createElement("button");return t.type="button",t.className="ga-toast-close",t.setAttribute("aria-label","Close notification"),t.setAttribute("data-ga-close",""),t.innerHTML=pt,t}function V(t,e,n){if(!e.progress||(e.duration||0)<=0||e.progressPosition==="none")return null;let a=document.createElement("div");return a.className=`ga-toast-progress ga-toast-progress-${n}`+(e.progressPosition==="top"?" ga-toast-progress-top":""),t.appendChild(a),a}function kt(t,e){let n=t.type||"info",a=document.createElement("div");a.id=e,a.className=["ga-toast",`ga-toast-${n}`,t.size?`ga-toast-${t.size}`:"",t.variant?`ga-toast-${n}-${t.variant}`:"",t.animation||"",t.compact?"ga-toast-compact":"",t.glassmorphism?"ga-toast-glass":"",n==="loading"?"ga-toast-loading":"",t.className||""].filter(Boolean).join(" ");let l=t.role||(K.has(n)?"alert":"status");if(a.setAttribute("role",l),a.setAttribute("aria-live","off"),a.setAttribute("data-ga-type",n),l==="alertdialog"||l==="dialog"){let s=[t.title,t.message].filter(Boolean).join(". ");s&&a.setAttribute("aria-label",s)}if(t.content!=null){a.classList.add("ga-toast-has-custom");let s=document.createElement("div");s.className="ga-toast-custom";let o=typeof t.content=="function"?t.content():t.content;return typeof o=="string"?s.innerHTML=o:o instanceof HTMLElement&&s.appendChild(o),a.appendChild(s),t.closable&&a.appendChild(O()),{el:a,progressEl:V(a,t,n)}}if(t.avatar){let s=document.createElement("img");s.className="ga-toast-avatar",s.src=t.avatar,s.alt=t.avatarAlt||t.title||"Notification",a.appendChild(s)}let c=null;if(t.icon?c=String(t.icon):t.icon!==!1&&t.autoIcon!==!1&&!t.avatar&&(c=E[n]||E.info),c){let s=document.createElement("div");s.className="ga-toast-icon",s.innerHTML=c,a.appendChild(s)}let r=document.createElement("div");if(r.className="ga-toast-content",t.title||t.showStatus||t.unread){let s=document.createElement("div");if(s.className="ga-toast-header",t.unread){let o=document.createElement("span");o.className="ga-toast-unread-dot",s.appendChild(o)}if(t.title){let o=document.createElement("div");o.className="ga-toast-title"+(t.truncateTitle?" ga-toast-title-truncate":""),o.textContent=t.title,s.appendChild(o)}if(t.showStatus){let o=document.createElement("span");o.className="ga-toast-status";let i=String(t.statusText||n);o.textContent=i.charAt(0).toUpperCase()+i.slice(1),s.appendChild(o)}r.appendChild(s)}if(t.message||t.meta){let s=document.createElement("div");if(s.className="ga-toast-body",t.meta){let o=document.createElement("div");o.className="ga-toast-meta",o.textContent=t.meta,s.appendChild(o)}if(t.message){let o=document.createElement("div");o.className="ga-toast-message",t.html?o.innerHTML=t.message:o.textContent=t.message,s.appendChild(o)}r.appendChild(s)}if(t.actions&&t.actions.length&&!t.compact){let s=document.createElement("div");s.className="ga-toast-actions";for(let o of t.actions){let i=document.createElement("button");i.type="button",i.className=["ga-toast-btn",o.className||o.class||"ga-toast-btn-secondary"].join(" "),i.textContent=o.text,i.setAttribute("data-ga-action",""),s.appendChild(i)}r.appendChild(s)}if(t.steps&&t.steps>1){let s=document.createElement("div");s.className="ga-toast-steps";let o=Math.min(t.steps,Math.max(1,t.currentStep||1));for(let i=1;i<=t.steps;i+=1){let d=document.createElement("div");d.className="ga-toast-step"+(i<=o?" ga-toast-step-active":""),s.appendChild(d)}r.appendChild(s)}return a.appendChild(r),t.closable&&a.appendChild(O()),{el:a,progressEl:V(a,t,n)}}function P(t){let{timer:e}=t;e.duration<=0||e.remaining<=0||(e.paused=!1,e.startedAt=U(),e.handle=setTimeout(()=>f(t.id),e.remaining),Ct(t,e.remaining))}function k(t){let{timer:e}=t;if(e.paused||e.handle==null)return;clearTimeout(e.handle),e.handle=null,e.paused=!0;let n=U()-e.startedAt;e.remaining=Math.max(0,e.remaining-n),Lt(t)}function C(t){t.timer.paused&&P(t)}function Ct(t,e){let n=t.progressEl;if(!n)return;let a=t.timer.duration>0?e/t.timer.duration:0;n.style.transition="none",n.style.transform=`scaleX(${a})`,n.offsetWidth,n.style.transition=`transform ${e}ms linear`,n.style.transform="scaleX(0)"}function Lt(t){let e=t.progressEl;if(!e)return;let n=t.timer.duration>0?t.timer.remaining/t.timer.duration:0;e.style.transition="none",e.style.transform=`scaleX(${n})`}function Mt(t,e){let{el:n,controller:a}=t,l=a.signal;n.addEventListener("click",c=>{let r=c.target;if(r.closest("[data-ga-close]")){c.preventDefault(),f(t.id);return}let s=r.closest("[data-ga-action]");if(s&&e.actions){let o=Array.from(s.parentElement?.children||[]).indexOf(s),i=e.actions[o];if(i){let d=i.onClick||i.click;d&&d(c,t.handle),i.closeOnClick!==!1&&f(t.id)}return}e.clickToClose&&!r.closest(".ga-toast-actions")&&f(t.id)},{signal:l}),e.pauseOnHover&&(n.addEventListener("pointerenter",()=>k(t),{signal:l}),n.addEventListener("pointerleave",()=>C(t),{signal:l}),n.addEventListener("focusin",()=>k(t),{signal:l}),n.addEventListener("focusout",()=>C(t),{signal:l})),e.swipeToClose&&Ht(t),e.modal&&n.addEventListener("keydown",c=>{if(c.key!=="Tab")return;let r=n.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(!r.length)return;let s=r[0],o=r[r.length-1],i=document.activeElement;c.shiftKey&&i===s?(c.preventDefault(),o.focus()):!c.shiftKey&&i===o&&(c.preventDefault(),s.focus())},{signal:l})}function Ht(t){let{el:e,controller:n}=t,a=n.signal,l=70,c=!1,r=0,s=0;e.addEventListener("pointerdown",i=>{if(!(i.pointerType==="mouse"&&i.button!==0)&&!i.target.closest("button, a, input, textarea, select")){c=!0,r=i.clientX,s=i.clientY,k(t);try{e.setPointerCapture(i.pointerId)}catch{}}},{signal:a}),e.addEventListener("pointermove",i=>{if(!c)return;let d=i.clientX-r,u=i.clientY-s;if(Math.abs(d)<6||Math.abs(d)<Math.abs(u))return;i.preventDefault(),t.swipeX=d;let m=e.parentElement;m&&y(m)},{signal:a});let o=i=>{if(!c)return;c=!1;let d=i.clientX-r;if(Math.abs(d)>l){let u=d>0?1:-1;t.el.style.transition="transform 0.2s ease, opacity 0.2s ease",t.el.style.transform=`translateX(${u*400}px)`,t.el.style.opacity="0",f(t.id)}else{t.swipeX=0;let u=e.parentElement;u&&y(u),C(t)}};e.addEventListener("pointerup",o,{signal:a}),e.addEventListener("pointercancel",o,{signal:a})}function At(){F||!p||(F=!0,document.addEventListener("keydown",t=>{if(t.key!=="Escape")return;let e=null;for(let n of g.values())n.closing||n.opts.closeOnEscape===!1||!n.opts.closable||(e=n);e&&f(e.id)}))}function St(){q||!p||typeof document.addEventListener!="function"||(q=!0,document.addEventListener("visibilitychange",()=>{let t=document.hidden;for(let e of g.values())e.closing||e.opts.pauseOnPageHidden===!1||(t?k(e):typeof e.el.matches=="function"&&e.el.matches(":hover")||C(e))}))}function Ot(){if(!p)return;h||(h=document.createElement("div"),h.className="ga-toast-backdrop"),h.isConnected||document.body.appendChild(h);let t=h;requestAnimationFrame(()=>t.classList.add("ga-toast-backdrop-show"))}function Nt(){if(!h)return;let t=h;t.classList.remove("ga-toast-backdrop-show"),setTimeout(()=>{v==null&&t.parentNode&&t.remove()},220)}function G(t){let e={id:t,el:p?document.createElement("div"):{},update:()=>e,close:()=>{}};return e}function T(t={}){if(!p)return G(t.id||j());let e=Et(t);if(e.id&&g.has(e.id))return N(e.id,t)||G(e.id);if(e.modal){if(v&&g.has(v))return g.get(v).handle;e.swipeToClose=!1,e.closeOnEscape=!1,e.moveFocus=!0}J(),At(),St();let n=e.id||j(),{el:a,progressEl:l}=kt(e,n),c=new AbortController,r={duration:e.duration||0,remaining:e.duration||0,startedAt:0,handle:null,paused:!1},s={id:n,el:a,update:d=>(N(n,d),s),close:()=>f(n)},o={id:n,el:a,handle:s,opts:e,controller:c,progressEl:l,timer:r,height:0,closing:!1,swipeX:0,resizeObserver:null,prevFocus:e.moveFocus?document.activeElement:null};g.set(n,o),e.modal&&(v=n,a.setAttribute("aria-modal","true"),Ot());let i=xt(e.position);if(a.style.transform=Z(e.position),a.style.opacity="0",i.appendChild(a),Mt(o,e),typeof ResizeObserver<"u"&&(o.resizeObserver=new ResizeObserver(()=>{W(o);let d=a.parentElement;d&&y(d)}),o.resizeObserver.observe(a)),requestAnimationFrame(()=>{requestAnimationFrame(()=>{if(g.has(n)&&(W(o),a.dataset.gaMounted="true",a.style.opacity="1",y(i),P(o),e.moveFocus)){let d=a.querySelector("[data-ga-action]")||a;d===a&&(a.tabIndex=-1);try{d.focus({preventScroll:!0})}catch{}}})}),!e.modal&&e.role!=="alertdialog"&&bt([e.title,e.message].filter(Boolean).join(". "),K.has(e.type||"info")),e.onShow)try{e.onShow(s)}catch(d){w("toast:onShow:error",d)}return w("toast:show",{id:n,type:e.type}),s}function f(t){if(!t)return;let e=typeof t=="string"?L(t):t.id,n=g.get(e);if(!n||n.closing)return;n.closing=!0,n.timer.handle!=null&&(clearTimeout(n.timer.handle),n.timer.handle=null),n.controller.abort(),n.resizeObserver?.disconnect();let{el:a}=n,l=a.parentElement;n.swipeX||(a.style.transition="",a.classList.add("ga-toast-hide"),a.style.transform=Z(n.opts.position),a.style.opacity="0");let c=!1,r=()=>{if(c)return;c=!0,a.removeEventListener("transitionend",s),g.delete(e),a.remove(),v===e&&(v=null,Nt()),l&&y(l);let o=n.prevFocus;if(o&&typeof o.focus=="function"&&document.contains(o))try{o.focus({preventScroll:!0})}catch{}if(n.opts.onClose)try{n.opts.onClose(n.handle)}catch(i){w("toast:onClose:error",i)}w("toast:close",{id:e})},s=o=>{o.target===a&&(o.propertyName==="transform"||o.propertyName==="opacity")&&r()};a.addEventListener("transitionend",s),setTimeout(r,ft)}function L(t){return t.startsWith("#")?t.slice(1):t}function N(t,e){let n=typeof t=="string"?L(t):t.id,a=g.get(n);if(!a)return w("toast:update:not-found",n),null;let l=a.opts;if(e.title!==void 0){let r=a.el.querySelector(".ga-toast-title");if(!r&&e.title){let s=a.el.querySelector(".ga-toast-content");if(s){let o=s.querySelector(".ga-toast-header");o||(o=document.createElement("div"),o.className="ga-toast-header",s.insertBefore(o,s.firstChild)),r=document.createElement("div"),r.className="ga-toast-title",o.appendChild(r)}}r&&(r.textContent=e.title),l.title=e.title}if(e.message!==void 0){let r=e.html??l.html,s=a.el.querySelector(".ga-toast-message");if(!s&&e.message){let o=a.el.querySelector(".ga-toast-body");if(!o){o=document.createElement("div"),o.className="ga-toast-body";let i=a.el.querySelector(".ga-toast-content"),d=i?.querySelector(".ga-toast-actions, .ga-toast-steps");d?i.insertBefore(o,d):i?.appendChild(o)}s=document.createElement("div"),s.className="ga-toast-message",o.appendChild(s)}s&&(r?s.innerHTML=e.message:s.textContent=e.message),l.message=e.message}if(e.type&&e.type!==l.type){let r=l.type;a.el.classList.remove(`ga-toast-${r}`,"ga-toast-loading"),a.el.classList.add(`ga-toast-${e.type}`),a.el.setAttribute("data-ga-type",e.type),e.type==="loading"&&a.el.classList.add("ga-toast-loading"),a.progressEl&&(a.progressEl.className=a.progressEl.className.replace(/ga-toast-progress-\w+/,`ga-toast-progress-${e.type}`));let s=a.el.querySelector(".ga-toast-icon");s&&l.autoIcon!==!1&&!e.icon&&(s.innerHTML=E[e.type]||E.info),l.type=e.type}if(e.icon!==void 0){let r=a.el.querySelector(".ga-toast-icon");if(e.icon){if(!r){r=document.createElement("div"),r.className="ga-toast-icon";let s=a.el.querySelector(".ga-toast-content");a.el.insertBefore(r,s)}r.innerHTML=String(e.icon)}else r&&r.remove()}if(e.closable!==void 0){let r=a.el.querySelector(":scope > .ga-toast-close");e.closable&&!r?a.el.insertBefore(O(),a.progressEl||null):!e.closable&&r&&r.remove(),l.closable=e.closable}e.duration!==void 0&&(a.timer.handle!=null&&clearTimeout(a.timer.handle),a.timer.duration=e.duration,a.timer.remaining=e.duration,l.duration=e.duration,e.duration>0&&Pt(a).dataset.gaMounted&&P(a));let c=a.el.parentElement;return c&&y(c),w("toast:update",{id:n}),a.handle}function Pt(t){return t.el}function tt(){for(let t of Array.from(g.keys()))f(t)}function It(t){if(!t)return tt();for(let e of Array.from(g.values()))e.opts.type===t&&f(e.id)}function zt(t){if(!t)return g.size;let e=0;for(let n of g.values())n.opts.type===t&&(e+=1);return e}function $t(t){return g.has(L(t))}function Xt(t){return g.get(L(t))?.el||null}function M(t,e){return(n,a={})=>T({...a,type:t,message:n,duration:a.duration??e})}var Bt=M("success",5e3),Rt=M("error",8e3),Ft=M("warning",6e3),_=M("info",4e3);function et(t="Loading\u2026",e={}){return T({closable:!1,...e,type:"loading",message:t,duration:0,progress:!1})}function qt(t,e={}){let{confirmText:n,cancelText:a,onConfirm:l,onCancel:c,...r}=e;return T({type:"warning",duration:0,closable:!1,swipeToClose:!1,role:"alertdialog",moveFocus:!0,modal:!0,position:"middle-center",...r,message:t,actions:[{text:a||"Cancel",className:"ga-toast-btn-secondary",onClick:()=>c?.()},{text:n||"Confirm",className:"ga-toast-btn-primary",onClick:()=>l?.()}]})}function Dt(t,e,n={}){let a=typeof t=="function"?t():t,l=et(e.loading,n);return a.then(c=>(l.update({type:"success",message:typeof e.success=="function"?e.success(c):e.success,duration:n.duration??5e3,closable:!0}),c),c=>{throw l.update({type:"error",message:typeof e.error=="function"?e.error(c):e.error,duration:n.duration??8e3,closable:!0}),c})}function jt(t){A={...A,...t}}function Yt(t){S=typeof t=="function"?t:null}function Wt(t,e={}){return T({...e,content:t})}var I=Object.assign((t,e)=>_(t,e),{show:T,success:Bt,error:Rt,warning:Ft,info:_,loading:et,confirm:qt,promise:Dt,custom:Wt,close:f,closeAll:tt,clear:It,update:N,get:Xt,exists:$t,getCount:zt,setDefaults:jt,setLogger:Yt,injectStyles:J}),z=I;z.toast=I;var Vt=z;return ct(Gt);})();
GaToasts=GaToasts.default;
