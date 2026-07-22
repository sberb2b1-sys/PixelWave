#!/usr/bin/env bash
# Fix delete-user wiring in Desktop monorepo (run on Mac).
set -euo pipefail
DEST="${DEST:-$HOME/Desktop/ae-it-platform}"
SRC="${SRC:-$HOME/Projects/webcalc-pro}"

echo "=== 1) Обновляем файлы из ветки ==="
cd "$SRC"
git fetch origin cursor/owner-create-users-859c
git checkout cursor/owner-create-users-859c
git pull origin cursor/owner-create-users-859c

cp -v "$SRC/apps/create/server/ownerUsers.mjs" "$DEST/apps/create/server/ownerUsers.mjs"
cp -v "$SRC/apps/portal/src/components/OwnerUsersTable.tsx" "$DEST/apps/portal/src/components/OwnerUsersTable.tsx"
cp -v "$SRC/apps/portal/src/styles/owner-users-create.css" "$DEST/apps/portal/src/styles/owner-users-create.css"

echo
echo "=== 2) deleteOwnerUser в API ==="
API="$DEST/apps/portal/src/lib/ownerDashboardApi.ts"
PARTIAL_SRC="$SRC/apps/portal/src/lib/ownerDashboardApi.ts"
if grep -q 'export async function deleteOwnerUser' "$API"; then
  echo "• deleteOwnerUser уже есть"
else
  python3 - "$API" "$PARTIAL_SRC" <<'PY'
import re, sys
from pathlib import Path
api_path, src_path = Path(sys.argv[1]), Path(sys.argv[2])
api = api_path.read_text()
src = src_path.read_text()
m = re.search(r"export async function deleteOwnerUser\([\s\S]*?\n\}\n", src)
if not m:
    raise SystemExit("deleteOwnerUser not found")
fn = m.group(0).strip() + "\n"
if "from '@/lib/supabase'" not in api and 'from "@/lib/supabase"' not in api:
    api = "import { supabase } from '@/lib/supabase'\n" + api
api_path.write_text(api.rstrip() + "\n\n" + fn)
print("• Добавлен deleteOwnerUser")
PY
fi

echo
echo "=== 3) OwnerDashboardPage props ==="
PAGE="$DEST/apps/portal/src/pages/OwnerDashboardPage.tsx"
python3 - "$PAGE" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
text = p.read_text()
changed = False
if "handleUserDeleted" not in text:
    handler = """
  function handleUserDeleted(userId: string) {
    setUsers((current) => current.filter((row) => row.id !== userId))
    setLoadError(null)
  }

"""
    anchor = text.find("function handleUserCreated")
    if anchor != -1:
        end = text.find("\n  }\n", anchor)
        if end != -1:
            end += len("\n  }\n")
            text = text[:end] + handler + text[end:]
            changed = True
            print("• handleUserDeleted")
    else:
        text = text.replace("\n  return (", handler + "\n  return (", 1)
        changed = True
        print("• handleUserDeleted (перед return)")

if "onUserDeleted=" not in text:
    if "onUserCreated={handleUserCreated}" in text:
        text = text.replace(
            "onUserCreated={handleUserCreated}",
            "onUserCreated={handleUserCreated}\n              onUserDeleted={handleUserDeleted}",
            1,
        )
        changed = True
        print("• onUserDeleted prop")
    elif "<OwnerUsersTable" in text:
        text = text.replace(
            "<OwnerUsersTable",
            "<OwnerUsersTable\n              onUserDeleted={handleUserDeleted}",
            1,
        )
        changed = True
        print("• onUserDeleted prop (fallback)")
    else:
        print("! OwnerUsersTable не найден")

if "owner-users-create.css" not in text:
    lines = text.splitlines(keepends=True)
    last = max((i for i, l in enumerate(lines) if l.startswith("import ")), default=0)
    lines.insert(last + 1, "import '@/styles/owner-users-create.css'\n")
    text = "".join(lines)
    changed = True
    print("• CSS import")

if changed:
    p.write_text(text)
    print("• Страница сохранена")
else:
    print("• Страница уже ок")
PY

echo
echo "=== 4) Проверка ==="
grep -n "Удалить\|deletingUser\|deleteOwnerUser\|onUserDeleted" \
  "$DEST/apps/portal/src/components/OwnerUsersTable.tsx" \
  "$DEST/apps/portal/src/lib/ownerDashboardApi.ts" \
  "$DEST/apps/portal/src/pages/OwnerDashboardPage.tsx" | head -40

echo
echo "=== 5) Перезапуск portal (убейте старый 5174) ==="
echo "Выполните:"
echo "  lsof -ti :5174 | xargs kill -9 2>/dev/null; true"
echo "  lsof -ti :3001 | xargs kill -9 2>/dev/null; true"
echo "  cd $DEST/apps/create && npm run dev:api"
echo "  cd $DEST && npm run dev:portal"
echo "  Cmd+Shift+R в браузере на http://localhost:5174/owner?view=users"
