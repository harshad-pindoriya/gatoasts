/**
 * GA Toasts — modern, accessible, dependency-free toast notifications.
 *
 * Design goals of the 2.x rewrite:
 *  - Every toast owns its state (element, timer, listeners) in a registry, so
 *    closing/updating never leaves dangling timers or crashes (v1 bug: closing
 *    a toast before its auto-close timer fired threw on `parentNode`).
 *  - Listeners are attached through a per-toast AbortController and torn down in
 *    one call — no `cloneNode` tricks.
 *  - Messages are rendered as text by default (`html: true` to opt into markup),
 *    closing the v1 XSS hole.
 *  - Screen readers are notified through a persistent `aria-live` region.
 *  - The stacked layout is computed in JS (a single transform per toast) so the
 *    enter/leave, swipe, stack-offset and expand-on-hover transforms never fight.
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

export type ToastAnimation = 'fade' | 'slide' | 'bounce' | 'scale';
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

/* ------------------------------------------------------------------ *
 * Internals
 * ------------------------------------------------------------------ */

const canUseDOM =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const PREFIX = 'ga-toast';
const STYLE_ID = 'ga-toasts-styles';
const PEEK = 14; // px each stacked card peeks out when collapsed
const STACK_GAP = 14; // px gap between cards when expanded
const MAX_VISIBLE = 3; // stacked cards shown before the rest fade out
const REMOVE_FALLBACK = 450; // ms — safety net if transitionend never fires

interface TimerState {
  duration: number;
  remaining: number;
  startedAt: number;
  handle: ReturnType<typeof setTimeout> | null;
  paused: boolean;
}

interface Instance {
  id: string;
  el: HTMLElement;
  handle: ToastHandle;
  opts: Required<Pick<ToastOptions, 'position'>> & ToastOptions;
  controller: AbortController;
  progressEl: HTMLElement | null;
  timer: TimerState;
  height: number;
  closing: boolean;
  swipeX: number;
  resizeObserver: ResizeObserver | null;
  prevFocus: Element | null;
}

const registry = new Map<string, Instance>();
const containers = new Map<ToastPosition, HTMLElement>();
let globalDefaults: ToastOptions = {};
let logger: ((event: string, payload: unknown) => void) | null = null;
let liveRegions: { polite: HTMLElement; assertive: HTMLElement } | null = null;
let escapeBound = false;
let visibilityBound = false;
let idCounter = 0;
let activeModalId: string | null = null;
let backdropEl: HTMLElement | null = null;

// Lucide-style stroke icons. `.ga-ic-ring` / `.ga-ic-draw` are animated (drawn
// in) by CSS on mount; the whole set inherits the accent color via currentColor.
const S =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const ICONS: Record<string, string> = {
  success: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M7.75 12.5l2.75 2.75L16.5 9" class="ga-ic-draw"/></svg>`,
  error: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M15 9l-6 6M9 9l6 6" class="ga-ic-draw"/></svg>`,
  warning: `${S}<path d="M12 3.6 2.4 20.4h19.2L12 3.6z" class="ga-ic-ring"/><path d="M12 10v4" class="ga-ic-draw"/><path d="M12 17.4v.01"/></svg>`,
  info: `${S}<circle cx="12" cy="12" r="9" class="ga-ic-ring"/><path d="M12 11v5" class="ga-ic-draw"/><path d="M12 7.6v.01"/></svg>`,
  primary: `${S}<path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77 6.8 19.5l.99-5.79-4.21-4.1 5.82-.85L12 3.5z" class="ga-ic-draw"/></svg>`,
  secondary: `${S}<path d="M6 9a6 6 0 0112 0c0 4.5 1.8 5.6 1.8 5.6H4.2S6 13.5 6 9z" class="ga-ic-draw"/><path d="M10 19a2 2 0 004 0"/></svg>`,
  loading:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" class="ga-toast-spinner"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 3a9 9 0 019 9"/></svg>',
};

// Proper SVG for the close control (was a CSS "×" glyph).
const CLOSE_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const ASSERTIVE_TYPES = new Set<ToastType>(['error', 'warning']);

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

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

function prefersReducedMotion(): boolean {
  return (
    canUseDOM &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* ---- styles + a11y live region ---- */

function injectStyles(): void {
  if (!canUseDOM) return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = styles;
  document.head.appendChild(el);
}

function ensureLiveRegions(): void {
  if (!canUseDOM) return;
  // Recreate if the regions were detached (e.g. SPA route change wiped body).
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
    document.body.appendChild(region);
    return region;
  };
  liveRegions = { polite: make('polite'), assertive: make('assertive') };
}

function announce(text: string, assertive: boolean): void {
  if (!text) return;
  ensureLiveRegions();
  if (!liveRegions) return;
  const region = assertive ? liveRegions.assertive : liveRegions.polite;
  // Clearing first makes repeated identical messages re-announce.
  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = text;
  }, 50);
}

