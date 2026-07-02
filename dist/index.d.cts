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
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'loading';
type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
type ToastAnimation = 'fade' | 'slide' | 'bounce' | 'scale';
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
declare function injectStyles(): void;
declare function show(options?: ToastOptions): ToastHandle;
declare function close(target: string | HTMLElement | null | undefined): void;
declare function closeAll(): void;
declare function clear(type?: ToastType): void;
declare function getCount(type?: ToastType): number;
declare function exists(id: string): boolean;
declare function get(id: string): HTMLElement | null;
declare const success: (message: string, options?: ToastOptions) => ToastHandle;
declare const error: (message: string, options?: ToastOptions) => ToastHandle;
declare const warning: (message: string, options?: ToastOptions) => ToastHandle;
declare const info: (message: string, options?: ToastOptions) => ToastHandle;
declare function loading(message?: string, options?: ToastOptions): ToastHandle;
declare function confirm(message: string, options?: ConfirmOptions): ToastHandle;
declare function promise<T>(input: Promise<T> | (() => Promise<T>), messages: PromiseMessages<T>, options?: ToastOptions): Promise<T>;
declare function setDefaults(defaults: ToastOptions): void;
declare function setLogger(fn: ((event: string, payload: unknown) => void) | null): void;
/** Render arbitrary content (HTML string, element, or a factory) as a toast. */
declare function custom(content: NonNullable<ToastOptions['content']>, options?: ToastOptions): ToastHandle;
interface ToastFn {
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
declare const toast: ToastFn;
/** Named object API, backwards-compatible with GA Toasts 1.x. */
declare const GaToasts: ToastFn;

export { type ConfirmOptions, GaToasts, type PromiseMessages, type ToastAction, type ToastAnimation, type ToastFn, type ToastHandle, type ToastOptions, type ToastPosition, type ToastProgressPosition, type ToastSize, type ToastType, type ToastVariant, toast as default, toast };
