import { CORE_PACKAGE_NAME, NPM_ENTRY_NAME } from './constants.js';
import { getEnchantRegistry } from './enchant-bridge.js';

export const OPEN = `${CORE_PACKAGE_NAME}:open`;
export const PLAY = `${CORE_PACKAGE_NAME}:play`;
// One shared module owns launch decisions and published settings for all slots
// in this renderer, just as the original client entry did before splitting.
export const launchSession = { bootClaimed: false, request: null, decisionSettled: false };
export let latestState = null;
export const subscribers = new Set();
export const VERSION = typeof __DSH_LEWIS_VERSION__ === 'string' ? __DSH_LEWIS_VERSION__ : null;

export function publish(value) {
  latestState = value;
  subscribers.forEach((fn) => fn(value));
  return value;
}
export function openSettings() {
  if (getEnchantRegistry().openControllerSettings(NPM_ENTRY_NAME)) return;
  window.dispatchEvent(new Event(OPEN));
}
export function preview(clip, settings, endOnly = false, clipOnly = false) {
  window.dispatchEvent(new CustomEvent(PLAY, { detail: { clip, settings, endOnly, clipOnly } }));
}
