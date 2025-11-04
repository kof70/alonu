#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://51.75.162.85:8080/artisanat_v8/api}}"
TOKEN="${TOKEN:-}"
TERM="${1:-}" # mot clef de recherche optionnel

hdr(){ echo "Authorization: Bearer $TOKEN"; }

echo "== QA Artisans =="

curl -fsS "$BASE_URL/artisans_pages/1" -H "$(hdr)" -o /dev/null -w "pages: %{http_code}\n"
if [[ -n "$TERM" ]]; then
  curl -fsS "$BASE_URL/artisans_search_page/1/$TERM" -H "$(hdr)" -o /dev/null -w "search: %{http_code}\n"
fi
curl -fsS "$BASE_URL/artisans_not_deleted" -H "$(hdr)" -o /dev/null -w "not_deleted: %{http_code}\n"
curl -fsS "$BASE_URL/artisans_deleted" -H "$(hdr)" -o /dev/null -w "deleted: %{http_code}\n"
curl -fsS "$BASE_URL/auth/artisans_last_premium" -H "$(hdr)" -o /dev/null -w "premium: %{http_code}\n"

# Exemple actions en lot (IDs à adapter)
IDs='[1,2]'
curl -s -X PUT "$BASE_URL/artisans_active" -H "$(hdr)" -H "Content-Type: application/json" -d "$IDs" -o /dev/null -w "activate: %{http_code}\n" || true
curl -s -X PUT "$BASE_URL/artisans_desactive" -H "$(hdr)" -H "Content-Type: application/json" -d "$IDs" -o /dev/null -w "deactivate: %{http_code}\n" || true

echo "OK"


