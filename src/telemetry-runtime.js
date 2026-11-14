let context = null;

/** Public renderer metadata only; never copy account objects or credentials. */
export function bindTelemetryRuntime(value) {
  context = value;
  return () => {
    if (context === value) context = null;
  };
}
export function telemetryMetadata() {
  let version = null;
  try {
    version = context?.modules?.manifest?.release?.version;
  } catch {
    /* Optional host service. */
  }
  return {
    harnessVersion: typeof version === 'string' && version.length <= 64 ? version : null,
    locale: document.documentElement.lang || navigator.language || 'unknown',
  };
}
