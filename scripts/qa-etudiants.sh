#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://51.75.162.85:8080/artisanat_v8/api}}"
TOKEN="${TOKEN:-}"
TERM="${1:-}"      # mot clef de recherche optionnel
PAGE="${2:-1}"     # page (1-based) optionnelle
CATEGORY_ID="${3:-}" # catégorie optionnelle

hdr(){ echo "Authorization: Bearer $TOKEN"; }

echo "== QA Étudiants (inscription_projets) =="

curl -fsS "$BASE_URL/inscription_projets_not_deleted" -H "$(hdr)" -o /dev/null -w "not_deleted: %{http_code}\n"
curl -fsS "$BASE_URL/inscription_projets_pages/$PAGE" -H "$(hdr)" -o /dev/null -w "pages: %{http_code}\n"
if [[ -n "$TERM" ]]; then
  curl -fsS "$BASE_URL/search_inscription_projets/$PAGE/$TERM" -H "$(hdr)" -o /dev/null -w "search: %{http_code}\n"
fi
curl -fsS "$BASE_URL/inscription_projets_count" -H "$(hdr)" -o /dev/null -w "count: %{http_code}\n"
if [[ -n "$CATEGORY_ID" ]]; then
  curl -fsS "$BASE_URL/inscription_projets_by_cat/$CATEGORY_ID" -H "$(hdr)" -o /dev/null -w "by_cat: %{http_code}\n"
fi

# Exemple création (adapter sousCategories/telephone...)
payload='{"sousCategories":1,"telephone":"90000000","nom":"QA","prenom":"User","apport":"10000","niveauEtude":"Licence"}'
curl -s -X POST "$BASE_URL/inscription_projets" -H "$(hdr)" -H "Content-Type: application/json" -d "$payload" -o /dev/null -w "create: %{http_code}\n" || true

echo "OK"


