# Knack Write Endpoints Plan (CRUD)

This plan outlines adding safe, validated write endpoints to our Next.js API layer that talk to Knack. We will support create/update/delete for key resources, perform input validation, map fields to Knack, and invalidate caches.

## Principles
- Validate every request payload (recommend zod) and reject with 400 on invalid input.
- Authorize writes server-side (header token or session check; start with a shared secret env `WRITE_API_TOKEN`).
- Strictly map public DTO fields → Knack field IDs; never pass-through raw client fields.
- Invalidate caches using `invalidateCache(cacheKeys.*)` after successful mutation.
- Return normalized JSON with minimal sensitive data.

## Security and Env
- Add to `.env.local`:
  - `WRITE_API_TOKEN="<set a long random token>"`
- All write routes require header: `Authorization: Bearer <WRITE_API_TOKEN>`

Helper (shared): `src/lib/knack/write-utils.ts`
- `requireAuth(req: Request)` → throws 401 if missing/invalid
- `mapDevicePayload(dto)` → returns `{ field_56: ..., field_100: ... }`
- `mapDonationPayload(dto)` and `mapPartnerPayload(dto)` similarly
- `safeKnack(fn)` wrapper with retries/backoff (reuse `retryWithBackoff`)

## Devices
File: `src/app/api/devices/route.ts`
- Methods:
  - POST `/api/devices` → create device
  - PUT `/api/devices` → update by `id`
  - DELETE `/api/devices` → delete by `id`

DTOs (examples):
- POST body: `{ type: 'Laptop'|'Desktop', status: 'Donated'|'Received'|'Ready'|'Completed-Presented', serial?: string, orgId?: string }`
- PUT body: `{ id: string, status?: string, serial?: string }`
- DELETE body: `{ id: string }`

Implementation notes:
- Map to Knack object: `process.env.KNACK_DEVICES_OBJECT || 'object_7'`
- Use client: `const knack = getKnackClient()`
- Create: `knack.createRecord(objectKey, mapped)`
- Update: `knack.updateRecord(objectKey, id, mapped)`
- Delete: `knack.deleteRecord(objectKey, id)`
- After success: `invalidateCache(cacheKeys.devices)` and any paginated keys if possible

## Donations
File: `src/app/api/donations/route.ts`
- Methods: POST, PUT, DELETE as above; fields include donor contact, pickup address, status.
- Cache invalidation: `cacheKeys.activity`, `cacheKeys.donations`.

## Partners
File: `src/app/api/partners/route.ts`
- Methods: POST (new org), PUT (update fields), DELETE (rare)
- After mutations: invalidate `cacheKeys.partners` and `cacheKeys.organizations`.

## Validation (zod)
- Add dependency: `npm i zod`
- Example:
```ts
import { z } from 'zod'
const deviceCreateSchema = z.object({
  type: z.enum(['Laptop','Desktop']),
  status: z.string(),
  serial: z.string().optional(),
  orgId: z.string().optional(),
})
```

## Response shape
- Always return `{ ok: true, id, data }` on success.
- Error responses: `{ ok: false, error: 'message' }` + proper HTTP status.

## Cache strategy
- Keep read endpoints public with `s-maxage` headers.
- On any mutation, immediately invalidate related caches so subsequent reads are fresh.

## Rollout steps
1) Add `write-utils.ts` with `requireAuth`, mappers, and helpers.
2) Implement devices route methods; test end-to-end against Knack sandbox data.
3) Implement donations, then partners.
4) Add light admin UI (forms) with optimistic updates using React Query `onMutate/onSettled`.

## Testing
- Unit: mapper functions (DTO→Knack fields) with sample inputs.
- Integration: mock fetch to Knack or use a test app with limited permissions.
- Smoke: curl requests with Authorization header.
