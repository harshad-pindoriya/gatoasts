import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toast, GaToasts } from '../src/index';

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
