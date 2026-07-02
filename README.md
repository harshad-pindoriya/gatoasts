# 🍞 GA Toasts

Modern, accessible, **dependency-free** toast notifications for the web.

[![npm](https://img.shields.io/npm/v/ga-toasts.svg)](https://www.npmjs.com/package/ga-toasts)
[![types](https://img.shields.io/badge/TypeScript-included-3178c6.svg)](#typescript)
[![deps](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

- 🧩 **Zero dependencies** — one small file, works everywhere.
- 🎞️ **Stacked & animated** — cards stack with depth and fan out on hover, with spring enter/leave and self-drawing stroke icons.
- ♿ **Actually accessible** — real `aria-live` announcements, `role="alert"` for errors, Escape to dismiss.
- 🔒 **Safe by default** — messages are rendered as text; opt into HTML only when you want it.
- 🎨 **Themeable** — light/dark/auto, CSS-variable design tokens, 6 types + `filled`/`light` variants.
- 📱 **Responsive & touch-friendly** — swipe to dismiss, pause on hover/focus.
- 🧵 **Framework-agnostic** — use it in React, Vue, Svelte, plain HTML, or on the server (SSR-safe no-op).
- 🟦 **First-class TypeScript** — types ship in the box.

**Live demo:** https://harshad-pindoriya.github.io/gatoasts/

---

## Install

```bash
npm install ga-toasts
```

```js
import { toast } from 'ga-toasts';

toast.success('Profile saved!');
```

The stylesheet is **injected automatically** on first use — nothing else to import.
Prefer to manage the CSS yourself? Import it and it won't double-inject:

```js
import 'ga-toasts/style.css';
```

### Via `<script>` / CDN (no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/ga-toasts@2"></script>
<script>
  GaToasts.success('It works!');
  // or the callable shorthand: GaToasts.toast('Hi there');
</script>
```

---

## Quick start

```js
import { toast } from 'ga-toasts';

// Shorthand
toast('Just so you know…');            // info by default

// Typed helpers
toast.success('Saved!', { title: 'Done' });
toast.error('Upload failed', { title: 'Oops' });
toast.warning('Low disk space');
toast.info('New version available');

// Full control
toast.show({
  title: 'File uploaded',
  message: 'report.pdf is ready.',
  type: 'success',
  position: 'bottom-end',
  duration: 6000,
});
```

### Action buttons

```js
toast.show({
  title: 'File uploaded',
  message: 'What next?',
  duration: 0, // sticky until dismissed
  actions: [
    { text: 'View', className: 'ga-toast-btn-primary', onClick: (e, t) => { open('/file'); t.close(); } },
    { text: 'Dismiss' }, // closes by default
  ],
});
```

### Confirmations

```js
toast.confirm('Delete this item?', {
  confirmText: 'Delete',
  onConfirm: () => reallyDelete(),
  onCancel:  () => {},
});
```

### Loading & promises

```js
const t = toast.loading('Uploading…');
t.update({ type: 'success', message: 'Done!', duration: 4000 });

// Or let a promise drive it:
toast.promise(saveUser(), {
  loading: 'Saving…',
  success: (user) => `Saved ${user.name}`,
  error:   (err) => `Failed: ${err.message}`,
});
```

### Update or close later

Every call returns a **handle**:

```js
const t = toast.info('Connecting…', { duration: 0 });
t.update({ message: 'Connected', type: 'success', duration: 3000 });
t.close();

// Or address a toast by id:
toast.info('Hang on', { id: 'net' });
toast.update('net', { message: 'Ready' });
toast.close('net');       // ← id or '#id', both work
toast.close('#net');
```

---

## API

### Creating toasts

| Method | Description |
| --- | --- |
| `toast(message, options?)` | Shorthand for an info toast. |
| `toast.show(options)` | Full-control toast. Returns a `ToastHandle`. |
| `toast.success/error/warning/info(message, options?)` | Typed helpers. |
| `toast.loading(message?, options?)` | Sticky spinner toast. |
| `toast.confirm(message, options?)` | **Modal** two-button confirmation (`onConfirm`/`onCancel`). Renders an `alertdialog` centered over a backdrop that blocks the page; focus is trapped and restored on close. Only one can be open at a time (further calls are ignored until it's answered). |
| `toast.promise(promise, { loading, success, error }, options?)` | Drives a toast from a promise; resolves/rejects like the input. |
| `toast.custom(content, options?)` | Render arbitrary content — an HTML string, a DOM element, or a factory returning one. |

### Managing toasts

| Method | Description |
| --- | --- |
| `toast.update(id, options)` | Patch an existing toast (title/message/type/icon/duration…). |
| `toast.close(id \| '#id' \| element)` | Close one toast. |
| `toast.closeAll()` | Close everything. |
| `toast.clear(type?)` | Close all, or all of one type. |
| `toast.getCount(type?)` | How many are on screen. |
| `toast.exists(id)` / `toast.get(id)` | Look one up. |
| `toast.setDefaults(options)` | Set global defaults merged into every toast. |
| `toast.setLogger(fn \| null)` | Receive lifecycle events (`toast:show`, `toast:close`, …). |
| `toast.injectStyles()` | Manually inject the stylesheet (usually automatic). |

The 1.x global name still works: `import { GaToasts } from 'ga-toasts'` — it's the same object as `toast`.

### Options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | Bold heading. |
| `message` | `string` | — | Body text (escaped unless `html: true`). |
| `meta` | `string` | — | Small muted line above the message. |
| `type` | `success \| error \| warning \| info \| primary \| secondary \| loading` | `info` | |
| `duration` | `number` (ms) | `5000` | `0` = sticky. |
| `position` | 9 positions (`top-end`, `bottom-center`, …) | `top-end` | |
| `closable` | `boolean` | `true` | Show the × button. |
| `html` | `boolean` | `false` | Render `message` as HTML (⚠️ only for trusted content). |
| `icon` | `string \| false \| null` | auto | Custom icon markup, or `false` to hide. Built-in icons are animated stroke SVGs; pass your own `<img src="…gif">` or `<lottie-player>` markup here for animated icons without adding a dependency. |
| `actions` | `ToastAction[]` | — | `{ text, className?, onClick?, closeOnClick? }`. |
| `variant` | `'' \| filled \| light` | `''` | |
| `size` | `xs \| sm \| md \| lg \| xl` | `md` | Adjusts density. |
| `swipeToClose` | `boolean` | `true` | Drag horizontally to dismiss. |
| `pauseOnHover` | `boolean` | `true` | Pause the countdown on hover/focus. |
| `closeOnEscape` | `boolean` | `true` | Escape dismisses the newest toast. |
| `progress` | `boolean` | `true` | Countdown bar. |
| `avatar` / `avatarAlt` | `string` | — | Leading avatar image. |
| `unread` | `boolean` | `false` | Small unread dot. |
| `showStatus` / `statusText` | `boolean` / `string` | — | Status chip. |
| `steps` / `currentStep` | `number` | — | Segmented multi-step indicator. |
| `glassmorphism` | `boolean` | `true` | Frosted-glass background (auto-disabled under `prefers-reduced-transparency`). |
| `content` | `string \| HTMLElement \| () => …` | — | Arbitrary content instead of the default layout (used by `toast.custom`). |
| `moveFocus` | `boolean` | `false` | Move focus into the toast on show, restore on close (used by `confirm`). |
| `role` | `string` | auto | ARIA role; defaults to `alert` for error/warning, `status` otherwise. |
| `onShow` / `onClose` | `(handle) => void` | — | Lifecycle callbacks. |
| `id` | `string` | auto | Reusing an id updates in place instead of duplicating. |

---

## TypeScript

Types are bundled — no `@types` package needed.

```ts
import { toast, type ToastOptions, type ToastHandle } from 'ga-toasts';

const opts: ToastOptions = { type: 'success', duration: 3000 };
const handle: ToastHandle = toast.show(opts);
```

---

## Theming

Toggle dark mode with an attribute or class on any ancestor (or let it follow the OS):

```html
<html data-ga-theme="dark">   <!-- or class="ga-theme-dark" -->
```

Everything is driven by namespaced CSS variables you can override:

```css
.ga-toast-container {
  --gat-radius: 12px;
  --gat-width: 420px;
  --gat-success: #10b981;
  --gat-error: #ef4444;
  --gat-info: #3b82f6;
}
```

---

## Accessibility

- Toasts announce through a dedicated `aria-live` region — **polite** for info/success, **assertive** (`role="alert"`) for warnings/errors.
- **Escape** dismisses the newest toast (`closeOnEscape`).
- The close button and actions are real, focusable `<button>`s with visible focus rings.
- The countdown pauses on hover **and** keyboard focus.
- `confirm()` is an `alertdialog`: focus moves to its buttons and returns to the trigger on close.
- Honors `prefers-reduced-motion` (animations collapse to a fade) and `prefers-reduced-transparency` (glass blur is dropped).
- Font sizes are in `rem`, so toasts scale with the user's browser font-size setting.
- **RTL** — set `dir="rtl"` on `<html>`; positions, layout, and enter/exit animations mirror automatically.

---

## Migrating from 1.x

The 1.x API still works, but a few things changed for the better:

- **Messages are now escaped by default.** If you relied on passing HTML in `message`, add `html: true`.
- **Action buttons:** prefer `className`/`onClick` over `class`/`click` (the old names still work).
- **Sizes** (`xs`–`xl`) now change *density*, not width — all toasts share one width (set `--gat-width` to change it).
- Calls return a **`ToastHandle`** (`{ id, el, update(), close() }`) instead of a raw element (`handle.el` is the element).
- New: `toast.promise()`, the callable `toast()` shorthand, real `aria-live` announcements, and swipe-to-dismiss.

---

## Development

```bash
npm install
npm run build   # → dist/ (ESM, CJS, IIFE, .d.ts, ga-toasts.css)
npm test        # vitest + jsdom
```

## License

MIT © Harshad Pindoriya
