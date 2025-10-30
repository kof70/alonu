#!/usr/bin/env node
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const API_BASE_URL = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://51.75.162.85:8080/artisanat_v8/api'

// Default creds from Postman collection
const USERNAME = process.env.PUBLIC_USERNAME || 'sysadmin'
const PASSWORD = process.env.PUBLIC_PASSWORD || '@sys@#123'

function doRequest(method, url, body) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    const req = mod.request(url, { method, headers }, (res) => {
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
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function main() {
  const signinUrl = `${API_BASE_URL}/auth/signin`
  console.log('Signing in to fetch token:', signinUrl)
  const res = await doRequest('POST', signinUrl, { username: USERNAME, password: PASSWORD })
  if (!res.ok || !res.data?.accessToken) {
    console.error('Failed to obtain accessToken. Status:', res.status, 'Response:', res.data)
    process.exit(1)
  }
  const token = res.data.accessToken
  const envPath = path.join(process.cwd(), '.env.local')
  let content = ''
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8')
  }
  const lines = content.split('\n').filter(Boolean)
  const withoutOld = lines.filter(l => !l.startsWith('VITE_PUBLIC_BEARER_TOKEN=') && !l.startsWith('VITE_API_BASE_URL='))
  withoutOld.push(`VITE_API_BASE_URL=${API_BASE_URL}`)
  withoutOld.push(`VITE_PUBLIC_BEARER_TOKEN=${token}`)
  fs.writeFileSync(envPath, withoutOld.join('\n') + '\n')
  console.log('Wrote token to .env.local')
}

main().catch(e => { console.error(e); process.exit(1) })


