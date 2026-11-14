# Optional developer data sharing

This local working copy adds a **与开发者共享数据** button next to the existing author-information action at the bottom of plugin settings. Version 1.4.0 is being prepared for release; publication requires completion of the deployment and release checks.

The default collector is `https://dsopen-collector-lewis.lewiszhouyichen.chatgpt.site`. Sharing is still off by default: without explicit consent, no profile lookup, registration or telemetry request occurs. Ordinary users do not configure an endpoint. The ordinary animation and existing update checks retain their behavior.

The Harness host environment can override the default with `DSOPEN_TELEMETRY_ENDPOINT`; changing the endpoint requires fresh authorization after the previous endpoint's data has been deleted. Setting this variable to an empty string disables collection configuration. A local development test can explicitly set `DSOPEN_TELEMETRY_ENDPOINT=http://127.0.0.1:4318` and `DSOPEN_TELEMETRY_ALLOW_LOCAL=1`; the distributed plugin does not assume or contact that loopback address. The local preview dashboard and the separately deployed cloud services have distinct authentication boundaries.

Consent, endpoint binding, installation credentials and last-send metadata are stored in `$DSH_HOME/boot-studio/telemetry.json` (default `~/.dsh/boot-studio/telemetry.json`). Account IDs, nicknames, contacts, avatars, session tokens and API keys are not saved in this file. Credentials remain on the server side of the plugin and are never returned through the settings API. This file is separate from playback preferences and media reset; “恢复默认” does not change data-sharing authorization. Use the sharing dialog to stop sharing and request deletion.

The renderer supplies only the public `ctx.modules.manifest.release.version` and interface locale to dedicated protected host endpoints. Missing Harness versions remain null. After consent, the host optionally reads `deepseekAccount.getState()` and `getProfile()` for the official platform issuer and copies only account ID and nickname. It does not read platform sessions or account configuration. Missing profiles report installation data only. Account identity remains **self-reported**, not verified by DeepSeek; membership levels are unavailable.

The adapter registers one random installation identity, then sends an activation and at most one normal report per day on subsequent launches. No administrator secret or shared developer secret is shipped to clients. Collection endpoint or policy changes require fresh consent; an existing endpoint's data must be deleted before authorizing a different endpoint. Stopping sharing immediately blocks new reports and cancels the active adapter. A registration response arriving during withdrawal retains its credential long enough to delete that registration. Failed deletion retains the credential and exposes a retry action, without resuming reporting.

Protected local API routes under `/dsh-boot-studio`:

- `GET /telemetry`: public status only; no installation credentials.
- `POST /telemetry/consent`: accepts only `confirmed`, `policyVersion`, `locale` and `harnessVersion`.
- `POST /telemetry/launch`: asynchronously reports after checking the persisted consent; copies only locale and Harness version.
- `POST /telemetry/withdraw`: stops and attempts credential-authenticated deletion.

All mutations require the existing same-origin write checks. Generic `/settings` cannot authorize data collection. Network failures never block the opening animation. Profile lookup and collection requests have bounded timeouts; no raw request or identity is logged.

Validation performed locally: source lint, client/server build, existing frontend and host tests, and sharing-service tests for no-consent/no-endpoint behavior, persistence, metadata, daily limits, minimal fields, registration/withdrawal races, failed deletion retry and endpoint changes. The actual published npm 1.3.4 updater also accepted controlled future registry metadata for the candidate package, verified its bytes and staged it without installing. This does not verify a signed-in real Harness account, its UI update notification, complete media playback or macOS behavior. Separate cloud deployment checks are recorded in the deployment notes.