/* ---- containers ---- */

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

function offscreenTransform(position: ToastPosition): string {
  const inFromLeft = 'translateX(-115%)';
  const inFromRight = 'translateX(115%)';
  const rtl = isRTL();
  // -start toasts enter from the inline-start edge (right in RTL), -end from the end.
  if (position.endsWith('start')) return rtl ? inFromRight : inFromLeft;
  if (position.endsWith('end')) return rtl ? inFromLeft : inFromRight;
  // centered columns fly in/out vertically
  return verticalDir(position) === 1 ? 'translateY(-140%)' : 'translateY(140%)';
}

function getContainer(position: ToastPosition): HTMLElement {
  const existing = containers.get(position);
  if (existing && existing.isConnected) return existing;

  const container = document.createElement('div');
  container.className = `ga-toast-container ga-toast-container-${position}`;
  container.setAttribute('data-ga-position', position);
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Notifications');

  const expand = () => setExpanded(container, true);
  const collapse = () => setExpanded(container, false);
  container.addEventListener('pointerenter', expand);
  container.addEventListener('pointerleave', collapse);
  container.addEventListener('focusin', expand);
  container.addEventListener('focusout', (e) => {
    if (!container.contains((e as FocusEvent).relatedTarget as Node)) collapse();
  });

  document.body.appendChild(container);
  containers.set(position, container);
  return container;
}

function setExpanded(container: HTMLElement, expanded: boolean): void {
  if ((container.dataset.gaExpanded === 'true') === expanded) return;
  container.dataset.gaExpanded = expanded ? 'true' : 'false';
  layout(container);
}

function instancesIn(container: HTMLElement): Instance[] {
  // DOM order = insertion order; front (newest) is last appended.
  return Array.from(container.children)
    .map((child) => registry.get((child as HTMLElement).id))
    .filter((inst): inst is Instance => !!inst);
}

/**
 * Recompute the transform + stacking for every toast in a container. Front
 * (newest) toast is index 0; older toasts recede behind it when collapsed and
 * fan out into a spaced list when expanded.
 */
function layout(container: HTMLElement): void {
  const all = instancesIn(container);
  const position = (container.dataset.gaPosition || 'top-end') as ToastPosition;
  const dir = verticalDir(position);
  const expanded = container.dataset.gaExpanded === 'true';
  const reduce = prefersReducedMotion();

  // Front = newest = last in DOM order.
  const front = all.slice().reverse();
  container.style.setProperty('--ga-toasts-count', String(front.length));

  let cumulative = 0;
  front.forEach((inst, frontIndex) => {
    if (inst.closing) return;

    if (!inst.el.dataset.gaMounted) {
      // Still animating in from offscreen; leave its transform alone.
      cumulative += inst.height + STACK_GAP;
      return;
    }

    let translateY: number;
    let scale: number;
    let opacity: number;

    if (expanded || reduce) {
      translateY = dir * cumulative;
      scale = 1;
      opacity = 1;
    } else {
      translateY = dir * frontIndex * PEEK;
      scale = Math.max(1 - frontIndex * 0.05, 0.85);
      opacity = frontIndex >= MAX_VISIBLE ? 0 : 1;
    }

    const swipe = inst.swipeX ? ` translateX(${inst.swipeX}px)` : '';
    // Middle positions anchor the toast's top at 50%; shift up by half its own
    // height so the front toast is truly vertically centered.
    const ty = position.startsWith('middle')
      ? `calc(-50% + ${translateY}px)`
      : `${translateY}px`;
    inst.el.style.transform = `translateY(${ty})${swipe} scale(${scale})`;
    inst.el.style.opacity = inst.swipeX ? String(swipeOpacity(inst.swipeX)) : String(opacity);
    inst.el.style.zIndex = String(1000 + front.length - frontIndex);
    inst.el.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
    inst.el.setAttribute('aria-hidden', opacity === 0 ? 'true' : 'false');

    cumulative += inst.height + STACK_GAP;
  });
}

