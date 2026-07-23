#!/usr/bin/env bash
# Diagnose + fix owner users 404 (create/delete) on Mac monorepo.
set -euo pipefail

DEST="${DEST:-$HOME/Desktop/ae-it-platform}"
SRC="${SRC:-$HOME/Projects/webcalc-pro}"

echo "=== A) Прямой API :3001 ==="
CODE3001_POST=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:3001/api/owner/users || true)
CODE3001_DEL=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://127.0.0.1:3001/api/owner/users/x || true)
echo "POST  /api/owner/users     -> $CODE3001_POST"
echo "DELETE /api/owner/users/x  -> $CODE3001_DEL"

echo
echo "=== B) Через portal :5174 ==="
CODE5174_POST=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:5174/api/owner/users || true)
CODE5174_DEL=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://127.0.0.1:5174/api/owner/users/x || true)
echo "POST  /api/owner/users     -> $CODE5174_POST"
echo "DELETE /api/owner/users/x  -> $CODE5174_DEL"

echo
echo "=== C) Файлы ==="
INDEX="$DEST/apps/create/server/index.mjs"
OWNERS="$DEST/apps/create/server/ownerUsers.mjs"
VITE="$DEST/apps/portal/vite.config.ts"

echo -n "ownerUsers.mjs exists: "; [[ -f "$OWNERS" ]] && echo yes || echo NO
echo -n "app.post owner users: "; grep -q "app.post('/api/owner/users'" "$OWNERS" 2>/dev/null && echo yes || echo NO
echo -n "app.delete owner users: "; grep -q "app.delete('/api/owner/users/:id'" "$OWNERS" 2>/dev/null && echo yes || echo NO
echo -n "registerOwnerUserRoutes import: "; grep -q "registerOwnerUserRoutes" "$INDEX" 2>/dev/null && echo yes || echo NO
echo -n "vite /api proxy: "; grep -Eq "['\"]/api['\"]" "$VITE" 2>/dev/null && echo yes || echo NO

echo
echo "=== D) Автопочинка файлов ==="

# Refresh ownerUsers from branch if SRC available
if [[ -f "$SRC/apps/create/server/ownerUsers.mjs" ]]; then
  cp -v "$SRC/apps/create/server/ownerUsers.mjs" "$OWNERS"
elif [[ -f "$SRC/server/ownerUsers.mjs" ]]; then
  cp -v "$SRC/server/ownerUsers.mjs" "$OWNERS"
else
  echo "! SRC ownerUsers не найден — оставляем текущий $OWNERS"
fi

# Ensure register in index.mjs
if [[ -f "$INDEX" ]]; then
  if ! grep -q "registerOwnerUserRoutes" "$INDEX"; then
    python3 - "$INDEX" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
text = p.read_text()
imp = "import { registerOwnerUserRoutes } from './ownerUsers.mjs'\n"
if "import './load-env.mjs'" in text:
    text = text.replace("import './load-env.mjs'\n", "import './load-env.mjs'\n" + imp, 1)
else:
    text = imp + text
marker = "app.use(express.json"
i = text.find(marker)
if i != -1:
    j = text.find("\n", i)
    text = text[: j + 1] + "\nregisterOwnerUserRoutes(app)\n" + text[j + 1 :]
else:
    text += "\nregisterOwnerUserRoutes(app)\n"
p.write_text(text)
print("• Подключён registerOwnerUserRoutes")
PY
  else
    echo "• registerOwnerUserRoutes уже есть"
  fi
else
  echo "✗ Нет $INDEX"
fi

# Ensure vite proxy
if [[ -f "$VITE" ]] && ! grep -Eq "['\"]/api['\"]" "$VITE"; then
  python3 - "$VITE" <<'PY'
from pathlib import Path
import sys, re
p = Path(sys.argv[1])
text = p.read_text()
proxy_block = """
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
"""
# Insert inside proxy: { ... }
m = re.search(r"proxy:\s*\{", text)
if not m:
    print("! Не найден server.proxy в vite.config.ts — добавьте /api вручную")
    raise SystemExit(0)
# after proxy: {
insert_at = m.end()
text = text[:insert_at] + proxy_block + text[insert_at:]
p.write_text(text)
print("• Добавлен vite proxy /api → 3001")
PY
else
  echo "• vite /api proxy OK или файл отсутствует"
fi

echo
echo "=== E) Перезапуск (выполните сами) ==="
cat <<EOF
lsof -ti :3001 | xargs kill -9 2>/dev/null; true
lsof -ti :5174 | xargs kill -9 2>/dev/null; true

cd $DEST/apps/create && npm run dev:api
# другое окно:
cd $DEST && npm run dev:portal

# проверки:
curl -s -o /dev/null -w "%{http_code}\\n" -X POST http://127.0.0.1:3001/api/owner/users
curl -s -o /dev/null -w "%{http_code}\\n" -X DELETE http://127.0.0.1:3001/api/owner/users/x
curl -s -o /dev/null -w "%{http_code}\\n" -X POST http://127.0.0.1:5174/api/owner/users
EOF

echo
echo "Ожидание: 401/503 на всех (не 000, не 404)."
