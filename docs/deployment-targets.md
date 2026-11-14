# Deployment targets and verification scope

These services were deployed and their access boundaries checked on 2026-11-14. This document records the reported verification scope; it does not claim that a real signed-in Harness account or the owner's passkey login was completed.

- Private owner dashboard: https://dsopen-console-lewis.lewiszhouyichen.chatgpt.site
- Consent-based collector: https://dsopen-collector-lewis.lewiszhouyichen.chatgpt.site

Reported cloud checks: private console deployment succeeded with one owner, no allowed groups and no editors; anonymous and forged identity-header administrator reads returned 401. The collector's health endpoint returned 200; administrator reads without its management token returned 401; installation A's credential could neither write nor delete installation B (401). A controlled D1 sample deduplicated one account across two installations and two events; the sample was then deleted and real counts returned to zero. The owner's OpenAI login flow still requires their personal passkey verification; its completion is not claimed.

The owner dashboard URL is not an installation URL. Ordinary plugin users do not need an OpenAI account and continue to install `dsh-openup-lewis` through Harness/npm. Account identity supplied to the collector remains client-reported rather than verified by DeepSeek. Final npm approval and official registry availability are separate from GitHub publication and deployment.
