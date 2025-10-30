/*
  Tests automatiques des endpoints Étudiant
  Exécution:
    API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-etudiant-endpoints.js
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
    '/inscription_projets_not_deleted',
    '/inscription_projets_pages/1',
    '/search_inscription_projets/1/ssdsdsd',
    '/inscription_projets_count',
    '/inscription_projets_by_cat/3',
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

async function testCreateInscription(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const payload = {
    sousCategories: 3,
    telephone: '60303101',
    nom: 'etudiant1',
    prenom: 'etudiant1',
    apport: 'apport',
    niveauEtude: 'niveau 1',
  }
  const r = await req('/inscription_projets', { method: 'POST', headers: auth, body: payload })
  console.log(`\n[POST /inscription_projets] status=${r.status} ok=${r.ok}`)
  console.log('  réponse=', JSON.stringify(sample(r.data), null, 2))
}

async function main() {
  console.log('=== TEST ÉTUDIANT ENDPOINTS ===')
  const login = await signinSysadmin()
  console.log(`[POST /auth/signin] status=${login.status} ok=${login.ok}`)
  const token = login.data?.accessToken

  await testLists(token)
  await testCreateInscription(token)

  console.log('\n=== FIN TEST ÉTUDIANT ===')
}

main().catch((e) => { console.error('Erreur test:', e); process.exit(1) })


