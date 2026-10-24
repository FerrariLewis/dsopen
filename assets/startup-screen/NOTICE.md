# dsh-startup-screen source adoption

Upstream: https://github.com/6shenhonghong9/dsh-startup-screen

Revision: `8ec3132e69f0906b3ed2f7eb083b1035cd69c1d4`

`splash.js` and `splash.css` are copied unchanged from upstream `lib/`. Their author is 沈宏宏, copyright 2026, MIT. The complete license is included as `LICENSE` in this directory. `source.js` contains these exact two files as JavaScript strings for source preservation and offline stylesheet embedding. `adapted-runtime.js` changes only the original runtime's outer IIFE into an exported function with an injected environment; the original sequence, SVG, layout and animation code are retained.

Boot Studio embeds the runtime in a Shadow DOM with private window/document/event/storage objects. It selects the upstream noninteractive mode, disables the upstream skip controls, storage modes and speech, and uses only the runtime's own synthesized WebAudio effects when sound is enabled. The surrounding Boot Studio player owns key/click skipping. The sequence plays to its original natural completion and then shows the selected title cover; there is no configurable playback cap, loop, or added final-frame hold. Completion and unmount synchronously stop audio contexts, timers and animation frames and clear the owned scene.

The original runtime's MP3 files are **not included**. Upstream's README states those recordings/effects were extracted from third-party videos without authorization and are outside its code license. No BGM, sampled voice recording, or sampled sound effect from that repository is redistributed here. The visual implementation is preserved as source, rather than replaced by an approximation. DeepSeek names and marks identify compatibility; no endorsement is implied.
