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
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'loading';
type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
type ToastAnimation = 'fade' | 'slide' | 'bounce' | 'scale' | 'zoom' | 'flip' | 'swing' | 'drop' | 'none';
type ToastVariant = '' | 'filled' | 'light';
type ToastSize = '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ToastProgressPosition = 'top' | 'bottom' | 'none';
interface ToastAction {
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
interface ToastOptions {
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
interface ConfirmOptions extends ToastOptions {
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
interface PromiseMessages<T> {
    loading: string;
    success: string | ((value: T) => string);
    error: string | ((error: unknown) => string);
}
/** Handle returned from every toast; lets you update or close it later. */
interface ToastHandle {
    readonly id: string;
    readonly el: HTMLElement;
    update(options: Partial<ToastOptions>): ToastHandle;
    close(): void;
}
type PresetName = 'soft' | 'solid' | 'minimal' | 'sharp' | 'material';
/** Design tokens. Any omitted key keeps its default. Numbers → px where sensible. */
interface ThemeTokens {
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
interface StackConfig {
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
interface RenderContext {
    id: string;
    close: () => void;
}
interface ToasterConfig {
    /** Options merged into every toast (per-toast options still win). */
    defaults?: ToastOptions;
    /** Per-type default auto-close duration in ms. */
    durations?: Partial<Record<ToastType, number>>;
    /** Theme tokens or a named preset. */
    theme?: ThemeTokens | PresetName;
    /** Replace built-in icons (per type, `null` to hide) and/or the close icon. */
    icons?: Partial<Record<ToastType, string | null>> & {
        close?: string;
    };
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
interface ToastFn {
    (message: string, options?: ToastOptions): ToastHandle;
    show: (options?: ToastOptions) => ToastHandle;
    success: (message: string, options?: ToastOptions) => ToastHandle;
    error: (message: string, options?: ToastOptions) => ToastHandle;
    warning: (message: string, options?: ToastOptions) => ToastHandle;
    info: (message: string, options?: ToastOptions) => ToastHandle;
    loading: (message?: string, options?: ToastOptions) => ToastHandle;
    confirm: (message: string, options?: ConfirmOptions) => ToastHandle;
    promise: <T>(input: Promise<T> | (() => Promise<T>), messages: PromiseMessages<T>, options?: ToastOptions) => Promise<T>;
    custom: (content: NonNullable<ToastOptions['content']>, options?: ToastOptions) => ToastHandle;
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
declare function createToaster(config?: ToasterConfig): ToastFn;
/** The default, globally-shared toaster. */
declare const toast: ToastFn;
/** Named object API, backwards-compatible with GA Toasts 1.x. */
declare const GaToasts: ToastFn;

export { type ConfirmOptions, GaToasts, type PresetName, type PromiseMessages, type RenderContext, type StackConfig, type ThemeTokens, type ToastAction, type ToastAnimation, type ToastFn, type ToastHandle, type ToastOptions, type ToastPosition, type ToastProgressPosition, type ToastSize, type ToastType, type ToastVariant, type ToasterConfig, createToaster, toast as default, toast };
