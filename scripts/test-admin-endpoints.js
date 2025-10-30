/*
  Tests automatiques des endpoints Admin
  Exécution:
    API_BASE_URL="http://51.75.162.85:8080/artisanat_v8/api" node scripts/test-admin-endpoints.js
*/

const BASE = process.env.API_BASE_URL || 'http://51.75.162.85:8080/artisanat_v8/api'

async function req(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = null
  try { data = await res.json() } catch { /* texte ou vide */ }
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

async function testUsersEndpoints(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const endpoints = [
    { name: 'users_admin', path: '/users_admin' },
    { name: 'users_agent', path: '/users_agent' },
    { name: 'users_not_deleted', path: '/users_not_deleted' },
    { name: 'users_deleted', path: '/users_deleted' },
  ]
  for (const ep of endpoints) {
    const r = await req(ep.path, { headers: auth })
    console.log(`\n[GET ${ep.path}] status=${r.status} ok=${r.ok}`)
    const arr = Array.isArray(r.data) ? r.data : r.data?.data
    if (Array.isArray(arr)) {
      console.log('  taille=', arr.length)
      console.log('  échantillon=', JSON.stringify(sample(arr), null, 2))
    } else {
      console.log('  réponse=', JSON.stringify(sample(r.data), null, 2))
    }
  }
}

async function testUsersChecks(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const checks = [
    { name: 'check_email_up', path: '/check_email_up/martin@gmail.com' },
    { name: 'check_username_up', path: '/check_username_up/sysadmin' },
  ]
  for (const c of checks) {
    const r = await req(c.path, { headers: auth })
    console.log(`\n[GET ${c.path}] status=${r.status} ok=${r.ok}`)
    console.log('  réponse=', JSON.stringify(sample(r.data), null, 2))
  }
}

async function testCurrentUserUpdate(token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {}
  const payload = {
    username: 'sysadmin',
    email: 'sysadmin@gmail.com',
    nom: 'Sys',
    prenom: 'Admin',
    role: 1,
  }
  const r = await req('/users_current', { method: 'PUT', headers: auth, body: payload })
  console.log(`\n[PUT /users_current] status=${r.status} ok=${r.ok}`)
  console.log('  réponse=', JSON.stringify(sample(r.data), null, 2))
}

async function main() {
  console.log('=== TEST ADMIN ENDPOINTS ===')
  const login = await signinSysadmin()
  console.log(`[POST /auth/signin] status=${login.status} ok=${login.ok}`)
  const token = login.data?.accessToken

  await testUsersEndpoints(token)
  await testUsersChecks(token)
  await testCurrentUserUpdate(token)

  console.log('\n=== FIN TEST ADMIN ===')
}

main().catch((e) => { console.error('Erreur test:', e); process.exit(1) })


