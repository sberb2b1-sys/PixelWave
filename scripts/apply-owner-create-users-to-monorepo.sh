#!/usr/bin/env bash
# Copy owner-create-users overlay into ~/Desktop/ae-it-platform
#
# На Mac:
#   cd ~/Projects/webcalc-pro   # или клон PixelWave с веткой cursor/owner-create-users-859c
#   bash scripts/apply-owner-create-users-to-monorepo.sh
#
# Или одной строкой:
#   SRC=~/Projects/webcalc-pro DEST=~/Desktop/ae-it-platform bash "$SRC/scripts/apply-owner-create-users-to-monorepo.sh"

set -euo pipefail

SRC="${SRC:-$(cd "$(dirname "$0")/.." && pwd)}"
DEST="${DEST:-$HOME/Desktop/ae-it-platform}"

echo "SRC=$SRC"
echo "DEST=$DEST"

if [[ ! -d "$DEST/apps/portal" || ! -d "$DEST/apps/create" ]]; then
  echo "✗ Нет монорепо $DEST (ожидаются apps/portal и apps/create)"
  exit 1
fi

if [[ ! -f "$SRC/apps/portal/src/components/OwnerUsersTable.tsx" ]]; then
  echo "✗ В $SRC нет overlay. Сначала:"
  echo "    git fetch origin cursor/owner-create-users-859c"
  echo "    git checkout cursor/owner-create-users-859c"
  exit 1
fi

mkdir -p \
  "$DEST/apps/create/server" \
  "$DEST/apps/portal/src/components" \
  "$DEST/apps/portal/src/lib" \
  "$DEST/apps/portal/src/pages" \
  "$DEST/apps/portal/src/styles" \
  "$DEST/infra" \
  "$DEST/docs"

# API
cp -v "$SRC/apps/create/server/ownerUsers.mjs" "$DEST/apps/create/server/ownerUsers.mjs"
cp -v "$SRC/apps/create/server/load-env.mjs" "$DEST/apps/create/server/load-env.mjs"
[[ -f "$SRC/server/ownerUsers.mjs" ]] && cp -v "$SRC/server/ownerUsers.mjs" "$DEST/apps/create/server/ownerUsers.mjs"

# Portal UI
cp -v "$SRC/apps/portal/src/components/OwnerUsersTable.tsx" \
  "$DEST/apps/portal/src/components/OwnerUsersTable.tsx"
cp -v "$SRC/apps/portal/src/styles/owner-users-create.css" \
  "$DEST/apps/portal/src/styles/owner-users-create.css"
cp -v "$SRC/apps/portal/src/pages/OwnerDashboardPage.tsx" \
  "$DEST/apps/portal/src/pages/OwnerDashboardPage.users-ref.tsx"
cp -v "$SRC/apps/portal/src/lib/ownerDashboardApi.ts" \
  "$DEST/apps/portal/src/lib/ownerDashboardApi.createUser.partial.ts"

# Docs / nginx
cp -v "$SRC/docs/owner-create-users.md" "$DEST/docs/owner-create-users.md"
cp -v "$SRC/infra/nginx-ae-it-portal-api.snippet.conf" \
  "$DEST/infra/nginx-ae-it-portal-api.snippet.conf"
[[ -f "$SRC/apps/create/.env.example" ]] && cp -v "$SRC/apps/create/.env.example" "$DEST/apps/create/.env.example"

# Register route in create server index
CREATE_INDEX="$DEST/apps/create/server/index.mjs"
if [[ -f "$CREATE_INDEX" ]]; then
  if grep -q 'registerOwnerUserRoutes' "$CREATE_INDEX"; then
    echo "• registerOwnerUserRoutes уже есть в index.mjs"
  else
    DEST="$DEST" python3 <<'PY'
from pathlib import Path
import os
p = Path(os.environ["DEST"]) / "apps/create/server/index.mjs"
text = p.read_text()
imp = "import { registerOwnerUserRoutes } from './ownerUsers.mjs'\n"
if "import './load-env.mjs'" in text:
    text = text.replace("import './load-env.mjs'\n", "import './load-env.mjs'\n" + imp, 1)
else:
    text = "import './load-env.mjs'\n" + imp + text
marker = "app.use(express.json"
i = text.find(marker)
if i != -1:
    j = text.find("\n", i)
    text = text[: j + 1] + "\nregisterOwnerUserRoutes(app)\n" + text[j + 1 :]
else:
    text += "\nregisterOwnerUserRoutes(app)\n"
p.write_text(text)
print(f"• Подключён registerOwnerUserRoutes → {p}")
PY
  fi
else
  echo "! Нет $CREATE_INDEX — добавьте registerOwnerUserRoutes вручную"
fi

# Vite /api proxy hint
VITE="$DEST/apps/portal/vite.config.ts"
if [[ -f "$VITE" ]] && ! grep -Eq "['\"]/api['\"]" "$VITE"; then
  echo
  echo "! В $VITE добавьте в server.proxy:"
  cat <<'EOF'
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
EOF
fi

echo
echo "✓ Готово."
echo
echo "Ручные шаги в монорепо:"
echo "  1) В apps/portal/src/lib/ownerDashboardApi.ts добавьте createOwnerUser"
echo "     из ownerDashboardApi.createUser.partial.ts (или смержите файл)"
echo "  2) В OwnerDashboardPage.tsx:"
echo "       onUserCreated={handleUserCreated}"
echo "       import '@/styles/owner-users-create.css'"
echo "  3) В apps/create/.env:"
echo "       SUPABASE_URL=..."
echo "       SUPABASE_SERVICE_ROLE_KEY=..."
echo "  4) cd $DEST && npm run dev:api"
echo
echo "Справка: $DEST/docs/owner-create-users.md"