function swipeOpacity(dx: number): number {
  return Math.max(0.15, 1 - Math.abs(dx) / 220);
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

function createCloseButton(): HTMLButtonElement {
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'ga-toast-close';
  close.setAttribute('aria-label', 'Close notification');
  close.setAttribute('data-ga-close', '');
  close.innerHTML = CLOSE_ICON;
  return close;
}

function appendProgress(
  el: HTMLElement,
  opts: Instance['opts'],
  type: string,
): HTMLElement | null {
  if (!opts.progress || (opts.duration || 0) <= 0 || opts.progressPosition === 'none')
    return null;
  const p = document.createElement('div');
  p.className =
    `ga-toast-progress ga-toast-progress-${type}` +
    (opts.progressPosition === 'top' ? ' ga-toast-progress-top' : '');
  el.appendChild(p);
  return p;
}

function buildToastElement(opts: Instance['opts'], id: string): {
  el: HTMLElement;
  progressEl: HTMLElement | null;
} {
  const type = opts.type || 'info';
  const el = document.createElement('div');
  el.id = id;
  el.className = [
    'ga-toast',
    `ga-toast-${type}`,
    opts.size ? `ga-toast-${opts.size}` : '',
    opts.variant ? `ga-toast-${type}-${opts.variant}` : '',
    opts.animation || '',
    opts.compact ? 'ga-toast-compact' : '',
    opts.glassmorphism ? 'ga-toast-glass' : '',
    type === 'loading' ? 'ga-toast-loading' : '',
    opts.className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const role =
    opts.role || (ASSERTIVE_TYPES.has(type) ? 'alert' : 'status');
  el.setAttribute('role', role);
  // Announcements go through the dedicated live region (see announce()); keep the
  // visible toast out of the live-region tree so screen readers don't read it twice.
  el.setAttribute('aria-live', 'off');
  el.setAttribute('data-ga-type', type);

  // A dialog role needs an accessible name.
  if (role === 'alertdialog' || role === 'dialog') {
    const label = [opts.title, opts.message].filter(Boolean).join('. ');
    if (label) el.setAttribute('aria-label', label);
  }

  // Custom content: render arbitrary markup/element instead of the default layout.
  if (opts.content != null) {
    el.classList.add('ga-toast-has-custom');
    const wrap = document.createElement('div');
    wrap.className = 'ga-toast-custom';
    const c = typeof opts.content === 'function' ? opts.content() : opts.content;
    if (typeof c === 'string') wrap.innerHTML = c;
    else if (c instanceof HTMLElement) wrap.appendChild(c);
    el.appendChild(wrap);
    if (opts.closable) el.appendChild(createCloseButton());
    return { el, progressEl: appendProgress(el, opts, type) };
  }

  // Leading media (avatar + type icon) sit beside the content column so that
  // title-less toasts still read as a single aligned row.
  if (opts.avatar) {
    const avatar = document.createElement('img');
    avatar.className = 'ga-toast-avatar';
    avatar.src = opts.avatar;
    avatar.alt = opts.avatarAlt || opts.title || 'Notification';
    el.appendChild(avatar);
  }

  let iconHtml: string | null = null;
  if (opts.icon) iconHtml = String(opts.icon);
  // An avatar takes the leading slot — don't also show a generic type glyph.
  else if (opts.icon !== false && opts.autoIcon !== false && !opts.avatar)
    iconHtml = ICONS[type] || ICONS.info;
  if (iconHtml) {
    const icon = document.createElement('div');
    icon.className = 'ga-toast-icon';
    icon.innerHTML = iconHtml;
    el.appendChild(icon);
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

  return { el, progressEl: appendProgress(el, opts, type) };
}

/* ---- timers + progress ---- */

function startTimer(inst: Instance): void {
  const { timer } = inst;
  if (timer.duration <= 0 || timer.remaining <= 0) return;
  timer.paused = false;
  timer.startedAt = now();
  timer.handle = setTimeout(() => close(inst.id), timer.remaining);
  animateProgress(inst, timer.remaining);
}

function pauseTimer(inst: Instance): void {
  const { timer } = inst;
  if (timer.paused || timer.handle == null) return;
  clearTimeout(timer.handle);
  timer.handle = null;
  timer.paused = true;
  const elapsed = now() - timer.startedAt;
  timer.remaining = Math.max(0, timer.remaining - elapsed);
  freezeProgress(inst);
}

function resumeTimer(inst: Instance): void {
  if (!inst.timer.paused) return;
  startTimer(inst);
}

function animateProgress(inst: Instance, ms: number): void {
  const bar = inst.progressEl;
  if (!bar) return;
  // Snap to current fraction with no transition, then animate to empty.
  const fraction = inst.timer.duration > 0 ? ms / inst.timer.duration : 0;
  bar.style.transition = 'none';
  bar.style.transform = `scaleX(${fraction})`;
  // Force reflow so the browser registers the starting scale.
  void bar.offsetWidth;
  bar.style.transition = `transform ${ms}ms linear`;
  bar.style.transform = 'scaleX(0)';
}

function freezeProgress(inst: Instance): void {
  const bar = inst.progressEl;
  if (!bar) return;
  const fraction = inst.timer.duration > 0 ? inst.timer.remaining / inst.timer.duration : 0;
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
    el.addEventListener('pointerenter', () => pauseTimer(inst), { signal });
    el.addEventListener('pointerleave', () => resumeTimer(inst), { signal });
    el.addEventListener('focusin', () => pauseTimer(inst), { signal });
    el.addEventListener('focusout', () => resumeTimer(inst), { signal });
  }

  if (opts.swipeToClose) attachSwipe(inst);

  // Trap Tab within a modal toast so focus can't escape to the blocked page.
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
  let startX = 0;
  let startY = 0;

  el.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a, input, textarea, select'))
        return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      pauseTimer(inst);
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
      inst.swipeX = dx;
      const container = el.parentElement;
      if (container) layout(container);
    },
    { signal },
  );

  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > THRESHOLD) {
      const dir = dx > 0 ? 1 : -1;
      inst.el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      inst.el.style.transform = `translateX(${dir * 400}px)`;
      inst.el.style.opacity = '0';
      close(inst.id);
    } else {
      inst.swipeX = 0;
      const container = el.parentElement;
      if (container) layout(container);
      resumeTimer(inst);
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
    // Close the newest dismissible toast.
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
      if (hidden) {
        pauseTimer(inst);
      } else if (!(typeof inst.el.matches === 'function' && inst.el.matches(':hover'))) {
        // Resume unless the pointer is still parked on the toast.
        resumeTimer(inst);
      }
    }
  });
}

