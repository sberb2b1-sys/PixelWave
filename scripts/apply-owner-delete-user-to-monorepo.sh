#!/usr/bin/env bash
set -euo pipefail
SRC="${SRC:-$(cd "$(dirname "$0")/.." && pwd)}"
DEST="${DEST:-$HOME/Desktop/ae-it-platform}"

cp -v "$SRC/apps/create/server/ownerUsers.mjs" "$DEST/apps/create/server/ownerUsers.mjs"
cp -v "$SRC/apps/portal/src/components/OwnerUsersTable.tsx" "$DEST/apps/portal/src/components/OwnerUsersTable.tsx"
cp -v "$SRC/apps/portal/src/styles/owner-users-create.css" "$DEST/apps/portal/src/styles/owner-users-create.css"

API="$DEST/apps/portal/src/lib/ownerDashboardApi.ts"
PARTIAL_SRC="$SRC/apps/portal/src/lib/ownerDashboardApi.ts"
if grep -q 'export async function deleteOwnerUser' "$API" 2>/dev/null; then
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
    raise SystemExit("deleteOwnerUser not found in source")
fn = m.group(0).strip() + "\n"
if "from '@/lib/supabase'" not in api and 'from "@/lib/supabase"' not in api:
    api = "import { supabase } from '@/lib/supabase'\n" + api
api_path.write_text(api.rstrip() + "\n\n" + fn)
print("• Добавлен deleteOwnerUser")
PY
fi

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
    if "function handleUserCreated" in text:
        end = text.find("\n  }\n", text.find("function handleUserCreated"))
        if end != -1:
            end = end + len("\n  }\n")
            text = text[:end] + handler + text[end:]
            changed = True
            print("• handleUserDeleted")
if "onUserDeleted=" not in text and "onUserCreated={handleUserCreated}" in text:
    text = text.replace(
        "onUserCreated={handleUserCreated}",
        "onUserCreated={handleUserCreated}\n          onUserDeleted={handleUserDeleted}",
        1,
    )
    changed = True
    print("• onUserDeleted prop")
if changed:
    p.write_text(text)
else:
    print("• OwnerDashboardPage уже с delete")
PY

echo "✓ Готово. Перезапустите API и portal."
