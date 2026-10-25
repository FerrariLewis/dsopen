/** Own only the fullscreen session requested by a playing Enchant overlay. */
const sessions = new WeakMap();
const ATTRIBUTE = 'data-lewis-immersive';

function nativeFullscreen(root) {
  return root?.getAttribute?.('data-fullscreen') === 'true';
}

function hasFullscreen(state) {
  return Boolean(state.doc.fullscreenElement) || nativeFullscreen(state.root);
}

function report(state, error) {
  state.lastError = error;
  for (const lease of state.leases) {
    try { lease.onError?.(error); } catch { /* Presentation errors never block entry. */ }
  }
}

function mark(state) {
  state.originalAttribute = state.root.getAttribute(ATTRIBUTE);
  state.root.setAttribute(ATTRIBUTE, 'true');
  state.marked = true;
}

function unmark(state) {
  if (!state.marked) return;
  if (state.originalAttribute === null) state.root.removeAttribute(ATTRIBUTE);
  else state.root.setAttribute(ATTRIBUTE, state.originalAttribute);
  state.marked = false;
}

function clean(state) {
  if (state.leases.size || state.pending || state.exiting) return;
  unmark(state);
  state.doc.removeEventListener?.('fullscreenchange', state.changed);
  if (sessions.get(state.doc) === state) sessions.delete(state.doc);
}

async function idle(state) {
  if (state.leases.size) return;
  if (state.pending) { await state.pending; return idle(state); }
  if (state.exiting) { await state.exiting; return idle(state); }
  if (state.owned && state.doc.fullscreenElement === state.root) {
    state.owned = false;
    state.status = 'restoring';
    // Set a non-null sentinel before invoking an API which may emit synchronously
    // in test hosts. A new lease waits for this exit before asking to enter again.
    let exit;
    state.exiting = Promise.resolve();
    try { exit = state.doc.exitFullscreen(); }
    catch (error) { report(state, error); }
    const done = Promise.resolve(exit).catch(error => report(state, error)).then(() => {
      if (state.exiting === done) state.exiting = null;
      if (!state.leases.size) { state.status = 'released'; clean(state); }
    });
    state.exiting = done;
    await done;
    return;
  }
  state.owned = false;
  state.status = 'released';
  clean(state);
}

function enter(state, retry = false) {
  if (!state.leases.size) return Promise.resolve(false);
  if (state.exiting) return state.exiting.then(() => enter(state, retry));
  if (state.pending) return state.pending;
  if (state.leftByUser) { state.status = 'left-fullscreen'; return Promise.resolve(false); }
  if (hasFullscreen(state)) {
    if (!state.owned) state.preserved = true;
    state.status = state.owned ? 'active' : 'existing-fullscreen';
    return Promise.resolve(true);
  }
  if (typeof state.root.requestFullscreen !== 'function' || state.doc.fullscreenEnabled === false) {
    state.status = 'unsupported';
    return Promise.resolve(false);
  }
  if (state.attempted && !retry) return Promise.resolve(false);
  state.attempted = true;
  state.status = 'requesting';
  const attempt = { entered: false };
  state.attempt = attempt;
  let request;
  try { request = state.root.requestFullscreen({ navigationUI: 'hide' }); }
  catch (error) { request = Promise.reject(error); }
  const pending = Promise.resolve(request).then(() => {
    if (state.doc.fullscreenElement === state.root && !state.leftByUser) {
      state.owned = true;
      state.status = 'active';
      return true;
    }
    state.status = state.leftByUser ? 'left-fullscreen' : 'not-entered';
    return false;
  }, error => {
    state.status = 'denied';
    report(state, error);
    return false;
  }).then(async active => {
    if (state.pending === pending) state.pending = null;
    if (state.attempt === attempt) state.attempt = null;
    if (!state.leases.size) { await idle(state); return false; }
    return active;
  });
  state.pending = pending;
  return pending;
}

function createSession(doc) {
  const state = {
    doc, root: doc.documentElement, leases: new Set(), pending: null,
    exiting: null, owned: false, leftByUser: false, attempted: false,
    retryUsed: false, preserved: false, attempt: null, marked: false, originalAttribute: null,
    status: 'idle', lastError: null,
  };
  state.changed = () => {
    const current = doc.fullscreenElement;
    if (state.attempt && current === state.root) state.attempt.entered = true;
    if ((state.owned || state.attempt?.entered) && current !== state.root && !state.exiting) {
      state.owned = false;
      state.leftByUser = true;
      state.status = 'left-fullscreen';
    }
  };
  doc.addEventListener?.('fullscreenchange', state.changed);
  sessions.set(doc, state);
  return state;
}

/**
 * Acquire synchronously for the whole Player lifetime (intro AND end title).
 * `ready` and trusted-gesture retry resolve boolean; rejection never blocks video.
 * Release only on Player unmount. Existing user/other-plugin fullscreen is retained.
 */
export function acquireImmersive(doc = globalThis.document, options = {}) {
  if (!doc?.documentElement) {
    return { ready: Promise.resolve(false), release: () => Promise.resolve(),
      retryFromGesture: () => Promise.resolve(false), getStatus: () => 'unsupported' };
  }
  let state = sessions.get(doc);
  if (!state) state = createSession(doc);
  if (!state.leases.size) {
    // New playback may reuse an earlier pending enter/exit, but gets its own
    // attempt allowance. Never run two native enter/exit requests concurrently.
    state.leftByUser = false;
    state.attempted = false;
    state.retryUsed = false;
    state.preserved = false;
    state.lastError = null;
    mark(state);
  }
  const record = { released: false, onError: options.onError };
  state.leases.add(record);
  const resultForLease = promise => promise.then(active => !record.released && active);
  const ready = resultForLease(enter(state));
  return {
    ready,
    getStatus: () => record.released ? 'released' : state.status,
    retryFromGesture(event) {
      if (record.released || state.leftByUser || event?.isTrusted !== true) return Promise.resolve(false);
      if (state.preserved) return Promise.resolve(hasFullscreen(state));
      if (state.pending || state.exiting || hasFullscreen(state)) return resultForLease(enter(state));
      if (state.retryUsed) return Promise.resolve(false);
      state.retryUsed = true;
      return resultForLease(enter(state, true));
    },
    release() {
      if (!record.released) {
        record.released = true;
        state.leases.delete(record);
        if (!state.leases.size) unmark(state);
      }
      return idle(state);
    },
  };
}
