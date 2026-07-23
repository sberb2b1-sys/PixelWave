#!/usr/bin/env bash
# Focus AE-IT portal on Create + auth/cabinet; hide Lab, Games, unfinished Studio.
# Run on Mac:
#   bash ~/Projects/webcalc-pro/scripts/focus-create-hide-lab-games-studio.sh
# or from this repo after git pull.

set -euo pipefail
DEST="${DEST:-$HOME/Desktop/ae-it-platform}"
cd "$DEST"

echo "DEST=$DEST"

python3 <<'PY'
from pathlib import Path
import re

root = Path.home() / "Desktop/ae-it-platform"
changed = []

def write(path: Path, text: str, label: str):
    path.write_text(text)
    changed.append(label)

# --- 1) portal-links / platform URLs: mark studio unavailable ---
for rel in [
    "apps/portal/src/portal-links.ts",
    "apps/portal/src/lib/platformUrls.ts",
    "apps/create/src/lib/platformUrls.ts",
]:
    p = root / rel
    if not p.exists():
        continue
    text = p.read_text()
    orig = text
    # Prefer feature flags if file already has structure
    if "studioEnabled" not in text and "STUDIO" not in text:
        if "export const PORTAL_LINKS" in text or "portalLinks" in text or "PLATFORM" in text or "studio:" in text:
            text = "/** Studio temporarily unavailable while in development. */\nexport const STUDIO_ENABLED = false\nexport const LAB_ENABLED = false\nexport const GAMES_ENABLED = false\n\n" + text
    if text != orig:
        write(p, text, rel)

# --- 2) Owner / portal home service cards: drop lab/games, disable studio ---
# Common patterns in OwnerDashboardPage and portal home
for rel in [
    "apps/portal/src/pages/OwnerDashboardPage.tsx",
    "apps/portal/src/pages/PortalHomePage.tsx",
    "apps/portal/src/pages/HomePage.tsx",
    "apps/portal/src/components/PortalServices.tsx",
    "apps/portal/src/components/owner/OwnerAnalyticsPanel.tsx",
]:
    p = root / rel
    if not p.exists():
        continue
    text = p.read_text()
    orig = text
    # Soft-hide by commenting service host strings in JSX is fragile; prefer data filters below
    text = text.replace("AE Lab", "AE Create")  # avoid accidental leftover labels in copy — careful
    # Revert accidental if we broke "AE Create" doubling — skip aggressive replace
    text = orig  # revert; do surgical edits only

    # Remove lab/games from service arrays if present as object literals with id/host
    def strip_services(src: str) -> str:
        # Remove blocks that mention lab.ae-it / games / AE Lab / AE Games as standalone cards
        patterns = [
            r"\{[^{}]*?(?:lab\.ae-it|AE Lab|ae-lab|requestType:\s*'lab')[^{}]*?\},?\n",
            r"\{[^{}]*?(?:games\.ae-it|AE Games|ae-games)[^{}]*?\},?\n",
        ]
        out = src
        for pat in patterns:
            out = re.sub(pat, "", out, flags=re.I)
        return out

    text = strip_services(text)

    # Studio: add "Скоро" / disabled if tile present
    if "studio.ae-it" in text.lower() or "AE Studio" in text:
        text = text.replace(">AE Studio<", ">AE Studio (скоро)<")
        text = text.replace(">Studio<", ">Studio (скоро)<")

    if text != orig:
        write(p, text, rel)

# --- 3) ownerDashboardApi: only create requests (no lab merge) ---
api = root / "apps/portal/src/lib/ownerDashboardApi.ts"
if api.exists():
    text = api.read_text()
    orig = text
    # Stop merging MOCK_LAB_ORDERS into requests if present
    if "MOCK_LAB_ORDERS" in text:
        text = re.sub(
            r"const labRows = MOCK_LAB_ORDERS[\s\S]*?map\([\s\S]*?\n",
            "const labRows: OwnerRequestRow[] = []\n",
            text,
            count=1,
        )
        # Simpler: return only createRows
        text = re.sub(
            r"return \[\.\.\.createRows,\s*\.\.\.labRows\]\.sort\(",
            "return [...createRows].sort(",
            text,
        )
        text = re.sub(
            r"return \[\.\.\.createRows, \.\.\.labRows\]\.sort\(",
            "return [...createRows].sort(",
            text,
        )
    # Narrow service labels
    if "OWNER_SERVICE_LABELS" in text:
        text = re.sub(
            r"export const OWNER_SERVICE_LABELS[\s\S]*?\n\}",
            """export const OWNER_SERVICE_LABELS: Record<string, string> = {
  create: 'AE Create',
  studio: 'AE Studio',
  platform: 'AE IT',
}""",
            text,
            count=1,
        )
    if text != orig:
        write(api, text, "apps/portal/src/lib/ownerDashboardApi.ts")

# --- 4) Subscriptions mock: drop lab/games payments ---
sub = root / "apps/portal/src/lib/owner/mockSubscriptionPayments.ts"
if sub.exists():
    text = sub.read_text()
    orig = text
    # Filter array entries with service: 'lab' | 'games'
    text = re.sub(r"\{[^{}]*service:\s*'(?:lab|games)'[^{}]*\},?\n", "", text)
    if text != orig:
        write(sub, text, "apps/portal/src/lib/owner/mockSubscriptionPayments.ts")

# --- 5) CSS/copy note file ---
note = root / "docs/product-focus-create.md"
note.write_text("""# Product focus (temporary)

## Positioning
- **DIY:** multi-agent system on subscription — user can do everything themselves.
- **Human:** option to contact a specialist to do the work for you.

## Live now
- Auth (login / register / session)
- Personal cabinet
- **AE Create** — calculator, questionnaire, leads

## Hidden / paused
- **AE Lab** — removed from UI
- **AE Games** — removed from UI
- **AE Studio** — shown as unavailable / «скоро» (not linked to production)

## Owner panel
- Requests: Create leads only (no Lab mock orders)
- Subscriptions: no Lab/Games mock rows
""")
changed.append("docs/product-focus-create.md")

print("Changed:")
for c in changed:
    print(" ", c)
if not changed:
    print(" (no automatic edits matched — check file paths)")
PY

echo
echo "✓ Готово. Проверьте portal:"
echo "  cd $DEST && npm run dev:portal"
echo "  http://localhost:5174/"
echo
echo "Create (калькулятор/кабинет):"
echo "  cd $DEST && npm run dev:create"
echo "  http://127.0.0.1:5173/"
