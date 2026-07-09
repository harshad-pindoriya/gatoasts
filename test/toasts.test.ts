import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toast, GaToasts, createToaster } from '../src/index';

const REMOVE_FALLBACK = 450;

/** Flush the removal fallback timer so closed toasts leave the DOM/registry. */
function flushRemovals() {
  vi.advanceTimersByTime(REMOVE_FALLBACK + 10);
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '';
});

afterEach(() => {
  toast.closeAll();
  flushRemovals();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

function toastEls() {
  return document.querySelectorAll('.ga-toast');
}

describe('basics', () => {
  it('shows a toast and returns a usable handle', () => {
    const h = toast.success('Saved', { title: 'Success' });
    expect(h.id).toBeTruthy();
    expect(h.el).toBeInstanceOf(HTMLElement);
    expect(toastEls().length).toBe(1);
    expect(h.el.querySelector('.ga-toast-title')?.textContent).toBe('Success');
    expect(h.el.querySelector('.ga-toast-message')?.textContent).toBe('Saved');
    expect(h.el.classList.contains('ga-toast-success')).toBe(true);
  });

  it('injects the stylesheet exactly once', () => {
    toast.info('one');
    toast.info('two');
    expect(document.querySelectorAll('#ga-toasts-styles').length).toBe(1);
  });

  it('exposes the same API on GaToasts (1.x compatibility) and toast', () => {
    expect(GaToasts).toBe(toast);
    expect(typeof GaToasts.success).toBe('function');
    expect(typeof GaToasts.closeAll).toBe('function');
  });
});

describe('bug #2 — closing by string id / selector does not throw', () => {
  it('accepts a bare id', () => {
    const h = toast.info('x', { id: 'my-toast' });
    expect(() => toast.close('my-toast')).not.toThrow();
    flushRemovals();
    expect(document.getElementById('my-toast')).toBeNull();
    expect(h.id).toBe('my-toast');
  });

  it('accepts a #selector form', () => {
    toast.info('x', { id: 'sel-toast' });
    expect(() => toast.close('#sel-toast')).not.toThrow();
    flushRemovals();
    expect(document.getElementById('sel-toast')).toBeNull();
  });
});

describe('bug #1 — manual close before the auto-close timer fires never crashes', () => {
  it('closing immediately then letting the timer elapse throws nothing', () => {
    const h = toast.info('boom', { duration: 3000 });
    // Close by hand right away…
    expect(() => h.close()).not.toThrow();
    // …then let the original auto-close delay pass. In v1 this threw on
    // parentNode of the detached clone.
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    expect(toastEls().length).toBe(0);
  });

  it('auto-closes on its own after the duration', () => {
    toast.info('auto', { duration: 2000 });
    expect(toastEls().length).toBe(1);
    vi.advanceTimersByTime(2000);
    flushRemovals();
    expect(toastEls().length).toBe(0);
  });
});

describe('bug #3 — update({ message }) replaces only the message', () => {
  it('keeps the meta line and updates just the message text', () => {
    const h = toast.show({
      id: 'upd',
      title: 'Title',
      meta: 'just now',
      message: 'first',
    });
    h.update({ message: 'second' });
    expect(h.el.querySelector('.ga-toast-meta')?.textContent).toBe('just now');
    expect(h.el.querySelector('.ga-toast-message')?.textContent).toBe('second');
    expect(h.el.querySelector('.ga-toast-title')?.textContent).toBe('Title');
  });

  it('updates type classes and progress color', () => {
    const h = toast.info('x', { id: 't', duration: 5000 });
    h.update({ type: 'success' });
    expect(h.el.classList.contains('ga-toast-success')).toBe(true);
    expect(h.el.classList.contains('ga-toast-info')).toBe(false);
    expect(
      h.el.querySelector('.ga-toast-progress')?.classList.contains('ga-toast-progress-success'),
    ).toBe(true);
  });

  it('reusing an existing id updates instead of duplicating', () => {
    toast.info('a', { id: 'dupe' });
    toast.info('b', { id: 'dupe' });
    expect(document.querySelectorAll('#dupe').length).toBe(1);
    expect(toastEls().length).toBe(1);
  });
});

describe('bug #7 — messages are escaped unless html:true', () => {
  const payload = '<img src=x onerror="window.__xss=1">';

  it('renders untrusted markup as text by default', () => {
    const h = toast.info(payload);
    const msg = h.el.querySelector('.ga-toast-message')!;
    expect(msg.querySelector('img')).toBeNull();
    expect(msg.textContent).toBe(payload);
  });

  it('allows markup when html:true is set explicitly', () => {
    const h = toast.show({ message: '<b>bold</b>', html: true });
    expect(h.el.querySelector('.ga-toast-message b')).not.toBeNull();
  });
});

describe('bug #5 — no stray console logging', () => {
  it('error() does not write to the console', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    toast.error('kaboom');
    expect(spy).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
    spy.mockRestore();
    errSpy.mockRestore();
  });
});

describe('bug #6 — accessibility', () => {
  it('creates aria-live regions and mirrors toast text', () => {
    toast.success('Profile saved', { title: 'Done' });
    vi.advanceTimersByTime(60);
    const polite = document.querySelector('.ga-toast-live-region[aria-live="polite"]');
    expect(polite).not.toBeNull();
    expect(polite?.textContent).toContain('Profile saved');
  });

  it('uses role=alert for errors and role=status otherwise', () => {
    const err = toast.error('bad');
    const ok = toast.success('good');
    expect(err.el.getAttribute('role')).toBe('alert');
    expect(ok.el.getAttribute('role')).toBe('status');
  });

  it('marks the visible toast aria-live=off so it is not announced twice', () => {
    const err = toast.error('bad');
    expect(err.el.getAttribute('aria-live')).toBe('off');
  });

  it('Escape closes the newest toast', () => {
    toast.info('first', { id: 'a' });
    toast.info('second', { id: 'b' });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    flushRemovals();
    expect(document.getElementById('b')).toBeNull();
    expect(document.getElementById('a')).not.toBeNull();
  });
});

describe('timers', () => {
  it('pauses the countdown while the tab is hidden, resumes when visible', () => {
    toast.info('stay', { id: 'vis', duration: 2000 });

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    // Would have auto-closed at 2000ms if the timer weren't paused.
    vi.advanceTimersByTime(3000);
    expect(document.getElementById('vis')).not.toBeNull();

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(2000 + REMOVE_FALLBACK + 10);
    expect(document.getElementById('vis')).toBeNull();

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });
});

describe('management helpers', () => {
  it('getCount, exists, get, clear(type), closeAll', () => {
    toast.success('s1');
    toast.success('s2');
    toast.error('e1');
    expect(toast.getCount()).toBe(3);
    expect(toast.getCount('success')).toBe(2);

    const h = toast.info('findme', { id: 'findme' });
    expect(toast.exists('findme')).toBe(true);
    expect(toast.get('#findme')).toBe(h.el);

    toast.clear('success');
    flushRemovals();
    expect(toast.getCount('success')).toBe(0);
    expect(toast.getCount('error')).toBe(1);

    toast.closeAll();
    flushRemovals();
    expect(toast.getCount()).toBe(0);
  });
});

describe('actions & confirm', () => {
  it('fires an action handler with the handle and closes by default', () => {
    const onClick = vi.fn();
    const h = toast.show({
      message: 'act',
      duration: 0,
      actions: [{ text: 'Do it', onClick }],
    });
    const btn = h.el.querySelector('[data-ga-action]') as HTMLButtonElement;
    btn.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][1]).toBe(h);
    flushRemovals();
    expect(toastEls().length).toBe(0);
  });

  it('confirm wires up confirm/cancel', () => {
    const onConfirm = vi.fn();
    const h = toast.confirm('Sure?', { onConfirm });
    const buttons = h.el.querySelectorAll('[data-ga-action]');
    expect(buttons.length).toBe(2);
    (buttons[1] as HTMLButtonElement).click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe('promise()', () => {
  it('shows loading then success', async () => {
    // Fake timers don't fake microtasks, so awaiting the promise still works.
    const h = toast.promise(Promise.resolve('ok'), {
      loading: 'Saving…',
      success: (v) => `Saved ${v}`,
      error: 'Failed',
    });
    await expect(h).resolves.toBe('ok');
    const el = document.querySelector('.ga-toast') as HTMLElement;
    expect(el.classList.contains('ga-toast-success')).toBe(true);
    expect(el.querySelector('.ga-toast-message')?.textContent).toBe('Saved ok');
  });
});

describe('confirm() is modal + singleton', () => {
  it('shows a backdrop and allows only one confirm at a time', () => {
    const h1 = toast.confirm('First?');
    expect(document.querySelector('.ga-toast-backdrop')).not.toBeNull();
    expect(toast.getCount()).toBe(1);

    const h2 = toast.confirm('Second?'); // ignored while one is open
    expect(h2).toBe(h1);
    expect(toast.getCount()).toBe(1);
    expect(document.querySelectorAll('[role="alertdialog"]').length).toBe(1);
  });

  it('does not close on Escape — an action is required', () => {
    toast.confirm('Sure?');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    flushRemovals();
    expect(toast.getCount()).toBe(1);
  });

  it('removes the backdrop once the confirm closes', () => {
    const h = toast.confirm('Sure?');
    h.close();
    vi.advanceTimersByTime(REMOVE_FALLBACK + 300); // finalize + backdrop fade-out
    expect(document.querySelector('.ga-toast-backdrop')).toBeNull();
    expect(toast.getCount()).toBe(0);
  });
});

describe('custom() content', () => {
  it('renders an HTML string', () => {
    const h = toast.custom('<div class="mine">hi</div>');
    expect(h.el.classList.contains('ga-toast-has-custom')).toBe(true);
    expect(h.el.querySelector('.ga-toast-custom .mine')?.textContent).toBe('hi');
  });

  it('renders a provided element', () => {
    const node = document.createElement('span');
    node.textContent = 'node';
    const h = toast.custom(node);
    expect(h.el.querySelector('.ga-toast-custom span')?.textContent).toBe('node');
  });
});

describe('confirm() focus management', () => {
  it('is an alertdialog, moves focus into itself, and restores focus on close', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const h = toast.confirm('Sure?', { onConfirm() {} });
    expect(h.el.getAttribute('role')).toBe('alertdialog');
    expect(h.el.getAttribute('aria-label')).toContain('Sure?');
    expect(h.el.contains(document.activeElement)).toBe(true);

    h.close();
    flushRemovals();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

describe('review fixes', () => {
  it('an avatar toast does not also render a redundant type icon', () => {
    const h = toast.show({ avatar: 'https://x/a.png', message: 'hi' });
    expect(h.el.querySelector('.ga-toast-avatar')).not.toBeNull();
    expect(h.el.querySelector('.ga-toast-icon')).toBeNull();
  });

  it('an explicit icon still shows even with an avatar', () => {
    const h = toast.show({ avatar: 'https://x/a.png', icon: '<svg></svg>', message: 'hi' });
    expect(h.el.querySelector('.ga-toast-icon')).not.toBeNull();
  });

  it('update({ closable }) adds and removes the close button', () => {
    const h = toast.loading('Working…', { id: 'ld' }); // closable:false
    expect(h.el.querySelector('.ga-toast-close')).toBeNull();
    toast.update('ld', { closable: true });
    expect(h.el.querySelector('.ga-toast-close')).not.toBeNull();
    toast.update('ld', { closable: false });
    expect(h.el.querySelector('.ga-toast-close')).toBeNull();
  });

  it('update() inserts a new message above existing actions', () => {
    const h = toast.show({ id: 'act', duration: 0, actions: [{ text: 'Go' }] });
    toast.update('act', { message: 'now with text' });
    const content = h.el.querySelector('.ga-toast-content')!;
    const kids = Array.from(content.children).map((c) => c.className.split(' ')[0]);
    expect(kids.indexOf('ga-toast-body')).toBeLessThan(kids.indexOf('ga-toast-actions'));
  });
});

describe('global defaults', () => {
  it('applies then can be overridden per call', () => {
    toast.setDefaults({ position: 'bottom-center' });
    const h = toast.info('x');
    const container = h.el.parentElement!;
    expect(container.classList.contains('ga-toast-container-bottom-center')).toBe(true);
    // restore for other tests
    toast.setDefaults({ position: 'top-end' });
  });
});

describe('overflow queue', () => {
  // Every test here assumes the default cap; guarantee it regardless of order.
  beforeEach(() => toast.setMaxVisible(3));

  it('shows only maxVisible cards and hides (pushes back) the overflow', () => {
    for (let i = 0; i < 4; i++)
      toast.info('n' + i, { id: 'q' + i, position: 'top-end', duration: 0 });
    expect(toastEls().length).toBe(4);
    // Newest sits in front; the oldest is pushed behind the visible cap.
    const oldest = document.getElementById('q0')!;
    const newest = document.getElementById('q3')!;
    expect(oldest.style.opacity).toBe('0');
    expect(oldest.getAttribute('aria-hidden')).toBe('true');
    expect(newest.style.opacity).toBe('1');
    toast.closeAll();
    flushRemovals();
  });

  it('a queued (hidden) toast does not auto-expire — it waits, then surfaces', () => {
    // Without the fix, the hidden oldest would count down while invisible and
    // be gone by ~1000ms. With the queue its timer is frozen until it surfaces.
    for (let i = 0; i < 4; i++)
      toast.info('n' + i, { id: 'w' + i, position: 'bottom-end', duration: 1000 });
    expect(document.getElementById('w0')!.style.opacity).toBe('0'); // hidden

    // The 3 visible toasts time out and leave.
    vi.advanceTimersByTime(1000);
    flushRemovals();

    // The previously-hidden oldest survived and is now the only one left…
    const survivor = document.getElementById('w0');
    expect(survivor).not.toBeNull();
    expect(survivor!.style.opacity).toBe('1'); // …and it surfaced
    expect(toastEls().length).toBe(1);

    // …its freshly-armed timer then dismisses it normally.
    vi.advanceTimersByTime(1000);
    flushRemovals();
    expect(toastEls().length).toBe(0);
  });

  it('setMaxVisible re-lays out live: lowering hides, raising surfaces', () => {
    toast.setMaxVisible(1);
    toast.info('a', { id: 'm0', position: 'top-start', duration: 0 });
    toast.info('b', { id: 'm1', position: 'top-start', duration: 0 });
    expect(document.getElementById('m0')!.style.opacity).toBe('0'); // older hidden
    expect(document.getElementById('m1')!.style.opacity).toBe('1'); // newest visible

    toast.setMaxVisible(3); // raising the cap surfaces the queued one at once
    expect(document.getElementById('m0')!.style.opacity).toBe('1');
    toast.closeAll();
    flushRemovals();
  });

  it('exposes dismiss / dismissAll aliases of close / closeAll', () => {
    expect(toast.dismiss).toBe(toast.close);
    expect(toast.dismissAll).toBe(toast.closeAll);
    toast.info('x', { id: 'al', duration: 0 });
    toast.dismiss('al');
    flushRemovals();
    expect(document.getElementById('al')).toBeNull();
  });
});

describe('swipe does not paint a text selection', () => {
  function ptr(type: string, x: number, y: number, target: EventTarget) {
    target.dispatchEvent(
      new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y }),
    );
  }

  it('adds the swiping guard class once a horizontal drag commits, and clears it on release', () => {
    const h = toast.error('Something went wrong', { title: 'Error', duration: 0 });
    const msg = h.el.querySelector('.ga-toast-message')!;
    ptr('pointerdown', 200, 20, msg);
    expect(h.el.classList.contains('ga-toast-swiping')).toBe(false); // press alone: text still selectable
    ptr('pointermove', 250, 20, h.el); // dx=50, horizontal → commits to a swipe
    expect(h.el.classList.contains('ga-toast-swiping')).toBe(true);
    ptr('pointerup', 250, 20, h.el); // snaps back (below fling threshold)
    expect(h.el.classList.contains('ga-toast-swiping')).toBe(false);
    expect(document.getElementById(h.id)).not.toBeNull();
  });

  it('leaves text selectable during a mostly-vertical drag', () => {
    const h = toast.info('hi', { duration: 0 });
    ptr('pointerdown', 100, 20, h.el);
    ptr('pointermove', 110, 80, h.el); // dy (60) dominates dx (10) → not a swipe
    expect(h.el.classList.contains('ga-toast-swiping')).toBe(false);
    ptr('pointerup', 110, 80, h.el);
  });
});

describe('configurability (createToaster / configure / theme)', () => {
  it('createToaster instances are isolated', () => {
    const a = createToaster();
    const b = createToaster();
    a.info('x', { id: 'iso-a', duration: 0 });
    b.info('y', { id: 'iso-b', duration: 0 });
    expect(a.getCount()).toBe(1);
    expect(b.getCount()).toBe(1);
    a.closeAll();
    flushRemovals();
    expect(a.getCount()).toBe(0);
    expect(b.getCount()).toBe(1); // b is untouched
    b.closeAll();
    flushRemovals();
  });

  it('configure({ durations }) sets the per-type helper default', () => {
    const t = createToaster({ durations: { info: 1000 } });
    t.info('x', { id: 'dur' }); // no explicit duration → uses configured 1000
    expect(document.getElementById('dur')).not.toBeNull();
    vi.advanceTimersByTime(1000);
    flushRemovals();
    expect(document.getElementById('dur')).toBeNull();
  });

  it('configure({ icons }) swaps a type icon', () => {
    const t = createToaster({ icons: { success: '<svg class="cust-ic"></svg>' } });
    const h = t.success('x', { duration: 0 });
    expect(h.el.querySelector('.ga-toast-icon .cust-ic')).not.toBeNull();
    t.closeAll();
    flushRemovals();
  });

  it('injectStyles:false injects no stylesheet', () => {
    document.getElementById('ga-toasts-styles')?.remove();
    const t = createToaster({ injectStyles: false });
    t.info('x', { duration: 0 });
    expect(document.getElementById('ga-toasts-styles')).toBeNull();
    t.closeAll();
    flushRemovals();
  });

  it('render() replaces the toast body', () => {
    const t = createToaster({
      render: (o) => {
        const d = document.createElement('div');
        d.className = 'rr';
        d.textContent = o.message || '';
        return d;
      },
    });
    const h = t.info('hello', { duration: 0 });
    expect(h.el.querySelector('.ga-toast-custom .rr')?.textContent).toBe('hello');
    t.closeAll();
    flushRemovals();
  });

  it('theme() injects scoped custom-property overrides (tokens + presets)', () => {
    const t = createToaster();
    t.theme({ radius: 4, accent: '#ff0066', density: 'compact' });
    const css = Array.from(
      document.querySelectorAll('style[id^="ga-toasts-theme-"]'),
    )
      .map((s) => s.textContent)
      .join('');
    expect(css).toContain('--gat-radius:4px');
    expect(css).toContain('--gat-primary:#ff0066');
    expect(css).toContain('--gat-pad-y:8px'); // compact density
    // preset shorthand also resolves
    const p = createToaster();
    p.theme('sharp');
    const css2 = Array.from(
      document.querySelectorAll('style[id^="ga-toasts-theme-"]'),
    )
      .map((s) => s.textContent)
      .join('');
    expect(css2).toContain('--gat-radius:4px');
  });

  it('the default toast exposes configure/theme/createToaster', () => {
    expect(typeof toast.configure).toBe('function');
    expect(typeof toast.theme).toBe('function');
    expect(typeof createToaster).toBe('function');
    expect(toast.configure({}).theme).toBe(toast.theme); // chainable, returns the instance
  });
});

describe('hover-expand anti-flicker', () => {
  function ptr(type: string, target: EventTarget) {
    target.dispatchEvent(new MouseEvent(type, { bubbles: false }));
  }

  it('debounces collapse: crossing gaps keeps the stack expanded, a real exit collapses', () => {
    for (let i = 0; i < 5; i++) toast.info('n' + i, { position: 'top-start', duration: 0 });
    const container = document.querySelector('.ga-toast-container-top-start') as HTMLElement;

    ptr('pointerenter', container);
    expect(container.dataset.gaExpanded).toBe('true');

    // Gap crossing: the pointer briefly leaves the stack then re-enters the next
    // card before COLLAPSE_DELAY elapses — the re-enter must cancel the collapse.
    ptr('pointerleave', container);
    vi.advanceTimersByTime(60); // < 140ms delay
    ptr('pointerenter', container);
    vi.advanceTimersByTime(300);
    expect(container.dataset.gaExpanded).toBe('true'); // never flickered closed

    // A genuine exit collapses once the grace period passes.
    ptr('pointerleave', container);
    vi.advanceTimersByTime(160); // > 140ms delay
    expect(container.dataset.gaExpanded).toBe('false');

    toast.closeAll();
    flushRemovals();
  });
});

describe('animation option drives a visible enter effect', () => {
  /**
   * setup.ts runs rAF callbacks synchronously, so by the time show() returns the
   * toast is already mounted and layout() has overwritten the inline transform
   * with its resting value. Hold the callbacks back to observe the off-stage
   * transform — the one that decides what the enter actually looks like.
   */
  function showOffStage(options: Parameters<typeof toast.show>[0]) {
    const raf = globalThis.requestAnimationFrame;
    const queue: FrameRequestCallback[] = [];
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      queue.push(cb);
      return 0;
    }) as typeof requestAnimationFrame;
    try {
      const h = toast.show(options);
      const start = h.el.style.transform;
      while (queue.length) queue.splice(0).forEach((cb) => cb(0));
      return { h, start, resting: h.el.style.transform };
    } finally {
      globalThis.requestAnimationFrame = raf;
    }
  }

  /** Body of an injected rule, e.g. `--gat-move-dur:.42s;--gat-fade-dur:.16s`. */
  function cssRule(className: string): string {
    const body = cssRuleOrEmpty(className);
    if (!body) throw new Error(`no injected rule for .${className}`);
    return body;
  }

  /** Same, but `slide` ships no rule at all — it *is* the base timing. */
  function cssRuleOrEmpty(className: string): string {
    const css = document.getElementById('ga-toasts-styles')?.textContent ?? '';
    return css.match(new RegExp(`\\.${className}\\{([^}]*)\\}`))?.[1] ?? '';
  }

  /** Reads a `--gat-<name>: .42s` custom property out of a rule body. */
  function seconds(rule: string, name: string): number {
    const raw = rule.match(new RegExp(`--gat-${name}: ?(\\d*\\.?\\d+)s`))?.[1];
    if (raw === undefined) throw new Error(`--gat-${name} missing from ${rule}`);
    return Number(raw);
  }

  it('namespaces the class hook instead of leaking a bare `bounce`/`fade`', () => {
    const h = toast.show({ message: 'hi', animation: 'bounce' });
    expect(h.el.classList.contains('ga-toast-anim-bounce')).toBe(true);
    expect(h.el.classList.contains('bounce')).toBe(false);
  });

  /** Every preset, and the off-stage transform that defines how it enters. */
  const PRESETS = {
    fade: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)',
    none: 'translateY(0px) translateX(0px) scale(1) rotate(0deg)',
    scale: 'translateY(0px) translateX(0px) scale(0.75) rotate(0deg)',
    zoom: 'translateY(0px) translateX(0px) scale(1.25) rotate(0deg)',
    slide: 'translateY(0px) translateX(115%) scale(1) rotate(0deg)',
    bounce: 'translateY(0px) translateX(115%) scale(1) rotate(0deg)',
    swing: 'translateY(0px) translateX(115%) scale(1) rotate(7deg)',
    drop: 'translateY(-160%) translateX(0px) scale(1) rotate(0deg)',
    flip: 'translateY(0px) translateX(0px) scale(1) rotate(0deg) perspective(900px) rotateX(-88deg)',
  } as const;

  const REST = 'translateY(0px) translateX(0px) scale(1) rotate(0deg)';

  it.each(Object.entries(PRESETS))('%s enters from its own off-stage transform', (animation, from) => {
    const { start, resting } = showOffStage({
      message: 'hi',
      animation: animation as keyof typeof PRESETS,
      position: 'top-end',
    });
    expect(start).toBe(from);
    expect(resting).toBe(REST);
  });

  it('gives every preset a signature no other preset shares', () => {
    // A preset is its starting transform *and* its timing: `slide` and `bounce`
    // travel the identical path and are told apart only by easing, while `fade`
    // and `none` both start at rest and are told apart only by transition. So
    // neither half alone is a fair uniqueness check — the pair is.
    toast.info('warm the stylesheet'); // injected on first show, not at import
    const signatures = Object.entries(PRESETS).map(
      ([name, from]) => `${from}|${cssRuleOrEmpty(`ga-toast-anim-${name}`)}`,
    );
    expect(cssRuleOrEmpty('ga-toast-anim-bounce')).not.toBe('');
    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it('parks fade and none at rest so opacity carries the whole effect', () => {
    for (const animation of ['fade', 'none'] as const) {
      const { start, resting } = showOffStage({ message: 'hi', animation });
      expect(start).toBe(resting);
      toast.closeAll();
      flushRemovals();
    }
  });

  it('scale starts shrunk and zoom starts oversized — opposite energies', () => {
    const grab = (t: string) => Number(t.match(/scale\((\d*\.?\d+)\)/)?.[1]);
    expect(grab(PRESETS.scale)).toBeLessThan(1);
    expect(grab(PRESETS.zoom)).toBeGreaterThan(1);
  });

  it('scale, zoom and flip finish fading well before they finish moving', () => {
    // If the card is still translucent while it moves, the eye reads the fade
    // and the preset collapses into `fade`.
    for (const name of ['scale', 'zoom', 'flip'] as const) {
      const rule = cssRule(`ga-toast-anim-${name}`);
      expect(seconds(rule, 'fade-dur')).toBeLessThan(seconds(rule, 'move-dur') / 2);
    }
  });

  it('swing tilts away from the direction it travels', () => {
    const rot = (t: string) => Number(t.match(/rotate\((-?\d*\.?\d+)deg\)/)?.[1]);
    const fromRight = showOffStage({ message: 'hi', animation: 'swing', position: 'top-end' });
    expect(rot(fromRight.start)).toBeGreaterThan(0);
    toast.closeAll();
    flushRemovals();

    const fromLeft = showOffStage({ message: 'hi', animation: 'swing', position: 'top-start' });
    expect(rot(fromLeft.start)).toBeLessThan(0);
  });

  it('drop always falls from overhead, even on a bottom-anchored stack', () => {
    const { start } = showOffStage({
      message: 'hi',
      animation: 'drop',
      position: 'bottom-center',
    });
    expect(start).toBe('translateY(-160%) translateX(0px) scale(1) rotate(0deg)');
  });

  it('keeps every off-stage transform on the same function list as layout()', () => {
    // Mismatched lists force the browser to decompose two matrices instead of
    // interpolating component-wise. `flip` opts into that knowingly — it is the
    // only preset needing 3D, and perspective() has no counterpart at rest.
    const fns = (t: string) => t.match(/[a-zA-Z]+(?=\()/g) ?? [];
    for (const animation of Object.keys(PRESETS) as (keyof typeof PRESETS)[]) {
      if (animation === 'flip') continue;
      const { start, resting } = showOffStage({ message: 'hi', animation });
      expect(fns(start)).toEqual(fns(resting));
      toast.closeAll();
      flushRemovals();
    }
    expect(fns(PRESETS.flip).slice(0, 4)).toEqual(fns(REST));
  });

  it('folds the sign into the calc() rather than emitting `+ -140%`', () => {
    const { start } = showOffStage({
      message: 'hi',
      animation: 'slide',
      position: 'middle-center',
    });
    expect(start).toContain('calc(-50% - 140%)');
  });

  it('middle stacks start at the -50% they rest at, so they do not drift', () => {
    for (const position of ['middle-start', 'middle-center'] as const) {
      const { start, resting } = showOffStage({ message: 'hi', animation: 'fade', position });
      expect(start).toBe('translateY(calc(-50% + 0px)) translateX(0px) scale(1) rotate(0deg)');
      expect(start).toBe(resting);
      toast.closeAll();
      flushRemovals();
    }
  });

  it('bounce overshoots past its resting point; slide keeps the default easing', () => {
    // A y-control-point above 1 is what carries the transform past its target
    // and back — without it `bounce` is just a slower `slide`.
    const y = Number(
      cssRule('ga-toast-anim-bounce').match(/cubic-bezier\([^,]+, ?(\d*\.?\d+)/)?.[1],
    );
    expect(y).toBeGreaterThan(1);

    const css = document.getElementById('ga-toasts-styles')?.textContent ?? '';
    expect(css).toMatch(/transform var\(--gat-move-dur/);
    expect(() => cssRule('ga-toast-anim-slide')).toThrow(); // defaults, no overrides
  });
});
