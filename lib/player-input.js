const MODIFIERS = new Set(['Control', 'Meta', 'Alt', 'Shift', 'AltGraph', 'OS']);

/** Preserve browser/OS shortcuts, IME composition and key-repeat behavior. */
export function handlePlayerKey(event, advance) {
  if (
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    MODIFIERS.has(event.key) ||
    event.isComposing
  )
    return false;
  event.preventDefault();
  event.stopPropagation();
  if (!event.repeat) advance();
  return true;
}
