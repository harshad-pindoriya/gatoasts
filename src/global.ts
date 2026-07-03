/**
 * Entry point for the IIFE / CDN build. tsup wraps this so that
 * `window.GaToasts` is the callable API object (see the `footer` in
 * tsup.config.ts which unwraps the default export).
 */
import { GaToasts, toast, createToaster } from './index';

// Expose the callable `toast` shorthand and the `createToaster` factory as
// properties so CDN/script-tag users get the full API off `window.GaToasts`.
(GaToasts as unknown as { toast: typeof toast }).toast = toast;
(GaToasts as unknown as { createToaster: typeof createToaster }).createToaster =
  createToaster;

export default GaToasts;
