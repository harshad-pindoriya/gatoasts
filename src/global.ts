/**
 * Entry point for the IIFE / CDN build. tsup wraps this so that
 * `window.GaToasts` is the callable API object (see the `footer` in
 * tsup.config.ts which unwraps the default export).
 */
import { GaToasts, toast } from './index';

// Expose the callable `toast` shorthand as a property for convenience.
(GaToasts as unknown as { toast: typeof toast }).toast = toast;

export default GaToasts;
