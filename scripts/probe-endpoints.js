#!/usr/bin/env node
/*
  Endpoint probe script
  - Tests public availability and responses for categories, subcategories, and artisans endpoints
  - Runs requests WITHOUT token first, then WITH token if provided (VITE_PUBLIC_BEARER_TOKEN or ACCESS_TOKEN env)
*/

const https = require('https')
const http = require('http')

const API_BASE_URL = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://51.75.162.85:8080/artisanat_v8/api'
const PUBLIC_BEARER_TOKEN = process.env.VITE_PUBLIC_BEARER_TOKEN || process.env.PUBLIC_BEARER_TOKEN || ''

const endpoints = {
  categories: [
    { name: 'categories_all', path: '/categorie' },
    { name: 'categories_not_deleted', path: '/categorie_not_deleted' },
  ],
  subcategories: [
    { name: 'subcategories_all', path: '/sous_categorie' },
    { name: 'subcategories_not_deleted', path: '/sous_categorie_not_deleted' },
    { name: 'subcategories_auth', path: '/auth/sous_categorie_auth', auth: true },
  ],
  artisans: [
    { name: 'artisans_all', path: '/artisans' },
    { name: 'artisans_page_1', path: '/artisans_pages/1' },
    { name: 'artisans_premium', path: '/auth/artisans_last_premium', auth: true },
  ],
  search: [
    { name: 'artisans_search_q', path: '/artisans/search/menuisier' },
    { name: 'artisans_search_page_q', path: '/artisans/search/page/1/menuisier' },
  ],
}

function doFetch(url, token) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const headers = { 'Accept': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const req = mod.request(url, { method: 'GET', headers }, (res) => {
      const chunks = []
      res.on('data', (d) => chunks.push(d))
      res.on('end', () => {
        const bodyStr = Buffer.concat(chunks).toString('utf8')
        let json
        try { json = JSON.parse(bodyStr) } catch { json = bodyStr }
        resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: json })
      })
    })
    req.on('error', (err) => resolve({ status: 0, ok: false, error: String(err) }))
    req.end()
  })
}

function sampleOf(data) {
  if (Array.isArray(data)) {
    return data.slice(0, Math.min(2, data.length))
  }
  if (data && typeof data === 'object' && Array.isArray(data.data)) {
    return data.data.slice(0, Math.min(2, data.data.length))
  }
  return data
}

async function probeOne(name, path, requireAuth) {
  const full = `${API_BASE_URL}${path}`
  const results = []
  // Public call first
  results.push({ label: 'public', ...(await doFetch(full)) })
  // Auth call if needed or if public failed and token exists
  if ((requireAuth || (!results[0].ok && PUBLIC_BEARER_TOKEN)) && PUBLIC_BEARER_TOKEN) {
    results.push({ label: 'auth', ...(await doFetch(full, PUBLIC_BEARER_TOKEN)) })
  }
  // Print
  console.log(`\n=== ${name} -> ${path}`)
  for (const r of results) {
    const count = Array.isArray(r.data) ? r.data.length : (Array.isArray(r.data?.data) ? r.data.data.length : 'n/a')
    console.log(` [${r.label}] status=${r.status} ok=${r.ok} count=${count}`)
    console.log('  sample:', JSON.stringify(sampleOf(r.data), null, 2))
  }
}

async function main() {
  console.log(`Probing API: ${API_BASE_URL}`)
  console.log(`Token present: ${PUBLIC_BEARER_TOKEN ? 'yes' : 'no'}`)

  for (const group of Object.keys(endpoints)) {
    console.log(`\n# Group: ${group}`)
    for (const ep of endpoints[group]) {
      await probeOne(ep.name, ep.path, !!ep.auth)
    }
  }

  // Bonus: try to resolve subcategories by category IDs 1..5
  console.log('\n# Subcategories by category ID (1..5)')
  for (let id = 1; id <= 5; id += 1) {
    await probeOne(`subcategories_by_category_${id}`, `/sous_categorie/categorie/${id}`, false)
  }
}

main().catch((e) => {
  console.error('Probe failed:', e)
  process.exit(1)
})


