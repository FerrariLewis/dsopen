/**
 * Real dsh-startup-screen animation, MIT, Copyright (c) 2026 沈宏宏.
 * Original sources and full license are preserved in assets/startup-screen.
 * An injected runtime surface isolates the original plugin from Harness.
 */
import React, { useEffect, useRef } from 'react';
import { STARTUP_CSS } from '../assets/startup-screen/source.js';
import { mountStartupRuntime } from '../assets/startup-screen/adapted-runtime.js';

/** Mount the actual upstream sequence and return a synchronous disposer. */
export function mountStartupSequence(container, { sound = false, volume = 0.7, onEnded } = {}) {
  const realDocument = container.ownerDocument;
  const realWindow = realDocument.defaultView;
  const shadow = container.shadowRoot ?? container.attachShadow({ mode: 'open' });
  const style = realDocument.createElement('style');
  style.textContent = STARTUP_CSS;
  const body = realDocument.createElement('div');
  body.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#000;';
  shadow.replaceChildren(style, body);
  let disposed = false;
  let completed = false;
  const timers = new Set();
  const intervals = new Set();
  const frames = new Set();
  const contexts = new Set();
  const listeners = [];
  const eventTarget = new EventTarget();
  const documentEvents = new EventTarget();
  const level = Number.isFinite(Number(volume)) ? Math.min(1, Math.max(0, Number(volume))) : 0.7;
  const audible = sound === true && level > 0;

  const trackEvents = target => ({
    addEventListener(type, listener, options) {
      target.addEventListener(type, listener, options);
      listeners.push(() => target.removeEventListener(type, listener, options));
    },
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  });
  const storage = () => {
    const values = new Map();
    return { getItem: key => values.get(String(key)) ?? null, setItem: (key, value) => values.set(String(key), String(value)), removeItem: key => values.delete(String(key)) };
  };
  const NativeContext = realWindow.AudioContext || realWindow.webkitAudioContext;
  function ManagedAudioContext(...args) {
    if (disposed || !audible || !NativeContext) throw new Error('Audio disabled');
    const context = new NativeContext(...args);
    contexts.add(context);
    return context;
  }
  if (NativeContext) ManagedAudioContext.prototype = NativeContext.prototype;

  // These objects are private values, not proxies that mutate real globals.
  // In particular upstream voice.stop() can never cancel the host speech queue.
  const localWindow = {
    ...trackEvents(eventTarget),
    __DSH_STARTUP__: {
      enabled: true, mode: 'always', theme: 'light', speed: 1,
      requireInteraction: false, allowSkip: false,
      sound: audible, soundVolume: level,
      voice: false, voiceCue: false, voiceSource: 'tts', sfx: 'synth',
    },
    __DSH_STARTUP_SKIP__: false,
    AudioContext: ManagedAudioContext, webkitAudioContext: ManagedAudioContext,
    speechSynthesis: undefined, SpeechSynthesisUtterance: undefined,
    sessionStorage: storage(), localStorage: storage(),
  };
  const localDocument = {
    ...trackEvents(documentEvents),
    readyState: 'complete', body,
    // Upstream's scroll locking applies only to these private elements.
    documentElement: realDocument.createElement('div'),
    head: realDocument.createElement('div'),
    createElement: realDocument.createElement.bind(realDocument),
    createElementNS: realDocument.createElementNS.bind(realDocument),
    createTextNode: realDocument.createTextNode.bind(realDocument),
    createDocumentFragment: realDocument.createDocumentFragment.bind(realDocument),
    getElementById: id => shadow.getElementById(id),
  };
  const environment = {
    window: localWindow, document: localDocument,
    setTimeout(callback, delay, ...args) {
      if (disposed) return 0;
      const id = realWindow.setTimeout(() => { timers.delete(id); if (!disposed) callback(...args); }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) { timers.delete(id); realWindow.clearTimeout(id); },
    setInterval(callback, delay, ...args) {
      if (disposed) return 0;
      const id = realWindow.setInterval(() => { if (!disposed) callback(...args); }, delay);
      intervals.add(id);
      return id;
    },
    clearInterval(id) { intervals.delete(id); realWindow.clearInterval(id); },
    requestAnimationFrame(callback) {
      if (disposed) return 0;
      const id = realWindow.requestAnimationFrame(time => { frames.delete(id); if (!disposed) callback(time); });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) { frames.delete(id); realWindow.cancelAnimationFrame(id); },
    // Audio assets are intentionally excluded. Never request the original host.
    fetch: () => Promise.reject(new Error('External startup assets are disabled')),
  };

  function dispose() {
    if (disposed) return;
    disposed = true;
    // Settle pending upstream waits, then synchronously stop every owned resource.
    try { localWindow.__DSH_STARTUP_API__?.skip(); } catch {}
    for (const id of timers) realWindow.clearTimeout(id);
    for (const id of intervals) realWindow.clearInterval(id);
    for (const id of frames) realWindow.cancelAnimationFrame(id);
    timers.clear(); intervals.clear(); frames.clear();
    for (const context of contexts) {
      try { void context.close().catch(() => {}); } catch {}
    }
    contexts.clear();
    for (const off of listeners) off();
    listeners.length = 0;
    body.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    shadow.replaceChildren();
  }
  function complete() {
    if (completed || disposed) return;
    completed = true;
    dispose();
    onEnded?.();
  }
  localWindow.addEventListener('dsh-startup:done', complete, { once: true });
  try { mountStartupRuntime(environment); }
  catch (error) { dispose(); throw error; }
  return dispose;
}

/** Embed inside Player's full-screen dialog. The parent owns all clicks/keys. */
export function StartupSequence({ sound = false, volume = 0.7, onEnded }) {
  const host = useRef(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;
  useEffect(() => {
    if (!host.current) return;
    try { return mountStartupSequence(host.current, { sound, volume, onEnded: () => ended.current?.() }); }
    catch { ended.current?.(); }
  }, [sound, volume]);
  return <div ref={host} data-testid="startup-sequence" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', background: '#000' }} />;
}
