/**
 * GA Toasts — modern, accessible, dependency-free toast notifications.
 *
 * Design goals of the 2.x rewrite:
 *  - Every toast owns its state (element, timer, listeners) in a registry, so
 *    closing/updating never leaves dangling timers or crashes.
 *  - Listeners are attached through a per-toast AbortController and torn down in
 *    one call — no `cloneNode` tricks.
 *  - Messages are rendered as text by default (`html: true` to opt into markup).
 *  - Screen readers are notified through a persistent `aria-live` region.
 *  - The stacked layout is computed in JS (a single transform per toast).
 *
 * Configurability (2.1): every instance is minted by `makeToaster(config)`.
 * The default export `toast` is one such instance; `createToaster(config)`
 * spins up isolated, independently-themed toasters (own registry, containers,
 * theme, icons, defaults, mount root). Theming writes `--gat-*` custom
 * properties through a per-instance scoped <style> so dark-mode rules still win.
 */

import { css as styles } from './styles.generated';

/* ------------------------------------------------------------------ *
 * Public types
 * ------------------------------------------------------------------ */

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'loading';

export type ToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle-start'
  | 'middle-center'
  | 'middle-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export type ToastAnimation =
  | 'fade'
  | 'slide'
  | 'bounce'
  | 'scale'
  | 'zoom'
  | 'flip'
  | 'swing'
  | 'drop'
  | 'none';
export type ToastVariant = '' | 'filled' | 'light';
export type ToastSize = '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ToastProgressPosition = 'top' | 'bottom' | 'none';

export interface ToastAction {
  text: string;
  /** Extra class(es) for the button. */
  className?: string;
  /** @deprecated use `className` */
  class?: string;
  /** Click handler; receives the event and the toast handle. */
  onClick?: (event: MouseEvent, handle: ToastHandle) => void;
  /** @deprecated use `onClick` */
  click?: (event: MouseEvent, handle: ToastHandle) => void;
  /** Close the toast automatically after the handler runs (default true). */
  closeOnClick?: boolean;
}

export interface ToastOptions {
  /** Explicit id. If a toast with this id exists it is updated instead of duplicated. */
  id?: string;
  title?: string;
  message?: string;
  /** Small muted line above the message (e.g. a timestamp). */
  meta?: string;
  type?: ToastType;
  /** Auto-close delay in ms. `0` (or negative) means the toast is sticky. */
  duration?: number;
  closable?: boolean;
  position?: ToastPosition;
  /** Custom icon markup, or `false`/`null` to hide the icon entirely. */
  icon?: string | null | false;
  actions?: ToastAction[];
  size?: ToastSize;
  variant?: ToastVariant;
  animation?: ToastAnimation;
  /** Treat the whole toast as a button that closes on click. */
  clickToClose?: boolean;
  /** Allow dismissing by dragging horizontally (pointer/touch). Default true. */
  swipeToClose?: boolean;
  /** Render `message` as HTML instead of escaped text. Default false. */
  html?: boolean;
  /** Avatar image URL shown before the title. */
  avatar?: string | null;
  avatarAlt?: string;
  /** Show an unread dot. */
  unread?: boolean;
  truncateTitle?: boolean;
  /** Show the countdown progress bar. Default true. */
  progress?: boolean;
  progressPosition?: ToastProgressPosition;
  /** Pause the countdown while hovered/focused. Default true. */
  pauseOnHover?: boolean;
  /** Pause the countdown while the tab is backgrounded. Default true. */
  pauseOnPageHidden?: boolean;
  /** Dismiss the newest toast when Escape is pressed. Default true. */
  closeOnEscape?: boolean;
  /** Denser layout with reduced padding. */
  compact?: boolean;
  /** Show a small status chip (defaults to the capitalized type). */
  showStatus?: boolean;
  statusText?: string;
  /** Automatically pick an icon based on `type`. Default true. */
  autoIcon?: boolean;
  /** Frosted-glass background. Default true. */
  glassmorphism?: boolean;
  /** Segmented progress: total steps. */
  steps?: number;
  /** Segmented progress: current (1-based) step. */
  currentStep?: number;
  /** Extra class name(s) added to the toast root. */
  className?: string;
  /** ARIA role. Defaults to `alert` for error/warning, `status` otherwise. */
  role?: string;
  /**
   * Arbitrary content instead of the default title/message layout. A string is
   * inserted as HTML (dev-authored, so trusted); an element/function is used as-is.
   */
  content?: string | HTMLElement | (() => HTMLElement | string);
  /**
   * Move keyboard focus into the toast when shown and restore it on close.
   * Used by `confirm()`; opt in for other actionable toasts.
   */
  moveFocus?: boolean;
  /**
   * Render as a modal: a backdrop blocks the rest of the page and focus is
   * trapped until an action is taken. Only one modal toast can be open at a
   * time — further modal calls are ignored until it closes. Used by `confirm()`.
   */
  modal?: boolean;
  onShow?: (handle: ToastHandle) => void;
  onClose?: (handle: ToastHandle) => void;
}

export interface ConfirmOptions extends ToastOptions {
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface PromiseMessages<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
}

/** Handle returned from every toast; lets you update or close it later. */
export interface ToastHandle {
  readonly id: string;
  readonly el: HTMLElement;
  update(options: Partial<ToastOptions>): ToastHandle;
  close(): void;
}

/* ---- configuration types ---- */

export type PresetName = 'soft' | 'solid' | 'minimal' | 'sharp' | 'material';

/** Design tokens. Any omitted key keeps its default. Numbers → px where sensible. */
export interface ThemeTokens {
  /** Start from a named preset, then override with the tokens below. */
  preset?: PresetName;
  width?: number | string;
  radius?: number | string;
  gap?: number | string;
  edge?: number | string;
  font?: string;
  /** Padding + font-size scale. */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Shadow depth preset. */
  elevation?: 'flat' | 'raised' | 'floating';
  /** Card background style. */
  surface?: 'glass' | 'solid' | 'outline';
  /** Width of the colored leading accent bar (0 = none). */
  accentEdge?: number | string;
  /** Countdown indicator style. */
  progress?: 'bar' | 'ring' | 'none';
  /** Primary accent (maps to the `primary` type + generic accents). */
  accent?: string;
  /** Per-type accent colors. */
  colors?: Partial<Record<ToastType, string>>;
  text?: string;
  textSoft?: string;
  textMuted?: string;
  /** Card surface color (sets both frosted + solid tokens). */
  surfaceColor?: string;
  border?: string;
  shadow?: string;
  chip?: string;
  ease?: string;
  /** Token overrides applied only under the dark theme. */
  dark?: Partial<ThemeTokens>;
}

export interface StackConfig {
  /** px each stacked card peeks out when collapsed. */
  peek?: number;
  /** px gap between cards when expanded. */
  gap?: number;
  /** per-index scale reduction when collapsed (default 0.05). */
  scaleStep?: number;
  /** When the stack fans out. `hover` (default), `always`, or `never`. */
  expand?: 'hover' | 'always' | 'never';
  /** Reverse stacking so the newest sits at the back. */
  newestOnTop?: boolean;
}

export interface RenderContext {
  id: string;
  close: () => void;
}

