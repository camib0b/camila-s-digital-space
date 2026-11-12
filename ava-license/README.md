# ava-license

Cloudflare Worker that issues AVA license tokens and suggests game metadata (home, away, date, jersey colours) for a licensed coach. `ava-checkout` already calls `POST {AVA_LICENSE_API_URL}/v1/admin/issue`. Point that secret at this Worker once it is deployed.

The token format is the one removed from `camib0b/asiatica-va` in the licensing cleanup (`license-server` at parent of `cc34b56afc`). It was not in this repo. Tokens are `AVA1.` plus the base64url JSON claims and an HMAC-SHA256 signature. Claims are serialized with sorted keys. The published test vector in `src/crypto.ts` still verifies.

This Worker does not change the AVA desktop app.

## Endpoints

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/health` | none | Liveness |
| `POST` | `/v1/admin/issue` | `Authorization: Bearer ADMIN_SECRET` | Body `{ email, days }`. Same response `ava-checkout` already requires: `{ ok, token, license.keyId }` |
| `POST` | `/v1/admin/revoke` | admin bearer | Body `{ keyId }` |
| `GET` | `/v1/admin/introspect` | admin bearer | `?keyId=` or `?email=` |
| `POST` | `/v1/trial/start` | none | Unchanged trial flow |
| `POST` | `/v1/license/activate` | none | Paid token plus email plus device |
| `POST` | `/v1/license/check` | none | Old device check. Creates a KV row if the signature is valid and the row is missing |
| `POST` | `/v1/license/verify` | license bearer, or `{ token }` | Signature plus the KV row from issue. Does not create a row and does not bind a device |
| `POST` | `/v1/ai/game-metadata` | license bearer | File names and an optional JPEG frame |

`/v1/license/check` is the old desktop call. `/v1/license/verify` and `/v1/ai/game-metadata` share `verifyIssuedLicense`: HMAC with `LICENSE_SIGNING_SECRET`, then the `license:{keyId}` record must exist, not be revoked, and not be expired.

### Game metadata

```json
{
  "file_names": ["F13 Cogs vs Old Girls 03.10.26.mp4"],
  "frame_jpeg_base64": "<optional raw base64, not a data URL>"
}
```

`fileNames` and `frameJpegBase64` are accepted too. At most 8 names, 300 characters each. The JPEG must start with `FF D8 FF` and the decoded frame must be at most 256 KiB. The whole body must be at most 400 KiB.

Response fields `home`, `away`, `date`, `home_color`, `away_color` each look like:

```json
{ "value": "COGS", "confidence": 1, "source": "tool" }
```

`source` is `tool`, `llm`, or `null` when that field was not decided. A tool date of `null` means the file name had no full date; the model is not allowed to invent one over that.

Deterministic tools run first:

- strip `Copia de` / `Copy of`, a video extension, round codes (`F3`, `F07`, `Fecha 7`), and a standalone year
- split on `vs`, `v`, or a spaced hyphen / dash
- parse dates as Chilean day-first `DD.MM.YY`, `DD.MM.YYYY`, `DD/MM/YY`, ISO `YYYY-MM-DD`, compact `YYYYMMDD`, and English or Spanish month names (`Oct 3 2026`)
- map the side onto the static team list

The xAI call uses `grok-4.20-0309-non-reasoning`, temperature `0`, `max_completion_tokens` 256, and the strict schemas `game_filename_metadata` and `game_kit_colors`, each with a `0..1` confidence per field. Invalid JSON or a timeout is retried once. Other HTTP errors are not retried.

## Teams list

carpeta.cl's D1 database has `matches.home_team` and `matches.away_team`. It has no `teams` table, so this Worker does not bind that database. Canonical names and aliases live in `src/teams.ts` (the `score.py` nickname table, including CDA = Alumni). `OG` alone maps to Old Girls.

## Rate limits

Two [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) bindings, both period 60 seconds:

| Binding | Key | Limit |
| --- | --- | --- |
| `GAME_METADATA_LICENSE_LIMIT` | license `keyId` | 20 |
| `GAME_METADATA_GLOBAL_LIMIT` | `game-metadata` | 100 |

`namespace_id` `841001` and `841002` must be unique in the Cloudflare account. Change them in `wrangler.jsonc` if they are already used. These counters are per location and approximate. A strict account-wide cap would need a Durable Object.

## AI Gateway and frames

Frames can show minors. This Worker never writes the frame to KV and never logs the request body, the license token, or `XAI_API_KEY`.

Name calls go direct to `https://api.x.ai/v1/chat/completions` until `AI_GATEWAY_BASE_URL` is set. A frame is not sent at all unless that URL is set. Set it to the gateway chat-completions URL, for example:

```text
https://gateway.ai.cloudflare.com/v1/<ACCOUNT_ID>/<GATEWAY_ID>/compat/chat/completions
```

Use a gateway that is only for AVA. On every gateway call the Worker sends `cf-aig-collect-log-payload: false`. On a call that contains an image it also sends `cf-aig-collect-log: false` and `cf-aig-skip-cache: true`, so the frame is not stored in the gateway log and is not cached.

Those headers do not control Logpush. In the dashboard, open the gateway → Settings → Logs, and turn logs off. Do not enable Logpush on this gateway. If the gateway is authenticated, set `AI_GATEWAY_TOKEN`; it is sent as `cf-aig-authorization`.

A `/compat/` URL gets the model id `xai/grok-4.20-0309-non-reasoning`. A provider-specific URL (for example `.../grok/v1/chat/completions`) is sent the bare model id.

## Secrets and config the owner sets

Do not deploy until these exist. Nothing here writes to remote D1, KV, or R2.

```bash
npx wrangler kv namespace create LICENSES
# paste the id into wrangler.jsonc kv_namespaces
npx wrangler secret put LICENSE_SIGNING_SECRET
npx wrangler secret put ADMIN_SECRET
npx wrangler secret put XAI_API_KEY
npx wrangler secret put AI_GATEWAY_TOKEN   # only if the gateway requires auth
```

`ADMIN_SECRET` is what `ava-checkout` sends as `AVA_LICENSE_ADMIN_SECRET`. `LICENSE_SIGNING_SECRET` must be a new random value in production. The string in `.dev.vars.example` is the published test vector, not a production secret.

If a license Worker is already deployed and coaches already have emailed tokens, reuse that Worker's `LICENSE_SIGNING_SECRET` and the same `LICENSES` namespace. A new secret or an empty namespace makes `verifyIssuedLicense` reject tokens whose signature is otherwise valid.

Plaintext vars in `wrangler.jsonc`: `XAI_CHAT_MODEL`, `AI_GATEWAY_BASE_URL` (empty until the gateway exists).

There is no route in `wrangler.jsonc`. Add a workers.dev or custom hostname when you deploy. Do not reuse `camilaescudero.cl/api/ava/*`.

## Local checks

```bash
npm install
npm test
npm run typecheck
npm run eval:tools
npx wrangler deploy --dry-run --outdir /tmp/ava-license-bundle
```

`npm run eval:tools` scores the deterministic tools on `eval/dataset.jsonl` with the same rates as `score.py`. It does not call xAI.
