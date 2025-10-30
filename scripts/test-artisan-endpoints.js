/*
  Tests automatiques des endpoints Artisan
  Exécution:
    API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-artisan-endpoints.js
*/

const BASE = process.env.API_BASE_URL || 'http://51.75.162.85:8080/artisanat_v8/api'

async function req(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = null
  try { data = await res.json() } catch {}
  return { status: res.status, ok: res.ok, data, headers: res.headers }
}

async function signinSysadmin() {
  return req('/auth/signin', {
    method: 'POST',
    body: { username: 'sysadmin', password: '@sys@#123' },
  })
}

function sample(obj) {
  if (!obj) return obj
  if (Array.isArray(obj)) return obj.slice(0, 1)
  if (typeof obj === 'object') {
    const entries = Object.entries(obj).slice(0, 6)
    return Object.fromEntries(entries)
  }
  return obj
}

async function testLists(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const endpoints = [
    '/auth/artisans_last_premium',
    '/artisans',
    '/artisans_not_deleted',
    '/artisans_deleted',
    '/artisans_pages/1',
    '/artisans_search_page/1/nu',
  ]
  for (const p of endpoints) {
    const r = await req(p, { headers: auth })
    console.log(`\n[GET ${p}] status=${r.status} ok=${r.ok}`)
    const arr = Array.isArray(r.data) ? r.data : r.data?.data
    if (Array.isArray(arr)) {
      console.log('  taille=', arr.length)
      console.log('  échantillon=', JSON.stringify(sample(arr), null, 2))
    } else {
      console.log('  réponse=', JSON.stringify(sample(r.data), null, 2))
    }
  }
}

async function testToggleActivation(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const enable = await req('/artisans_active', {
    method: 'PUT',
    headers: auth,
    body: [ { idArtisan: 4 } ],
  })
  console.log(`\n[PUT /artisans_active] status=${enable.status} ok=${enable.ok}`)
  const disable = await req('/artisans_desactive', {
    method: 'PUT',
    headers: auth,
    body: [ { idArtisan: 4 } ],
  })
  console.log(`[PUT /artisans_desactive] status=${disable.status} ok=${disable.ok}`)
}

async function main() {
  console.log('=== TEST ARTISAN ENDPOINTS ===')
  const login = await signinSysadmin()
  console.log(`[POST /auth/signin] status=${login.status} ok=${login.ok}`)
  const token = login.data?.accessToken

  await testLists(token)
  await testToggleActivation(token)

  console.log('\n=== FIN TEST ARTISAN ===')
}

main().catch((e) => { console.error('Erreur test:', e); process.exit(1) })