function showBackdrop(): void {
  if (!canUseDOM) return;
  if (!backdropEl) {
    backdropEl = document.createElement('div');
    backdropEl.className = 'ga-toast-backdrop';
    // The backdrop blocks the page but does NOT dismiss — an action is required.
  }
  if (!backdropEl.isConnected) document.body.appendChild(backdropEl);
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

/* ------------------------------------------------------------------ *
 * Core lifecycle
 * ------------------------------------------------------------------ */

function noopHandle(id: string): ToastHandle {
  const handle: ToastHandle = {
    id,
    el: (canUseDOM ? document.createElement('div') : ({} as HTMLElement)),
    update: () => handle,
    close: () => {},
  };
  return handle;
}

function show(options: ToastOptions = {}): ToastHandle {
  if (!canUseDOM) return noopHandle(options.id || nextId());

  const opts = resolveOptions(options);

  // If an id is reused, update in place instead of duplicating.
  if (opts.id && registry.has(opts.id)) {
    return update(opts.id, options) || noopHandle(opts.id);
  }

  // Modal singleton: while one modal (e.g. a confirm) is open, ignore further
  // modal requests and hand back the one already on screen.
  if (opts.modal) {
    if (activeModalId && registry.has(activeModalId)) {
      return registry.get(activeModalId)!.handle;
    }
    // A modal must be resolved by an action — no swipe/escape/outside dismiss.
    opts.swipeToClose = false;
    opts.closeOnEscape = false;
    opts.moveFocus = true;
  }

  injectStyles();
  bindEscape();
  bindVisibility();

  const id = opts.id || nextId();
  const { el, progressEl } = buildToastElement(opts, id);

  const controller = new AbortController();
  const timer: TimerState = {
    duration: opts.duration || 0,
    remaining: opts.duration || 0,
    startedAt: 0,
    handle: null,
    paused: false,
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

  // Start offscreen so the first frame animates in.
  el.style.transform = offscreenTransform(opts.position);
  el.style.opacity = '0';
  container.appendChild(el);

  attachHandlers(inst, opts);

  // Recompute layout whenever this toast changes size.
  if (typeof ResizeObserver !== 'undefined') {
    inst.resizeObserver = new ResizeObserver(() => {
      measure(inst);
      const parent = el.parentElement;
      if (parent) layout(parent);
    });
    inst.resizeObserver.observe(el);
  }

  // Next frame: mark mounted and animate into the stack.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!registry.has(id)) return;
      measure(inst);
      el.dataset.gaMounted = 'true';
      el.style.opacity = '1';
      layout(container);
      startTimer(inst);
      // Move focus into actionable toasts (e.g. confirm) for keyboard users.
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

  // A dialog announces itself via its accessible name on focus entry — using the
  // live region too would read it twice, so skip announce() for modal/dialogs.
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

  // If a swipe already flung it away, keep that transform; otherwise fly out.
  if (!inst.swipeX) {
    el.style.transition = '';
    el.classList.add('ga-toast-hide');
    el.style.transform = offscreenTransform(inst.opts.position);
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
    // Return focus to whatever had it before a focus-grabbing toast opened.
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

function normalizeId(idOrSelector: string): string {
  return idOrSelector.startsWith('#') ? idOrSelector.slice(1) : idOrSelector;
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
        // Keep the body above any actions/steps rather than after them.
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
    // Refresh the auto icon if one is shown.
    const iconEl = inst.el.querySelector('.ga-toast-icon');
    if (iconEl && opts.autoIcon !== false && !options.icon)
      iconEl.innerHTML = ICONS[options.type] || ICONS.info;
    opts.type = options.type;
  }

  if (options.icon !== undefined) {
    let iconEl = inst.el.querySelector('.ga-toast-icon') as HTMLElement | null;
    if (options.icon) {
      if (!iconEl) {
        iconEl = document.createElement('div');
        iconEl.className = 'ga-toast-icon';
        // Icon leads the row, just before the content column.
        const content = inst.el.querySelector('.ga-toast-content');
        inst.el.insertBefore(iconEl, content);
      }
      iconEl.innerHTML = String(options.icon);
    } else if (iconEl) {
      iconEl.remove();
    }
  }

  // Add/remove the close button when `closable` changes (e.g. a loading toast
  // resolved via promise() that now wants a manual dismiss control).
  if (options.closable !== undefined) {
    const existing = inst.el.querySelector(':scope > .ga-toast-close');
    if (options.closable && !existing) {
      inst.el.insertBefore(createCloseButton(), inst.progressEl || null);
    } else if (!options.closable && existing) {
      existing.remove();
    }
    opts.closable = options.closable;
  }

  // If the duration changes, restart the countdown.
  if (options.duration !== undefined) {
    if (inst.timer.handle != null) clearTimeout(inst.timer.handle);
    inst.timer.duration = options.duration;
    inst.timer.remaining = options.duration;
    opts.duration = options.duration;
    if (options.duration > 0 && el(inst).dataset.gaMounted) startTimer(inst);
  }

  const parent = inst.el.parentElement;
  if (parent) layout(parent);
  log('toast:update', { id });
  return inst.handle;
}

function el(inst: Instance): HTMLElement {
  return inst.el;
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

/* ------------------------------------------------------------------ *
 * Convenience API
 * ------------------------------------------------------------------ */

function typed(type: ToastType, fallbackDuration: number) {
  return (message: string, options: ToastOptions = {}): ToastHandle =>
    show({ ...options, type, message, duration: options.duration ?? fallbackDuration });
}

const success = typed('success', 5000);
const error = typed('error', 8000);
const warning = typed('warning', 6000);
const info = typed('info', 4000);

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
        duration: options.duration ?? 5000,
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
        duration: options.duration ?? 8000,
        closable: true,
      });
      throw err;
    },
  );
}

