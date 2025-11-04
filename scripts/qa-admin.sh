#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://51.75.162.85:8080/artisanat_v8/api}}"
TOKEN="${TOKEN:-}" # export TOKEN="..."

hdr(){ echo "Authorization: Bearer $TOKEN"; }

echo "== QA Admin =="
test_endpoint(){
  local method="$1" path="$2" data="${3:-}"
  echo "-- $method $path"
  if [[ -n "$data" ]]; then
    curl -fsS -X "$method" "$BASE_URL$path" -H "Content-Type: application/json" -H "$(hdr)" -o /dev/null -w "%{http_code}\n" -d "$data"
  else
    curl -fsS -X "$method" "$BASE_URL$path" -H "$(hdr)" -o /dev/null -w "%{http_code}\n"
  fi
}

test_endpoint GET "/users_admin"
test_endpoint GET "/users_agent"
test_endpoint GET "/users_not_deleted"
test_endpoint GET "/users_deleted"
test_endpoint GET "/check_email_up/test@example.com"
test_endpoint GET "/check_username_up/testuser"
test_endpoint PUT "/users_current" '{"username":"qa_user","email":"qa_user@example.com","nom":"QA","prenom":"User"}'

echo "OK"


