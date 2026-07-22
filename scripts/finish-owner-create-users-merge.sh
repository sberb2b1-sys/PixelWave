#!/usr/bin/env bash
# Finish manual merge after apply-owner-create-users-to-monorepo.sh
# Run on Mac:
#   bash ~/Desktop/ae-it-platform/scripts/finish-owner-create-users-merge.sh
# or copy-paste the body into terminal from ae-it-platform root.

set -euo pipefail
DEST="${DEST:-$HOME/Desktop/ae-it-platform}"
cd "$DEST"

API="$DEST/apps/portal/src/lib/ownerDashboardApi.ts"
PARTIAL="$DEST/apps/portal/src/lib/ownerDashboardApi.createUser.partial.ts"
PAGE="$DEST/apps/portal/src/pages/OwnerDashboardPage.tsx"
CSS_IMPORT="import '@/styles/owner-users-create.css'"

if [[ ! -f "$API" ]]; then
  echo "✗ Нет $API"
  exit 1
fi

# 1) Merge createOwnerUser into ownerDashboardApi.ts
if grep -q 'export async function createOwnerUser' "$API"; then
  echo "• createOwnerUser уже есть в ownerDashboardApi.ts"
else
  if [[ ! -f "$PARTIAL" ]]; then
    echo "✗ Нет partial: $PARTIAL"
    exit 1
  fi
  # Append createOwnerUser + related types from partial if missing
  python3 <<'PY'
from pathlib import Path
import re, os
dest = Path(os.environ.get("DEST", Path.home() / "Desktop/ae-it-platform"))
api = (dest / "apps/portal/src/lib/ownerDashboardApi.ts").read_text()
partial = (dest / "apps/portal/src/lib/ownerDashboardApi.createUser.partial.ts").read_text()

# Extract CreateOwnerUser* types and createOwnerUser function from partial
chunks = []
for name in ("CreateOwnerUserInput", "CreateOwnerUserResult"):
    m = re.search(rf"export type {name} = \{{.*?\n\}}", partial, re.S)
    if m and name not in api:
        chunks.append(m.group(0))

m = re.search(r"/\*\* Creates a full Supabase Auth account.*?^export async function createOwnerUser\(.*?\n\}\n", partial, re.S | re.M)
if not m:
    m = re.search(r"export async function createOwnerUser\(.*?\n\}\n", partial, re.S | re.M)
if m and "export async function createOwnerUser" not in api:
    chunks.append(m.group(0).strip() + "\n")

if not chunks:
    print("• Нечего добавлять (уже есть или partial пустой)")
else:
    addition = "\n\n" + "\n\n".join(chunks)
    # Ensure supabase import exists for createOwnerUser
    if "from '@/lib/supabase'" not in api and "from \"@/lib/supabase\"" not in api:
        api = "import { supabase } from '@/lib/supabase'\n" + api
    (dest / "apps/portal/src/lib/ownerDashboardApi.ts").write_text(api.rstrip() + addition + "\n")
    print("• Добавлен createOwnerUser (+ типы) в ownerDashboardApi.ts")
PY
fi

# 2) Patch OwnerDashboardPage.tsx
if [[ ! -f "$PAGE" ]]; then
  echo "✗ Нет $PAGE"
  exit 1
fi

python3 <<'PY'
from pathlib import Path
import os, re
page_path = Path(os.environ.get("DEST", Path.home() / "Desktop/ae-it-platform")) / "apps/portal/src/pages/OwnerDashboardPage.tsx"
text = page_path.read_text()
changed = False

if "owner-users-create.css" not in text:
    # after last import
    lines = text.splitlines(keepends=True)
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith("import "):
            last_import = i
    lines.insert(last_import + 1, "import '@/styles/owner-users-create.css'\n")
    text = "".join(lines)
    changed = True
    print("• Добавлен import owner-users-create.css")

if "handleUserCreated" not in text:
    # insert after handleUserUpdated if present, else before return
    handler = '''
  function handleUserCreated(user: OwnerUserRow) {
    setUsers((current) => [user, ...current.filter((row) => row.id !== user.id)])
    setLoadError(null)
  }

'''
    if "function handleUserUpdated" in text:
        text = re.sub(
            r"(function handleUserUpdated\([\s\S]*?\n  \}\n)",
            r"\1" + handler,
            text,
            count=1,
        )
    else:
        text = text.replace("\n  return (", handler + "\n  return (", 1)
    changed = True
    print("• Добавлен handleUserCreated")

# Ensure OwnerUserRow import if we added handler
if "handleUserCreated" in text and "OwnerUserRow" not in text.split("from '@/lib/ownerDashboardApi'")[0]:
    text2 = text
    if "from '@/lib/ownerDashboardApi'" in text:
        text = re.sub(
            r"import \{([^}]+)\} from '@/lib/ownerDashboardApi'",
            lambda m: ("import {" + m.group(1).rstrip() + (", type OwnerUserRow" if "OwnerUserRow" not in m.group(1) else "") + "} from '@/lib/ownerDashboardApi'")
            if "OwnerUserRow" not in m.group(1) else m.group(0),
            text,
            count=1,
        )
        if text != text2:
            changed = True
            print("• Добавлен тип OwnerUserRow в import")

if "onUserCreated=" not in text:
    if "<OwnerUsersTable" in text:
        text = re.sub(
            r"(<OwnerUsersTable\b[^>]*?)(/>|>)",
            lambda m: m.group(1).rstrip() + "\n              onUserCreated={handleUserCreated}\n            " + (m.group(2) if m.group(2) == "/>" else ">"),
            text,
            count=1,
            flags=re.S,
        )
        # simpler replacement if multiline component
        if "onUserCreated=" not in text:
            text = text.replace(
                "onUserUpdated={handleUserUpdated}",
                "onUserUpdated={handleUserUpdated}\n              onUserCreated={handleUserCreated}",
                1,
            )
        changed = True
        print("• Добавлен prop onUserCreated={handleUserCreated}")
    else:
        print("! OwnerUsersTable не найден в странице — добавьте onUserCreated вручную")

if changed:
    page_path.write_text(text)
    print(f"• Сохранён {page_path}")
else:
    print("• OwnerDashboardPage.tsx уже настроен")
PY

# 3) Env keys
ENV_FILE="$DEST/apps/create/.env"
if [[ -f "$ENV_FILE" ]]; then
  touch "$ENV_FILE"
  grep -q '^SUPABASE_URL=' "$ENV_FILE" || echo 'SUPABASE_URL=' >> "$ENV_FILE"
  grep -q '^SUPABASE_SERVICE_ROLE_KEY=' "$ENV_FILE" || echo 'SUPABASE_SERVICE_ROLE_KEY=' >> "$ENV_FILE"
  echo "• Проверьте значения в $ENV_FILE (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)"
else
  echo "! Нет $ENV_FILE — создайте из .env.example и добавьте SERVICE_ROLE_KEY"
fi

# 4) Vite proxy check
VITE="$DEST/apps/portal/vite.config.ts"
if [[ -f "$VITE" ]] && ! grep -Eq "['\"]/api['\"]" "$VITE"; then
  echo "! Добавьте proxy /api в $VITE → http://127.0.0.1:3001"
else
  echo "• Vite /api proxy OK (или файл отсутствует)"
fi

echo
echo "✓ Merge-шаги выполнены."
echo "Запуск API:"
echo "  cd $DEST && npm run dev:api"
echo "Portal (другой терминал):"
echo "  cd $DEST && npm run dev:portal"
echo "Откройте: http://localhost:5174/owner?view=users"