export interface ToasterConfig {
  /** Options merged into every toast (per-toast options still win). */
  defaults?: ToastOptions;
  /** Per-type default auto-close duration in ms. */
  durations?: Partial<Record<ToastType, number>>;
  /** Theme tokens or a named preset. */
  theme?: ThemeTokens | PresetName;
  /** Replace built-in icons (per type, `null` to hide) and/or the close icon. */
  icons?: Partial<Record<ToastType, string | null>> & { close?: string };
  /** How many stacked toasts stay visible per position (default 3). */
  maxVisible?: number;
  /** Stacking geometry + behavior. */
  stack?: StackConfig;
  /** Replace the default toast body with your own element. */
  render?: (opts: ToastOptions, ctx: RenderContext) => HTMLElement | void;
  /** `false` → don't auto-inject CSS (ship your own / headless). Default true. */
  injectStyles?: boolean;
  /** Nonce set on the injected <style> for strict-CSP apps. */
  styleNonce?: string;
  /** Mount containers/live-regions/backdrop here (portals / shadow DOM). */
  root?: HTMLElement | ShadowRoot;
  /** Lifecycle/debug event sink. */
  logger?: (event: string, payload: unknown) => void;
}

/* ------------------------------------------------------------------ *
 * Module-level constants (shared, stateless)
 * ------------------------------------------------------------------ */

const canUseDOM =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const PREFIX = 'ga-toast';
const STYLE_ID = 'ga-toasts-styles';
const REMOVE_FALLBACK = 450; // ms — safety net if transitionend never fires
const COLLAPSE_DELAY = 140; // ms — grace period before an un-hovered stack collapses (anti-flicker)
const DEFAULT_MAX_VISIBLE = 3;
const DEFAULT_PEEK = 14; // px each stacked card peeks out when collapsed
const DEFAULT_STACK_GAP = 14; // px gap between cards when expanded
const DEFAULT_SCALE_STEP = 0.05;

interface TimerState {
  duration: number;
  remaining: number;
  startedAt: number;
  handle: ReturnType<typeof setTimeout> | null;
  /**
   * Reasons the countdown is currently frozen ('hover', 'focus', 'swipe',
   * 'tab', 'overflow'). The timer only runs when this set is empty.
   */
  holds: Set<string>;
}

interface Instance {
  id: string;
  el: HTMLElement;
  handle: ToastHandle;
  opts: Required<Pick<ToastOptions, 'position'>> & ToastOptions;
  controller: AbortController;
  progressEl: HTMLElement | null;
  ring: SVGCircleElement | null;
  timer: TimerState;
  height: number;
  closing: boolean;
  swipeX: number;
  resizeObserver: ResizeObserver | null;
  prevFocus: Element | null;
}

// Lucide-style stroke icons. `.ga-ic-ring` / `.ga-ic-draw` are animated (drawn
// in) by CSS on mount; the whole set inherits the accent color via currentColor.
const S =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const DEFAULT_ICONS: Record<string, string> = {
  success: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M7.75 12.5l2.75 2.75L16.5 9" class="ga-ic-draw"/></svg>`,
  error: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M15 9l-6 6M9 9l6 6" class="ga-ic-draw"/></svg>`,
  warning: `${S}<path d="M12 3.6 2.4 20.4h19.2L12 3.6z" class="ga-ic-ring"/><path d="M12 10v4" class="ga-ic-draw"/><path d="M12 17.4v.01"/></svg>`,
  info: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M12 11v5" class="ga-ic-draw"/><path d="M12 7.6v.01"/></svg>`,
  primary: `${S}<path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77 6.8 19.5l.99-5.79-4.21-4.1 5.82-.85L12 3.5z" class="ga-ic-draw"/></svg>`,
  secondary: `${S}<path d="M6 9a6 6 0 0112 0c0 4.5 1.8 5.6 1.8 5.6H4.2S6 13.5 6 9z" class="ga-ic-draw"/><path d="M10 19a2 2 0 004 0"/></svg>`,
  loading:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" class="ga-toast-spinner"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 3a9 9 0 019 9"/></svg>',
};

// Proper SVG for the close control.
const DEFAULT_CLOSE_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const ASSERTIVE_TYPES = new Set<ToastType>(['error', 'warning']);

const POSITIONS: ToastPosition[] = [
  'top-start',
  'top-center',
  'top-end',
  'middle-start',
  'middle-center',
  'middle-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
];

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 5000,
  error: 8000,
  warning: 6000,
  info: 4000,
  primary: 5000,
  secondary: 5000,
  loading: 0,
};

/* ---- theming helpers ---- */

const PRESETS: Record<PresetName, ThemeTokens> = {
  soft: {},
  solid: { surface: 'solid', elevation: 'raised' },
  minimal: { surface: 'outline', elevation: 'flat', radius: 10, accentEdge: 0 },
  sharp: { radius: 4 },
  material: { surface: 'solid', elevation: 'floating', radius: 12 },
};

const DENSITY: Record<string, [string, string, string]> = {
  // padY, padX, font-size
  compact: ['8px', '13px', '0.82rem'],
  comfortable: ['12px', '16px', '0.875rem'],
  spacious: ['16px', '20px', '0.94rem'],
};

const ELEVATION: Record<string, string> = {
  flat: '0 1px 2px rgba(15,23,42,0.06)',
  raised:
    '0 1px 2px rgba(15,23,42,0.05), 0 8px 20px -12px rgba(15,23,42,0.16)',
  floating:
    '0 4px 10px -3px rgba(15,23,42,0.12), 0 20px 44px -14px rgba(15,23,42,0.34)',
};

function px(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : String(v);
}

/** Resolve a preset name / token object into a plain ThemeTokens object. */
function resolveTheme(theme: ThemeTokens | PresetName | undefined): ThemeTokens {
  if (!theme) return {};
  if (typeof theme === 'string') return { ...(PRESETS[theme] || {}) };
  const { preset, ...rest } = theme;
  const base = preset ? PRESETS[preset] || {} : {};
  return { ...base, ...rest };
}

/** Map ThemeTokens → { '--gat-*': value } for the vars it sets. */
function themeVars(t: ThemeTokens): Record<string, string> {
  const v: Record<string, string> = {};
  if (t.width != null) v['--gat-width'] = px(t.width);
  if (t.radius != null) v['--gat-radius'] = px(t.radius);
  if (t.gap != null) v['--gat-gap'] = px(t.gap);
  if (t.edge != null) v['--gat-edge'] = px(t.edge);
  if (t.font) v['--gat-font'] = t.font;
  if (t.density && DENSITY[t.density]) {
    const [py, pxv, fs] = DENSITY[t.density];
    v['--gat-pad-y'] = py;
    v['--gat-pad-x'] = pxv;
    v['--gat-font-size'] = fs;
  }
  if (t.elevation && ELEVATION[t.elevation]) v['--gat-shadow'] = ELEVATION[t.elevation];
  if (t.accentEdge != null) v['--gat-accent-edge'] = px(t.accentEdge);
  if (t.accent) v['--gat-primary'] = t.accent;
  if (t.colors)
    for (const k of Object.keys(t.colors) as ToastType[])
      if (t.colors[k]) v[`--gat-${k}`] = t.colors[k] as string;
  if (t.text) v['--gat-text'] = t.text;
  if (t.textSoft) v['--gat-text-soft'] = t.textSoft;
  if (t.textMuted) v['--gat-text-muted'] = t.textMuted;
  if (t.surfaceColor) {
    v['--gat-surface'] = t.surfaceColor;
    v['--gat-surface-solid'] = t.surfaceColor;
  }
  if (t.border) v['--gat-border'] = t.border;
  if (t.shadow) v['--gat-shadow'] = t.shadow;
  if (t.chip) v['--gat-chip'] = t.chip;
  if (t.ease) v['--gat-ease'] = t.ease;
  return v;
}

