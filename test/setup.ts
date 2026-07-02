// jsdom has no requestAnimationFrame. Run callbacks synchronously so the
// mount step (which the engine schedules via a double rAF) completes within
// show(), making assertions deterministic.
globalThis.requestAnimationFrame = ((cb: FrameRequestCallback): number => {
  cb(typeof performance !== 'undefined' ? performance.now() : Date.now());
  return 0;
}) as typeof requestAnimationFrame;

globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;