function setDefaults(defaults: ToastOptions): void {
  globalDefaults = { ...globalDefaults, ...defaults };
}

function setLogger(fn: ((event: string, payload: unknown) => void) | null): void {
  logger = typeof fn === 'function' ? fn : null;
}

/** Render arbitrary content (HTML string, element, or a factory) as a toast. */
function custom(
  content: NonNullable<ToastOptions['content']>,
  options: ToastOptions = {},
): ToastHandle {
  return show({ ...options, content });
}

/* ------------------------------------------------------------------ *
 * Exports
 * ------------------------------------------------------------------ */

export interface ToastFn {
  (message: string, options?: ToastOptions): ToastHandle;
  show: typeof show;
  success: typeof success;
  error: typeof error;
  warning: typeof warning;
  info: typeof info;
  loading: typeof loading;
  confirm: typeof confirm;
  promise: typeof promise;
  custom: typeof custom;
  close: typeof close;
  closeAll: typeof closeAll;
  clear: typeof clear;
  update: (id: string, options: Partial<ToastOptions>) => ToastHandle | null;
  get: typeof get;
  exists: typeof exists;
  getCount: typeof getCount;
  setDefaults: typeof setDefaults;
  setLogger: typeof setLogger;
  injectStyles: typeof injectStyles;
}

/** Callable shorthand: `toast('Saved')`, plus `toast.success(...)` etc. */
export const toast: ToastFn = Object.assign(
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
    clear,
    update,
    get,
    exists,
    getCount,
    setDefaults,
    setLogger,
    injectStyles,
  },
);

/** Named object API, backwards-compatible with GA Toasts 1.x. */
export const GaToasts = toast;

export default toast;