function verticalDir(position: ToastPosition): 1 | -1 {
  return position.startsWith('bottom') ? -1 : 1;
}

function isRTL(): boolean {
  if (!canUseDOM) return false;
  const dir =
    document.documentElement.getAttribute('dir') ||
    (document.body && document.body.getAttribute('dir'));
  return dir === 'rtl';
}

interface Motion {
  /** Any <length-percentage>, e.g. `0px`, `-115%`, `calc(-50% + 8px)`. */
  y?: string;
  x?: string;
  scale?: number;
  /** Degrees, 2D only — a 3D rotation would leave the card in a 3D context. */
  rotate?: number;
}

/**
 * The one shape every inline transform takes.
 *
 * All three writers — layout(), the off-stage transform below, and the swipe
 * fling — emit this exact function list. Matching lists let the browser
 * interpolate each component independently; mismatched ones force it to
 * decompose two matrices instead, which drags translate along a curved path
 * whenever a rotation is also in flight.
 */
function composeTransform({
  y = '0px',
  x = '0px',
  scale = 1,
  rotate = 0,
}: Motion): string {
  return `translateY(${y}) translateX(${x}) scale(${scale}) rotate(${rotate}deg)`;
}

/**
 * Middle stacks carry a -50% self-offset in every transform they ever hold.
 * The sign is folded into the operator so a negative offset reads `calc(-50% -
 * 140%)` rather than the legal-but-alarming `calc(-50% + -140%)`.
 */
function stackY(position: ToastPosition, offset = '0px'): string {
  if (!position.startsWith('middle')) return offset;
  const negative = offset.startsWith('-');
  return `calc(-50% ${negative ? '-' : '+'} ${negative ? offset.slice(1) : offset})`;
}

/**
 * Where a toast sits while off-stage — before it enters, and after it exits.
 * The engine transitions between this and the resting transform layout() writes,
 * so a preset is exactly a starting point plus the CSS timing keyed off its
 * `ga-toast-anim-*` class. Presets that park at rest (`fade`, `none`) let
 * opacity carry the whole effect; the rest travel, scale, or rotate into place.
 */
function offscreenTransform(
  position: ToastPosition,
  animation?: ToastAnimation,
): string {
  const y = stackY(position);
  const rtl = isRTL();
  const edge = position.endsWith('start')
    ? rtl
      ? '115%'
      : '-115%'
    : position.endsWith('end')
      ? rtl
        ? '-115%'
        : '115%'
      : null;
  const offY = stackY(position, verticalDir(position) === 1 ? '-140%' : '140%');

  switch (animation) {
    case 'none':
    case 'fade':
      return composeTransform({ y });
    case 'scale':
      return composeTransform({ y, scale: 0.75 });
    case 'zoom':
      return composeTransform({ y, scale: 1.25 });
    case 'drop':
      // Falls from overhead whatever edge the stack is anchored to.
      return composeTransform({ y: stackY(position, '-160%') });
    case 'flip':
      // The only preset that needs 3D. perspective() sits after the shared list
      // so it scopes just the rotateX, and none of it survives to the resting
      // transform — the card is back in a 2D context, and crisp, once landed.
      return `${composeTransform({ y })} perspective(900px) rotateX(-88deg)`;
    case 'swing':
      // Tilt away from the direction of travel, then let the overshoot easing
      // carry the rotation back through zero like a pendulum losing energy.
      return edge
        ? composeTransform({ y, x: edge, rotate: edge.startsWith('-') ? -7 : 7 })
        : composeTransform({ y: offY, rotate: -7 });
    default:
      // slide, bounce — same path in from the nearest edge, different easing.
      return edge ? composeTransform({ y, x: edge }) : composeTransform({ y: offY });
  }
}

function swipeOpacity(dx: number): number {
  return Math.max(0.15, 1 - Math.abs(dx) / 220);
}

