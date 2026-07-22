# Owner: create full Auth users from /owner?view=users

## What landed in this repo (PixelWave / create)

- `server/ownerUsers.mjs` — `POST /api/owner/users` (service role + admin JWT)
- `server/load-env.mjs` — loads `.env`
- `server/index.mjs` — registers the route
- `.env.example` / `server/env.example` — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

## Portal UI (copy into Desktop monorepo `ae-it-platform`)

| Source in this PR | Destination in `~/Desktop/ae-it-platform` |
|---|---|
| `apps/portal/src/components/OwnerUsersTable.tsx` | same path (replace) |
| `apps/portal/src/lib/createOwnerUser.ts` | same path (add) |
| `apps/portal/src/styles/owner-users-create.css` | import from `owner-dashboard.css` or `OwnerUsersTable` |
| `apps/portal/vite.config.ts` | merge `/api` proxy |
| `infra/nginx-portal-api-owner-users.conf` | merge `location /api/` into portal server |
| `apps/create/server/ownerUsers.mjs` | `apps/create/server/` + register in `index.mjs` |

### OwnerDashboardPage.tsx

```tsx
function handleUserCreated(user: OwnerUserRow) {
  setUsers((current) => [user, ...current.filter((row) => row.id !== user.id)])
  setLoadError(null)
}

<OwnerUsersTable
  users={users}
  onUserUpdated={handleUserUpdated}
  onUserCreated={handleUserCreated}
  onError={(message) => setLoadError(message)}
/>
```

Import CSS once:

```ts
import '@/styles/owner-users-create.css'
```

## Local run

```bash
# in create (.env with SERVICE_ROLE)
npm run dev:api

# in portal (proxy /api → :3001)
npm run dev
```

Open `http://localhost:5174/owner?view=users` → **Добавить пользователя**.

## VPS

1. Put `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_URL` in `/etc/pixelwave-api.env`
2. Deploy updated `server/ownerUsers.mjs` to `/opt/pixelwave-api/server/` (or flat layout)
3. `systemctl restart pixelwave-api`
4. Add portal nginx `location /api/` → `127.0.0.1:3001` and reload nginx
