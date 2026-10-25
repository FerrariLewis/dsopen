# Third-party notices

## dsh-boot-animation

This project references the DSH host/client registration and media playback architecture of [NativeDog1/dsh-boot-animation](https://github.com/NativeDog1/dsh-boot-animation).

- Reference revision: [`24c711296cb4af2618fef4f65e81346a660fc67b`](https://github.com/NativeDog1/dsh-boot-animation/tree/24c711296cb4af2618fef4f65e81346a660fc67b)
- Copyright: Copyright (c) 2026, dsh-boot-animation contributors. All rights reserved.
- License: BSD 3-Clause. The complete upstream license, including its bundled-media permission note, is reproduced without modification in [LICENSE](LICENSE).
- The upload/settings implementation and user interface are maintained in this repository. This notice does not imply endorsement by NativeDog1, the upstream contributors, or DeepSeek.

## Bundled videos

The four videos below are copied **unchanged** from the upstream `media/` directory at the revision above. They are upstream artwork, not original animations created for dsh-boot-studio. The display names in the interface are local labels for these existing clips.

The upstream LICENSE explicitly states that its `media/*.mp4` inputs and embedded clips are distributed under the same BSD 3-Clause terms as the code, with the plugin author's permission. That permission note remains included in this distribution's LICENSE.

| File in this project | Upstream source | SHA-256 |
| --- | --- | --- |
| `assets/deepseek-brand-intro.mp4` | `media/deepseek-brand-intro.mp4` | `b22de4810e195b50f5da760febca8352d9e2dbd7bbefe7c203cc294bd8203c72` |
| `assets/deepseek-cyberpunk-intro.mp4` | `media/deepseek-cyberpunk-intro.mp4` | `beabf5956e0b467e9f06f467b3f5b7a682abb6555c1b16aee1c27f7e5b334a58` |
| `assets/deepseek-awakening-intro.mp4` | `media/deepseek-awakening-intro.mp4` | `ff5afe0dabc16e09d5d1d4a349a551173a872f5c9850c0aab358ebaaf4b09712` |
| `assets/deepseek-startup-intro.mp4` | `media/deepseek-startup-intro.mp4` | `ba72c501021444cd4bd89ce2cf547a539dfb0874c985a03859d048ee013acb4f` |

## 用户上传的视频

用户上传的视频保存在本机的数据目录，不会作为本插件的内置素材再分发。上述媒体授权说明只适用于本插件附带的四段上游视频。

## dsh-startup-screen interactive startup sequence

The technical dossier startup sequence reuses the **actual original code and stylesheet**, copied unchanged from `lib/splash.js` and `lib/splash.css` in [6shenhonghong9/dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen), revision [`8ec3132e69f0906b3ed2f7eb083b1035cd69c1d4`](https://github.com/6shenhonghong9/dsh-startup-screen/tree/8ec3132e69f0906b3ed2f7eb083b1035cd69c1d4).

Copyright (c) 2026 沈宏宏. MIT License. Installation packages contain the compiled visual implementation, the full upstream license in [assets/startup-screen/LICENSE](assets/startup-screen/LICENSE), and an [adapter notice](assets/startup-screen/NOTICE.md). The original source files and adapter are preserved in the [source repository](https://github.com/FerrariLewis/dsh-/tree/main/assets/startup-screen).

Boot Studio supplies an isolated React/Shadow DOM adapter, automatic progression through the original confirmation scenes, centralized keyboard/pointer input, and synchronous audio/timer cleanup. The original runtime's outer IIFE becomes a function receiving private window/document/event/storage objects; the animation core is retained. The original plugin's settings, storage, global keyboard handlers and host injection are not installed into Harness.

The upstream README excludes third-party material from the MIT code license and states its bundled MP3 recordings/effects came from third-party videos without authorization. **None of those MP3 files are copied or redistributed.** Speech and asset audio are disabled; optional sound comes exclusively from the original runtime's synthesized WebAudio effects. `sound=false` and volume zero disable audio context creation. This is a community adaptation, with no claimed affiliation or endorsement.

## 鲸鱼娘 / Deepsea Echo

`assets/deepseek-whale-girl-intro.mp4` adapts the complete official animation recording from [cshengyi023-collab/dsh-deepsea-echo](https://github.com/cshengyi023-collab/dsh-deepsea-echo), commit `c5599f80cf5a517e220a91524dbdda791406c09d`. The 70 original frames retain their original 66 ms timing, for a total of 4.620 seconds. The original synthesized sound has been trimmed to match the visual duration.

The character artwork and its rendered animation are distributed under **CC BY-NC-SA 4.0**, including this transcoded video. They are excluded from this project's BSD code license. Full attribution chain: **上善 → ZipZipPipe → Small-tailqwq**. DeepSeek retains its brand rights. Original code and synthesized sound use MIT.

The original [MIT license](assets/deepsea-notices/LICENSE), [artwork license](assets/deepsea-notices/LICENSE-ARTWORK.md), [complete attribution](assets/deepsea-notices/NOTICE-ARTWORK.md) and [adaptation details](assets/deepsea-notices/ADAPTATION.md) are included in the installation package. This project distributes this artwork for noncommercial use under the same artwork license.

## Author-provided image

`assets/author/author.jpg` is the original image supplied by the project owner for the author-information dialog. Its bytes and embedded payment information are unchanged. It is displayed locally, only when the user opens the author-information dialog; the plugin does not initiate a payment.

## Generated title covers

The three PNGs in `assets/end-covers/` were generated and refined for this project with the built-in imagegen tool, then selected by the user: `silver.png` (white mountains), `gold.png` (gold mist), and `ice.png` (blue digital sea). They combine a light DeepSeek-derived whale mark with the earlier background concepts. They are distributed with this project's BSD-3-Clause license. The DeepSeek name and whale identity refer to the host product; this community project does not claim endorsement by DeepSeek.