function normalizeId(idOrSelector: string): string {
  return idOrSelector.startsWith('#') ? idOrSelector.slice(1) : idOrSelector;
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function prefersReducedMotion(): boolean {
  return (
    canUseDOM &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

let toasterSeq = 0;

/* ------------------------------------------------------------------ *
 * The toaster instance factory — all state is per-instance.
 * ------------------------------------------------------------------ */

function makeToaster(config: ToasterConfig = {}): ToastFn {
  const seq = (toasterSeq += 1);
  const instanceClass = `ga-toaster-${seq}`;

  /* ---- per-instance state ---- */
  const registry = new Map<string, Instance>();
  const containers = new Map<ToastPosition, HTMLElement>();
  let globalDefaults: ToastOptions = { ...(config.defaults || {}) };
  let logger = config.logger || null;
  let liveRegions: { polite: HTMLElement; assertive: HTMLElement } | null = null;
  let escapeBound = false;
  let visibilityBound = false;
  let idCounter = 0;
  let activeModalId: string | null = null;
  let backdropEl: HTMLElement | null = null;

  const icons: Record<string, string | null> = { ...DEFAULT_ICONS };
  let closeIcon = DEFAULT_CLOSE_ICON;
  const durations: Record<ToastType, number> = { ...DEFAULT_DURATIONS };

  let maxVisible = DEFAULT_MAX_VISIBLE;
  let peek = DEFAULT_PEEK;
  let stackGap = DEFAULT_STACK_GAP;
  let scaleStep = DEFAULT_SCALE_STEP;
  let expandMode: 'hover' | 'always' | 'never' = 'hover';
  let newestOnTop = false;

  let injectEnabled = config.injectStyles !== false;
  const styleNonce = config.styleNonce;
  const renderFn = config.render || null;

  let themeTokens: ThemeTokens = {};
  let surfaceMode: ThemeTokens['surface'] | undefined;
  let progressMode: 'bar' | 'ring' | 'none' = 'bar';
  let themeStyleEl: HTMLStyleElement | null = null;

  // Where containers / live-regions / backdrop mount, and where CSS injects.
  const mount: (HTMLElement | ShadowRoot) | null =
    config.root || (canUseDOM ? document.body : null);
  const isShadow =
    !!config.root && typeof (config.root as ShadowRoot).host !== 'undefined';
  const styleTarget: (HTMLElement | ShadowRoot) | null = isShadow
    ? (config.root as ShadowRoot)
    : canUseDOM
      ? document.head
      : null;

  /* ---- apply constructor config ---- */
  function applyConfigDurations(d?: Partial<Record<ToastType, number>>): void {
    if (!d) return;
    for (const k of Object.keys(d) as ToastType[])
      if (typeof d[k] === 'number') durations[k] = d[k] as number;
  }
  function applyConfigIcons(
    ic?: Partial<Record<ToastType, string | null>> & { close?: string },
  ): void {
    if (!ic) return;
    for (const k of Object.keys(ic)) {
      if (k === 'close') {
        if (ic.close) closeIcon = ic.close;
        continue;
      }
      icons[k] = ic[k as ToastType] as string | null;
    }
  }
  function applyConfigStack(s?: StackConfig): void {
    if (!s) return;
    if (typeof s.peek === 'number') peek = s.peek;
    if (typeof s.gap === 'number') stackGap = s.gap;
    if (typeof s.scaleStep === 'number') scaleStep = s.scaleStep;
    if (s.expand) expandMode = s.expand;
    if (typeof s.newestOnTop === 'boolean') newestOnTop = s.newestOnTop;
  }

  applyConfigDurations(config.durations);
  applyConfigIcons(config.icons);
  applyConfigStack(config.stack);
  if (typeof config.maxVisible === 'number')
    maxVisible = Math.max(1, Math.floor(config.maxVisible) || 1);

  /* ---- small utilities ---- */
  function nextId(): string {
    idCounter += 1;
    const rand = Math.random().toString(36).slice(2, 8);
    return `${PREFIX}-${idCounter}-${rand}`;
  }

  function log(event: string, payload?: unknown): void {
    if (logger) {
      try {
        logger(event, payload);
      } catch {
        /* never let a logger break the app */
      }
    }
  }

  /* ---- styles + theme + a11y live region ---- */

  function injectStyles(): void {
    if (!canUseDOM || !injectEnabled || !styleTarget) return;
    const doc = document;
    if ((styleTarget as ParentNode).querySelector?.(`#${STYLE_ID}`)) return;
    if (styleTarget === doc.head && doc.getElementById(STYLE_ID)) return;
    const el = doc.createElement('style');
    el.id = STYLE_ID;
    if (styleNonce) el.setAttribute('nonce', styleNonce);
    el.textContent = styles;
    styleTarget.appendChild(el);
  }

  /** (Re)build the per-instance theme <style> that overrides `--gat-*` vars. */
  function applyTheme(): void {
    if (!canUseDOM || !styleTarget) return;
    const t = themeTokens;
    surfaceMode = t.surface;
    progressMode = t.progress || 'bar';

    const sel = `.${instanceClass}.ga-toast-container`;
    const light = themeVars(t);
    const lightBody = Object.entries(light)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
    const darkVars = t.dark ? themeVars(t.dark) : {};
    const darkBody = Object.entries(darkVars)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

    let cssText = '';
    if (lightBody) cssText += `${sel}{${lightBody}}`;
    if (darkBody)
      cssText += `[data-ga-theme="dark"] ${sel},.ga-theme-dark ${sel}{${darkBody}}`;

    if (!cssText) {
      themeStyleEl?.remove();
      themeStyleEl = null;
      return;
    }
    if (!themeStyleEl) {
      themeStyleEl = document.createElement('style');
      themeStyleEl.id = `ga-toasts-theme-${seq}`;
      if (styleNonce) themeStyleEl.setAttribute('nonce', styleNonce);
      styleTarget.appendChild(themeStyleEl);
    }
    themeStyleEl.textContent = cssText;
  }

  function ensureLiveRegions(): void {
    if (!canUseDOM || !mount) return;
    if (
      liveRegions &&
      liveRegions.polite.isConnected &&
      liveRegions.assertive.isConnected
    )
      return;
    const make = (politeness: 'polite' | 'assertive'): HTMLElement => {
      const region = document.createElement('div');
      region.className = 'ga-toast-live-region';
      region.setAttribute('aria-live', politeness);
      region.setAttribute('aria-atomic', 'true');
      region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
      mount.appendChild(region);
      return region;
    };
    liveRegions = { polite: make('polite'), assertive: make('assertive') };
  }

  function announce(text: string, assertive: boolean): void {
    if (!text) return;
    ensureLiveRegions();
    if (!liveRegions) return;
    const region = assertive ? liveRegions.assertive : liveRegions.polite;
    region.textContent = '';
    window.setTimeout(() => {
      region.textContent = text;
    }, 50);
  }

  /* ---- containers ---- */

  function getContainer(position: ToastPosition): HTMLElement {
    const existing = containers.get(position);
    if (existing && existing.isConnected) return existing;

    const container = document.createElement('div');
    container.className = `ga-toast-container ga-toast-container-${position} ${instanceClass}`;
    container.setAttribute('data-ga-position', position);
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Notifications');
    if (expandMode === 'always') container.dataset.gaExpanded = 'true';

    // Expand on hover/focus, but DEBOUNCE the collapse (anti-flicker: crossing a
    // gap between fanned-out cards briefly leaves then re-enters the stack).
    if (expandMode === 'hover') {
      let collapseTimer: ReturnType<typeof setTimeout> | null = null;
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
      container.addEventListener('pointerenter', expand);
      container.addEventListener('pointerleave', collapse);
      container.addEventListener('focusin', expand);
      container.addEventListener('focusout', (e) => {
        if (!container.contains((e as FocusEvent).relatedTarget as Node)) collapse();
      });
    }

    mount?.appendChild(container);
    containers.set(position, container);
    return container;
  }

  function setExpanded(container: HTMLElement, expanded: boolean): void {
    if (expandMode !== 'hover') return; // 'always'/'never' are fixed
    if ((container.dataset.gaExpanded === 'true') === expanded) return;
    container.dataset.gaExpanded = expanded ? 'true' : 'false';
    layout(container);
  }

  function instancesIn(container: HTMLElement): Instance[] {
    return Array.from(container.children)
      .map((child) => registry.get((child as HTMLElement).id))
      .filter((inst): inst is Instance => !!inst);
  }

  function layout(container: HTMLElement): void {
    const all = instancesIn(container);
    const position = (container.dataset.gaPosition || 'top-end') as ToastPosition;
    const dir = verticalDir(position);
    const expanded =
      expandMode === 'always' ||
      (expandMode === 'hover' && container.dataset.gaExpanded === 'true');
    const reduce = prefersReducedMotion();

    // Front = newest = last in DOM order (unless newestOnTop reverses it).
    const front = newestOnTop ? all.slice() : all.slice().reverse();
    container.style.setProperty('--ga-toasts-count', String(front.length));

    let cumulative = 0;
    front.forEach((inst, frontIndex) => {
      if (inst.closing) return;

      if (!inst.el.dataset.gaMounted) {
        cumulative += inst.height + stackGap;
        return;
      }

      let translateY: number;
      let scale: number;
      let opacity: number;

      const overflow = frontIndex >= maxVisible;
      if (overflow) pauseTimer(inst, 'overflow');
      else resumeTimer(inst, 'overflow');

      if (expanded || reduce) {
        translateY = dir * cumulative;
        scale = 1;
        opacity = 1;
      } else {
        translateY = dir * frontIndex * peek;
        scale = Math.max(1 - frontIndex * scaleStep, 0.85);
        opacity = overflow ? 0 : 1;
      }

      inst.el.style.transform = composeTransform({
        y: stackY(position, `${translateY}px`),
        x: inst.swipeX ? `${inst.swipeX}px` : '0px',
        scale,
      });
      inst.el.style.opacity = inst.swipeX
        ? String(swipeOpacity(inst.swipeX))
        : String(opacity);
      inst.el.style.zIndex = String(1000 + front.length - frontIndex);
      inst.el.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
      inst.el.setAttribute('aria-hidden', opacity === 0 ? 'true' : 'false');

      cumulative += inst.height + stackGap;
    });
  }

  function measure(inst: Instance): void {
    const h = inst.el.offsetHeight;
    if (h > 0) inst.height = h;
  }

  /* ---- rendering ---- */

  function resolveOptions(options: ToastOptions): Instance['opts'] {
    const merged: ToastOptions = {
      type: 'info',
      duration: 5000,
      closable: true,
      position: 'top-end',
      animation: 'slide',
      swipeToClose: true,
      closeOnEscape: true,
      progress: true,
      progressPosition: 'bottom',
      pauseOnHover: true,
      pauseOnPageHidden: true,
      autoIcon: true,
      glassmorphism: true,
      html: false,
      ...globalDefaults,
      ...options,
    };
    merged.position = merged.position || 'top-end';
    if (!POSITIONS.includes(merged.position)) merged.position = 'top-end';
    return merged as Instance['opts'];
  }

  function iconFor(type: string): string | null {
    return icons[type] ?? icons.info ?? null;
  }

  function createCloseButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ga-toast-close';
    btn.setAttribute('aria-label', 'Close notification');
    btn.setAttribute('data-ga-close', '');
    btn.innerHTML = closeIcon;
    return btn;
  }

  function appendProgress(
    el: HTMLElement,
    opts: Instance['opts'],
    type: string,
  ): HTMLElement | null {
    if (
      progressMode === 'ring' ||
      !opts.progress ||
      (opts.duration || 0) <= 0 ||
      opts.progressPosition === 'none'
    )
      return null;
    const p = document.createElement('div');
    p.className =
      `ga-toast-progress ga-toast-progress-${type}` +
      (opts.progressPosition === 'top' ? ' ga-toast-progress-top' : '');
    el.appendChild(p);
    return p;
  }

  /** Build the icon slot, optionally wrapping a countdown ring around it. */
  function buildIcon(
    iconHtml: string,
    opts: Instance['opts'],
  ): { el: HTMLElement; ring: SVGCircleElement | null } {
    const icon = document.createElement('div');
    icon.className = 'ga-toast-icon';
    icon.innerHTML = iconHtml;
    const wantRing =
      progressMode === 'ring' &&
      opts.progress !== false &&
      (opts.duration || 0) > 0;
    if (!wantRing) return { el: icon, ring: null };
    icon.classList.add('ga-toast-icon-ring');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ga-toast-ring');
    svg.setAttribute('viewBox', '0 0 36 36');
    svg.setAttribute('aria-hidden', 'true');
    const track = document.createElementNS(ns, 'circle');
    track.setAttribute('class', 'ga-toast-ring-track');
    track.setAttribute('cx', '18');
    track.setAttribute('cy', '18');
    track.setAttribute('r', '16');
    const bar = document.createElementNS(ns, 'circle');
    bar.setAttribute('class', 'ga-toast-ring-bar');
    bar.setAttribute('cx', '18');
    bar.setAttribute('cy', '18');
    bar.setAttribute('r', '16');
    svg.appendChild(track);
    svg.appendChild(bar);
    icon.appendChild(svg);
    return { el: icon, ring: bar as SVGCircleElement };
  }

  function buildToastElement(
    opts: Instance['opts'],
    id: string,
  ): { el: HTMLElement; progressEl: HTMLElement | null; ring: SVGCircleElement | null } {
    const type = opts.type || 'info';
    const el = document.createElement('div');
    el.id = id;
    const glass =
      surfaceMode === 'glass' ||
      (surfaceMode === undefined && opts.glassmorphism);
    el.className = [
      'ga-toast',
      `ga-toast-${type}`,
      opts.size ? `ga-toast-${opts.size}` : '',
      opts.variant ? `ga-toast-${type}-${opts.variant}` : '',
      opts.animation ? `ga-toast-anim-${opts.animation}` : '',
      opts.compact ? 'ga-toast-compact' : '',
      glass ? 'ga-toast-glass' : '',
      surfaceMode === 'outline' ? 'ga-toast-outline' : '',
      type === 'loading' ? 'ga-toast-loading' : '',
      opts.className || '',
    ]
      .filter(Boolean)
      .join(' ');

    const role = opts.role || (ASSERTIVE_TYPES.has(type) ? 'alert' : 'status');
    el.setAttribute('role', role);
    el.setAttribute('aria-live', 'off');
    el.setAttribute('data-ga-type', type);

    if (role === 'alertdialog' || role === 'dialog') {
      const label = [opts.title, opts.message].filter(Boolean).join('. ');
      if (label) el.setAttribute('aria-label', label);
    }

    // Global custom renderer replaces the default body (like per-toast `content`).
    let customEl: HTMLElement | string | null = null;
    if (opts.content != null) {
      customEl =
        typeof opts.content === 'function' ? opts.content() : opts.content;
    } else if (renderFn) {
      const produced = renderFn(opts, { id, close: () => close(id) });
      if (produced) customEl = produced;
    }
    if (customEl != null) {
      el.classList.add('ga-toast-has-custom');
      const wrap = document.createElement('div');
      wrap.className = 'ga-toast-custom';
      if (typeof customEl === 'string') wrap.innerHTML = customEl;
      else wrap.appendChild(customEl);
      el.appendChild(wrap);
      if (opts.closable) el.appendChild(createCloseButton());
      return { el, progressEl: appendProgress(el, opts, type), ring: null };
    }

    if (opts.avatar) {
      const avatar = document.createElement('img');
      avatar.className = 'ga-toast-avatar';
      avatar.src = opts.avatar;
      avatar.alt = opts.avatarAlt || opts.title || 'Notification';
      el.appendChild(avatar);
    }

    let iconHtml: string | null = null;
    if (opts.icon) iconHtml = String(opts.icon);
    else if (opts.icon !== false && opts.autoIcon !== false && !opts.avatar)
      iconHtml = iconFor(type);
    let ring: SVGCircleElement | null = null;
    if (iconHtml) {
      const built = buildIcon(iconHtml, opts);
      ring = built.ring;
      el.appendChild(built.el);
    }

    const content = document.createElement('div');
    content.className = 'ga-toast-content';

    if (opts.title || opts.showStatus || opts.unread) {
      const header = document.createElement('div');
      header.className = 'ga-toast-header';

      if (opts.unread) {
        const dot = document.createElement('span');
        dot.className = 'ga-toast-unread-dot';
        header.appendChild(dot);
      }

      if (opts.title) {
        const title = document.createElement('div');
        title.className =
          'ga-toast-title' + (opts.truncateTitle ? ' ga-toast-title-truncate' : '');
        title.textContent = opts.title;
        header.appendChild(title);
      }

      if (opts.showStatus) {
        const status = document.createElement('span');
        status.className = 'ga-toast-status';
        const label = String(opts.statusText || type);
        status.textContent = label.charAt(0).toUpperCase() + label.slice(1);
        header.appendChild(status);
      }

      content.appendChild(header);
    }

    if (opts.message || opts.meta) {
      const body = document.createElement('div');
      body.className = 'ga-toast-body';

      if (opts.meta) {
        const meta = document.createElement('div');
        meta.className = 'ga-toast-meta';
        meta.textContent = opts.meta;
        body.appendChild(meta);
      }

      if (opts.message) {
        const message = document.createElement('div');
        message.className = 'ga-toast-message';
        if (opts.html) message.innerHTML = opts.message;
        else message.textContent = opts.message;
        body.appendChild(message);
      }

      content.appendChild(body);
    }

    if (opts.actions && opts.actions.length && !opts.compact) {
      const actions = document.createElement('div');
      actions.className = 'ga-toast-actions';
      for (const action of opts.actions) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = [
          'ga-toast-btn',
          action.className || action.class || 'ga-toast-btn-secondary',
        ].join(' ');
        btn.textContent = action.text;
        btn.setAttribute('data-ga-action', '');
        actions.appendChild(btn);
      }
      content.appendChild(actions);
    }

    if (opts.steps && opts.steps > 1) {
      const steps = document.createElement('div');
      steps.className = 'ga-toast-steps';
      const active = Math.min(opts.steps, Math.max(1, opts.currentStep || 1));
      for (let i = 1; i <= opts.steps; i += 1) {
        const step = document.createElement('div');
        step.className = 'ga-toast-step' + (i <= active ? ' ga-toast-step-active' : '');
        steps.appendChild(step);
      }
      content.appendChild(steps);
    }

    el.appendChild(content);

    if (opts.closable) el.appendChild(createCloseButton());

    return { el, progressEl: appendProgress(el, opts, type), ring };
  }

  /* ---- timers + progress ---- */

  const RING_CIRC = 2 * Math.PI * 16; // circumference for r=16

  function startTimer(inst: Instance): void {
    const { timer } = inst;
    if (timer.duration <= 0 || timer.remaining <= 0) return;
    if (timer.holds.size > 0) return;
    timer.startedAt = now();
    timer.handle = setTimeout(() => close(inst.id), timer.remaining);
    animateProgress(inst, timer.remaining);
  }

  function pauseTimer(inst: Instance, reason: string): void {
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

  function resumeTimer(inst: Instance, reason: string): void {
    const { timer } = inst;
    if (!timer.holds.delete(reason)) return;
    if (timer.holds.size > 0) return;
    startTimer(inst);
  }

  function animateProgress(inst: Instance, ms: number): void {
    const fraction = inst.timer.duration > 0 ? ms / inst.timer.duration : 0;
    if (inst.ring) {
      const ring = inst.ring;
      ring.style.transition = 'none';
      ring.style.strokeDasharray = String(RING_CIRC);
      ring.style.strokeDashoffset = String(RING_CIRC * (1 - fraction));
      void (ring as unknown as HTMLElement).getBoundingClientRect?.();
      ring.style.transition = `stroke-dashoffset ${ms}ms linear`;
      ring.style.strokeDashoffset = String(RING_CIRC);
      return;
    }
    const bar = inst.progressEl;
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.transform = `scaleX(${fraction})`;
    void bar.offsetWidth;
    bar.style.transition = `transform ${ms}ms linear`;
    bar.style.transform = 'scaleX(0)';
  }

  function freezeProgress(inst: Instance): void {
    const fraction =
      inst.timer.duration > 0 ? inst.timer.remaining / inst.timer.duration : 0;
    if (inst.ring) {
      inst.ring.style.transition = 'none';
      inst.ring.style.strokeDashoffset = String(RING_CIRC * (1 - fraction));
      return;
    }
    const bar = inst.progressEl;
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.transform = `scaleX(${fraction})`;
  }

  /* ---- interaction handlers ---- */

  function attachHandlers(inst: Instance, opts: Instance['opts']): void {
    const { el, controller } = inst;
    const signal = controller.signal;

    el.addEventListener(
      'click',
      (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-ga-close]')) {
          e.preventDefault();
          close(inst.id);
          return;
        }
        const actionBtn = target.closest('[data-ga-action]') as HTMLElement | null;
        if (actionBtn && opts.actions) {
          const idx = Array.from(
            actionBtn.parentElement?.children || [],
          ).indexOf(actionBtn);
          const action = opts.actions[idx];
          if (action) {
            const handler = action.onClick || action.click;
            if (handler) handler(e as MouseEvent, inst.handle);
            if (action.closeOnClick !== false) close(inst.id);
          }
          return;
        }
        if (opts.clickToClose && !target.closest('.ga-toast-actions')) {
          close(inst.id);
        }
      },
      { signal },
    );

    if (opts.pauseOnHover) {
      el.addEventListener('pointerenter', () => pauseTimer(inst, 'hover'), { signal });
      el.addEventListener('pointerleave', () => resumeTimer(inst, 'hover'), { signal });
      el.addEventListener('focusin', () => pauseTimer(inst, 'focus'), { signal });
      el.addEventListener('focusout', () => resumeTimer(inst, 'focus'), { signal });
    }

    if (opts.swipeToClose) attachSwipe(inst);

    if (opts.modal) {
      el.addEventListener(
        'keydown',
        (e) => {
          if (e.key !== 'Tab') return;
          const focusables = el.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
        { signal },
      );
    }
  }

  function attachSwipe(inst: Instance): void {
    const { el, controller } = inst;
    const signal = controller.signal;
    const THRESHOLD = 70;
    let dragging = false;
    let swiping = false;
    let startX = 0;
    let startY = 0;

    el.addEventListener(
      'pointerdown',
      (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if ((e.target as HTMLElement).closest('button, a, input, textarea, select'))
          return;
        dragging = true;
        swiping = false;
        startX = e.clientX;
        startY = e.clientY;
        pauseTimer(inst, 'swipe');
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* not all environments support pointer capture */
        }
      },
      { signal },
    );

    el.addEventListener(
      'pointermove',
      (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
        e.preventDefault();
        if (!swiping) {
          swiping = true;
          el.classList.add('ga-toast-swiping');
          const sel =
            typeof window !== 'undefined' && typeof window.getSelection === 'function'
              ? window.getSelection()
              : null;
          sel?.removeAllRanges();
        }
        inst.swipeX = dx;
        const container = el.parentElement;
        if (container) layout(container);
      },
      { signal },
    );

    const end = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      swiping = false;
      el.classList.remove('ga-toast-swiping');
      const dx = e.clientX - startX;
      if (Math.abs(dx) > THRESHOLD) {
        const dir = dx > 0 ? 1 : -1;
        inst.el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        inst.el.style.transform = composeTransform({
          y: stackY(inst.opts.position),
          x: `${dir * 400}px`,
        });
        inst.el.style.opacity = '0';
        close(inst.id);
      } else {
        inst.swipeX = 0;
        const container = el.parentElement;
        if (container) layout(container);
        resumeTimer(inst, 'swipe');
      }
    };
    el.addEventListener('pointerup', end, { signal });
    el.addEventListener('pointercancel', end, { signal });
  }

  function bindEscape(): void {
    if (escapeBound || !canUseDOM) return;
    escapeBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      let newest: Instance | null = null;
      for (const inst of registry.values()) {
        if (inst.closing) continue;
        if (inst.opts.closeOnEscape === false || !inst.opts.closable) continue;
        newest = inst;
      }
      if (newest) close(newest.id);
    });
  }

  function bindVisibility(): void {
    if (visibilityBound || !canUseDOM || typeof document.addEventListener !== 'function')
      return;
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      const hidden = document.hidden;
      for (const inst of registry.values()) {
        if (inst.closing || inst.opts.pauseOnPageHidden === false) continue;
        if (hidden) pauseTimer(inst, 'tab');
        else resumeTimer(inst, 'tab');
      }
    });
  }

  function showBackdrop(): void {
    if (!canUseDOM || !mount) return;
    if (!backdropEl) {
      backdropEl = document.createElement('div');
      backdropEl.className = 'ga-toast-backdrop';
    }
    if (!backdropEl.isConnected) mount.appendChild(backdropEl);
    const bd = backdropEl;
    requestAnimationFrame(() => bd.classList.add('ga-toast-backdrop-show'));
  }

  function hideBackdrop(): void {
    if (!backdropEl) return;
    const bd = backdropEl;
    bd.classList.remove('ga-toast-backdrop-show');
    setTimeout(() => {
      if (activeModalId == null && bd.parentNode) bd.remove();
    }, 220);
  }

  /* ---- core lifecycle ---- */

  function noopHandle(id: string): ToastHandle {
    const handle: ToastHandle = {
      id,
      el: canUseDOM ? document.createElement('div') : ({} as HTMLElement),
      update: () => handle,
      close: () => {},
    };
    return handle;
  }

  function show(options: ToastOptions = {}): ToastHandle {
    if (!canUseDOM) return noopHandle(options.id || nextId());

    const opts = resolveOptions(options);

    if (opts.id && registry.has(opts.id)) {
      return update(opts.id, options) || noopHandle(opts.id);
    }

    if (opts.modal) {
      if (activeModalId && registry.has(activeModalId)) {
        return registry.get(activeModalId)!.handle;
      }
      opts.swipeToClose = false;
      opts.closeOnEscape = false;
      opts.moveFocus = true;
    }

    injectStyles();
    bindEscape();
    bindVisibility();

    const id = opts.id || nextId();
    const { el, progressEl, ring } = buildToastElement(opts, id);

    const controller = new AbortController();
    const timer: TimerState = {
      duration: opts.duration || 0,
      remaining: opts.duration || 0,
      startedAt: 0,
      handle: null,
      holds: new Set<string>(),
    };

    const handle: ToastHandle = {
      id,
      el,
      update: (o) => (update(id, o) ? handle : handle),
      close: () => close(id),
    };

    const inst: Instance = {
      id,
      el,
      handle,
      opts,
      controller,
      progressEl,
      ring,
      timer,
      height: 0,
      closing: false,
      swipeX: 0,
      resizeObserver: null,
      prevFocus: opts.moveFocus ? document.activeElement : null,
    };
    registry.set(id, inst);

    if (opts.modal) {
      activeModalId = id;
      el.setAttribute('aria-modal', 'true');
      showBackdrop();
    }

    const container = getContainer(opts.position);

    el.style.transform = offscreenTransform(opts.position, opts.animation);
    el.style.opacity = '0';
    container.appendChild(el);

    attachHandlers(inst, opts);

    if (typeof ResizeObserver !== 'undefined') {
      inst.resizeObserver = new ResizeObserver(() => {
        measure(inst);
        const parent = el.parentElement;
        if (parent) layout(parent);
      });
      inst.resizeObserver.observe(el);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!registry.has(id)) return;
        measure(inst);
        el.dataset.gaMounted = 'true';
        el.style.opacity = '1';
        layout(container);
        startTimer(inst);
        if (opts.moveFocus) {
          const target =
            (el.querySelector('[data-ga-action]') as HTMLElement | null) || el;
          if (target === el) el.tabIndex = -1;
          try {
            target.focus({ preventScroll: true });
          } catch {
            /* focus may be unavailable in some environments */
          }
        }
      });
    });

    if (!opts.modal && opts.role !== 'alertdialog') {
      announce(
        [opts.title, opts.message].filter(Boolean).join('. '),
        ASSERTIVE_TYPES.has(opts.type || 'info'),
      );
    }

    if (opts.onShow) {
      try {
        opts.onShow(handle);
      } catch (err) {
        log('toast:onShow:error', err);
      }
    }
    log('toast:show', { id, type: opts.type });
    return handle;
  }

  function close(target: string | HTMLElement | null | undefined): void {
    if (!target) return;
    const id = typeof target === 'string' ? normalizeId(target) : target.id;
    const inst = registry.get(id);
    if (!inst || inst.closing) return;

    inst.closing = true;
    if (inst.timer.handle != null) {
      clearTimeout(inst.timer.handle);
      inst.timer.handle = null;
    }
    inst.controller.abort();
    inst.resizeObserver?.disconnect();

    const { el } = inst;
    const container = el.parentElement;

    if (!inst.swipeX) {
      el.style.transition = '';
      el.classList.add('ga-toast-hide');
      el.style.transform = offscreenTransform(
        inst.opts.position,
        inst.opts.animation,
      );
      el.style.opacity = '0';
    }

    let removed = false;
    const finalize = () => {
      if (removed) return;
      removed = true;
      el.removeEventListener('transitionend', onEnd);
      registry.delete(id);
      el.remove();
      if (activeModalId === id) {
        activeModalId = null;
        hideBackdrop();
      }
      if (container) layout(container);
      const prev = inst.prevFocus as HTMLElement | null;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) {
        try {
          prev.focus({ preventScroll: true });
        } catch {
          /* ignore */
        }
      }
      if (inst.opts.onClose) {
        try {
          inst.opts.onClose(inst.handle);
        } catch (err) {
          log('toast:onClose:error', err);
        }
      }
      log('toast:close', { id });
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && (e.propertyName === 'transform' || e.propertyName === 'opacity'))
        finalize();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finalize, REMOVE_FALLBACK);
  }

  function update(
    target: string | HTMLElement,
    options: Partial<ToastOptions>,
  ): ToastHandle | null {
    const id = typeof target === 'string' ? normalizeId(target) : target.id;
    const inst = registry.get(id);
    if (!inst) {
      log('toast:update:not-found', id);
      return null;
    }

    const opts = inst.opts;

    if (options.title !== undefined) {
      let title = inst.el.querySelector('.ga-toast-title') as HTMLElement | null;
      if (!title && options.title) {
        const content = inst.el.querySelector('.ga-toast-content');
        if (content) {
          let header = content.querySelector('.ga-toast-header');
          if (!header) {
            header = document.createElement('div');
            header.className = 'ga-toast-header';
            content.insertBefore(header, content.firstChild);
          }
          title = document.createElement('div');
          title.className = 'ga-toast-title';
          header.appendChild(title);
        }
      }
      if (title) title.textContent = options.title;
      opts.title = options.title;
    }

    if (options.message !== undefined) {
      const useHtml = options.html ?? opts.html;
      let message = inst.el.querySelector('.ga-toast-message') as HTMLElement | null;
      if (!message && options.message) {
        let body = inst.el.querySelector('.ga-toast-body');
        if (!body) {
          body = document.createElement('div');
          body.className = 'ga-toast-body';
          const content = inst.el.querySelector('.ga-toast-content');
          const anchor = content?.querySelector('.ga-toast-actions, .ga-toast-steps');
          if (anchor) content!.insertBefore(body, anchor);
          else content?.appendChild(body);
        }
        message = document.createElement('div');
        message.className = 'ga-toast-message';
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
      inst.el.classList.remove(`ga-toast-${prev}`, 'ga-toast-loading');
      inst.el.classList.add(`ga-toast-${options.type}`);
      inst.el.setAttribute('data-ga-type', options.type);
      if (options.type === 'loading') inst.el.classList.add('ga-toast-loading');
      if (inst.progressEl) {
        inst.progressEl.className = inst.progressEl.className.replace(
          /ga-toast-progress-\w+/,
          `ga-toast-progress-${options.type}`,
        );
      }
      const iconEl = inst.el.querySelector('.ga-toast-icon');
      if (iconEl && opts.autoIcon !== false && !options.icon) {
        const next = iconFor(options.type);
        if (next != null) iconEl.innerHTML = next;
      }
      opts.type = options.type;
    }

    if (options.icon !== undefined) {
      let iconEl = inst.el.querySelector('.ga-toast-icon') as HTMLElement | null;
      if (options.icon) {
        if (!iconEl) {
          iconEl = document.createElement('div');
          iconEl.className = 'ga-toast-icon';
          const content = inst.el.querySelector('.ga-toast-content');
          inst.el.insertBefore(iconEl, content);
        }
        iconEl.innerHTML = String(options.icon);
      } else if (iconEl) {
        iconEl.remove();
      }
    }

    if (options.closable !== undefined) {
      const existing = inst.el.querySelector(':scope > .ga-toast-close');
      if (options.closable && !existing) {
        inst.el.insertBefore(createCloseButton(), inst.progressEl || null);
      } else if (!options.closable && existing) {
        existing.remove();
      }
      opts.closable = options.closable;
    }

    if (options.duration !== undefined) {
      if (inst.timer.handle != null) clearTimeout(inst.timer.handle);
      inst.timer.duration = options.duration;
      inst.timer.remaining = options.duration;
      opts.duration = options.duration;
      if (options.duration > 0 && inst.el.dataset.gaMounted) startTimer(inst);
    }

    const parent = inst.el.parentElement;
    if (parent) layout(parent);
    log('toast:update', { id });
    return inst.handle;
  }

  function closeAll(): void {
    for (const id of Array.from(registry.keys())) close(id);
  }

  function clear(type?: ToastType): void {
    if (!type) return closeAll();
    for (const inst of Array.from(registry.values()))
      if (inst.opts.type === type) close(inst.id);
  }

  function getCount(type?: ToastType): number {
    if (!type) return registry.size;
    let n = 0;
    for (const inst of registry.values()) if (inst.opts.type === type) n += 1;
    return n;
  }

  function exists(id: string): boolean {
    return registry.has(normalizeId(id));
  }

  function get(id: string): HTMLElement | null {
    return registry.get(normalizeId(id))?.el || null;
  }

  /* ---- convenience API ---- */

  function typed(type: ToastType) {
    return (message: string, options: ToastOptions = {}): ToastHandle =>
      show({ ...options, type, message, duration: options.duration ?? durations[type] });
  }

  const success = typed('success');
  const error = typed('error');
  const warning = typed('warning');
  const info = typed('info');

  function loading(message = 'Loading…', options: ToastOptions = {}): ToastHandle {
    return show({
      closable: false,
      ...options,
      type: 'loading',
      message,
      duration: 0,
      progress: false,
    });
  }

  function confirm(message: string, options: ConfirmOptions = {}): ToastHandle {
    const { confirmText, cancelText, onConfirm, onCancel, ...rest } = options;
    return show({
      type: 'warning',
      duration: 0,
      closable: false,
      swipeToClose: false,
      role: 'alertdialog',
      moveFocus: true,
      modal: true,
      position: 'middle-center',
      ...rest,
      message,
      actions: [
        {
          text: cancelText || 'Cancel',
          className: 'ga-toast-btn-secondary',
          onClick: () => onCancel?.(),
        },
        {
          text: confirmText || 'Confirm',
          className: 'ga-toast-btn-primary',
          onClick: () => onConfirm?.(),
        },
      ],
    });
  }

  function promise<T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options: ToastOptions = {},
  ): Promise<T> {
    const p = typeof input === 'function' ? input() : input;
    const handle = loading(messages.loading, options);
    return p.then(
      (value) => {
        handle.update({
          type: 'success',
          message:
            typeof messages.success === 'function'
              ? messages.success(value)
              : messages.success,
          duration: options.duration ?? durations.success,
          closable: true,
        });
        return value;
      },
      (err) => {
        handle.update({
          type: 'error',
          message:
            typeof messages.error === 'function'
              ? messages.error(err)
              : messages.error,
          duration: options.duration ?? durations.error,
          closable: true,
        });
        throw err;
      },
    );
  }

  function custom(
    content: NonNullable<ToastOptions['content']>,
    options: ToastOptions = {},
  ): ToastHandle {
    return show({ ...options, content });
  }

  /* ---- configuration API ---- */

  function setDefaults(defaults: ToastOptions): void {
    globalDefaults = { ...globalDefaults, ...defaults };
  }

  function setLogger(fn: ((event: string, payload: unknown) => void) | null): void {
    logger = typeof fn === 'function' ? fn : null;
  }

  function setMaxVisible(count: number): void {
    maxVisible = Math.max(1, Math.floor(count) || 1);
    containers.forEach((container) => layout(container));
  }

  /** Set theme tokens (or a preset). Replaces the current theme, then re-styles. */
  function theme(tokens: ThemeTokens | PresetName): ToastFn {
    themeTokens = resolveTheme(tokens);
    applyTheme();
    containers.forEach((container) => layout(container));
    return api;
  }

  /** One-stop configuration. Every field is optional and merges/overwrites. */
  function configure(cfg: ToasterConfig): ToastFn {
    if (cfg.defaults) setDefaults(cfg.defaults);
    if (cfg.logger !== undefined) logger = cfg.logger;
    applyConfigDurations(cfg.durations);
    applyConfigIcons(cfg.icons);
    applyConfigStack(cfg.stack);
    if (typeof cfg.maxVisible === 'number')
      maxVisible = Math.max(1, Math.floor(cfg.maxVisible) || 1);
    if (cfg.injectStyles !== undefined) injectEnabled = cfg.injectStyles !== false;
    if (cfg.theme !== undefined) {
      themeTokens = resolveTheme(cfg.theme);
      applyTheme();
    }
    containers.forEach((container) => layout(container));
    return api;
  }

  /* ---- assemble the public instance ---- */

  const api: ToastFn = Object.assign(
    (message: string, options?: ToastOptions) => info(message, options),
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
      configure,
      theme,
      injectStyles,
    },
  ) as ToastFn;

  // Apply the initial theme from constructor config.
  if (config.theme !== undefined) {
    themeTokens = resolveTheme(config.theme);
    applyTheme();
  }

  return api;
}

