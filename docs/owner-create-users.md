# Owner: create full Auth users from /owner?view=users

## Create API

- `server/ownerUsers.mjs` and `apps/create/server/ownerUsers.mjs`
- `POST /api/owner/users` — Bearer JWT of `profiles.is_admin`
- Env: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Registered in `server/index.mjs` (PixelWave) and `apps/create/server/index.mjs`

Body: `{ fullName, email, phone?, password?, isAdmin? }`  
Response: `{ user, passwordOnce, passwordGenerated }`

## Portal

| File | Role |
|------|------|
| `apps/portal/src/lib/ownerDashboardApi.ts` | `createOwnerUser`, `fetchOwnerUsers`, `updateOwnerUser` |
| `apps/portal/src/components/OwnerUsersTable.tsx` | «Добавить пользователя» modal |
| `apps/portal/src/pages/OwnerDashboardPage.tsx` | wires `onUserCreated` |
| `apps/portal/vite.config.ts` | proxy `/api` → `127.0.0.1:3001` |
| `apps/portal/src/styles/owner-users-create.css` | toolbar + password reveal |

Merge into `~/Desktop/ae-it-platform`: copy these files (or merge `createOwnerUser` + table/page props into existing portal sources).

## Nginx (prod portal)

See `infra/nginx-ae-it-portal-api.snippet.conf` — add `location /api/` → `127.0.0.1:3001` on `ae-it.ru`.

## Dev

```bash
# API
cp .env.example .env   # set SUPABASE_SERVICE_ROLE_KEY
npm run dev:api

# or monorepo-style
npm run dev:api --prefix apps/create
```

Portal needs `/api` proxied (vite.config) and session of an `is_admin` user.

## VPS

1. `/etc/pixelwave-api.env` → `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
2. Deploy `ownerUsers.mjs`, restart `pixelwave-api`
3. Portal nginx `/api/` + reload
