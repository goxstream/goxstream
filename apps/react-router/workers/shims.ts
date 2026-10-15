/**
 * Shims for browser globals required when client-oriented libraries
 * (such as @vidstack/react / media-captions) are evaluated during Worker startup / SSR.
 */
export {};

const globalScope = globalThis as unknown as Record<string, unknown>;

if (typeof globalScope.window === "undefined") {
  class DummyVTTCue {
    text = "";
    startTime = 0;
    endTime = 0;
    line = "auto";
    position = "auto";
    size = 100;
    align = "center";
  }

  globalScope.VTTCue = DummyVTTCue;
  globalScope.window = globalThis;
  (globalScope.window as Record<string, unknown>).VTTCue = DummyVTTCue;
}