/* ------------------------------------------------------------------ *
 * Exports
 * ------------------------------------------------------------------ */

export interface ToastFn {
  (message: string, options?: ToastOptions): ToastHandle;
  show: (options?: ToastOptions) => ToastHandle;
  success: (message: string, options?: ToastOptions) => ToastHandle;
  error: (message: string, options?: ToastOptions) => ToastHandle;
  warning: (message: string, options?: ToastOptions) => ToastHandle;
  info: (message: string, options?: ToastOptions) => ToastHandle;
  loading: (message?: string, options?: ToastOptions) => ToastHandle;
  confirm: (message: string, options?: ConfirmOptions) => ToastHandle;
  promise: <T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options?: ToastOptions,
  ) => Promise<T>;
  custom: (
    content: NonNullable<ToastOptions['content']>,
    options?: ToastOptions,
  ) => ToastHandle;
  close: (target: string | HTMLElement | null | undefined) => void;
  closeAll: () => void;
  /** Alias of `close` — dismiss one toast by id. */
  dismiss: (target: string | HTMLElement | null | undefined) => void;
  /** Alias of `closeAll` — dismiss every toast. */
  dismissAll: () => void;
  clear: (type?: ToastType) => void;
  update: (id: string, options: Partial<ToastOptions>) => ToastHandle | null;
  get: (id: string) => HTMLElement | null;
  exists: (id: string) => boolean;
  getCount: (type?: ToastType) => number;
  setDefaults: (defaults: ToastOptions) => void;
  setMaxVisible: (count: number) => void;
  setLogger: (fn: ((event: string, payload: unknown) => void) | null) => void;
  /** Configure this toaster (defaults, theme, icons, stack, headless, …). */
  configure: (cfg: ToasterConfig) => ToastFn;
  /** Set theme tokens or a named preset. */
  theme: (tokens: ThemeTokens | PresetName) => ToastFn;
  injectStyles: () => void;
}

/** Create an isolated toaster with its own theme, defaults, icons and root. */
export function createToaster(config: ToasterConfig = {}): ToastFn {
  return makeToaster(config);
}

/** The default, globally-shared toaster. */
export const toast: ToastFn = makeToaster();

/** Named object API, backwards-compatible with GA Toasts 1.x. */
export const GaToasts = toast;

export default toast;
