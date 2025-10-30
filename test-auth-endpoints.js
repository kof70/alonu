/*
  Script de test complet des endpoints d'authentification.
  Usage: node test-auth-endpoints.js
*/

const BASE = process.env.API_BASE_URL || 'http://51.75.162.85:8080/artisanat_v8/api';

async function req(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

function rand(n = 6) {
  const s = Math.random().toString(36).slice(2, 2 + n);
  return s.replace(/[^a-z0-9]/gi, 'a');
}

async function testLogin(username, password) {
  const r = await req('/auth/signin_web', {
    method: 'POST',
    body: { username, password },
  });
  return r;
}

async function testRefresh(refreshToken) {
  const r = await req('/auth/refreshtoken', {
    method: 'POST',
    body: { refreshToken },
  });
  return r;
}

async function testSubcategories(token) {
  const r = await req('/auth/sous_categorie_auth', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!r.ok) {
    const r2 = await req('/sous_categorie_not_deleted');
    return r2;
  }
  return r;
}

async function testRegister(payload) {
  // Tentative endpoint principal
  let r = await req('/auth/signin-up-all', { method: 'POST', body: payload });
  if (!r.ok && r.status >= 500) {
    // Fallback vers endpoint "check"
    const r2 = await req('/auth/signin-up-all-check', { method: 'POST', body: payload });
    return { primary: r, fallback: r2 };
  }
  return { primary: r };
}

async function run() {
  console.log('=== TEST AUTH COMPLET ===');

  // 1) Login sysadmin
  console.log('\n[Login sysadmin]');
  const adminLogin = await req('/auth/signin', { method: 'POST', body: { username: 'sysadmin', password: '@sys@#123' } });
  console.log('status=', adminLogin.status, 'ok=', adminLogin.ok);
  const adminAccess = adminLogin.data?.accessToken;
  const adminRefresh = adminLogin.data?.refreshToken;

  // 2) Subcategories
  console.log('\n[Sous-catégories]');
  const subcats = await testSubcategories(adminAccess);
  const list = Array.isArray(subcats.data) ? subcats.data : subcats.data?.data;
  console.log('status=', subcats.status, 'taille=', Array.isArray(list) ? list.length : 'N/A');
  
  // Afficher un échantillon de sous-catégories
  if (Array.isArray(list) && list.length > 0) {
    console.log('Échantillon (première sous-catégorie):', JSON.stringify(list[0], null, 2));
  }

  // 3) Register Artisan - CORRECTION: utiliser "latidute" comme l'API l'attend
  const uSuffix = rand();
  const artisan = {
    username: `art_${uSuffix}`,
    password: 'Secret123',
    email: `art_${uSuffix}@example.com`,
    nom: 'Art',
    prenom: 'Tester',
    telephone: '9' + String(Math.floor(1000000 + Math.random() * 8999999)), // 8 chiffres
    adresse: 'Lomé, Togo',
    numeroEnr: `ENR${Math.floor(Math.random() * 100000)}`,
    sousCategories: 1,
    longitude: 1.2226,
    latidute: 6.1304, // IMPORTANT: l'API attend "latidute" (avec faute)
    facebook: 'https://facebook.com/artisan',
    whatsapp: '+22890000001',
    tweeter: 'https://twitter.com/artisan'
  };
  console.log('\n[Inscription Artisan]');
  console.log('Données envoyées:', JSON.stringify(artisan, null, 2));
  const regArt = await testRegister(artisan);
  console.log('Status:', regArt.primary.status);
  
  if (!regArt.primary.ok) {
    console.log('❌ ÉCHEC - Détails de l\'erreur:');
    if (regArt.primary.data?.apierror) {
      const err = regArt.primary.data.apierror;
      console.log('  - status:', err.status);
      console.log('  - message:', err.message);
      if (Array.isArray(err.subErrors) && err.subErrors.length > 0) {
        console.log('  - Erreurs de validation:');
        err.subErrors.forEach((e, i) => {
          console.log(`    [${i+1}] Champ: "${e.field}" | Valeur rejetée: "${e.rejectedValue}" | Message: "${e.message}"`);
        });
      }
    } else {
      console.log('  - Données:', JSON.stringify(regArt.primary.data, null, 2));
    }
  } else {
    console.log('✅ Succès:', regArt.primary.data?.message || 'Artisan créé');
  }
  
  if (regArt.fallback) {
    console.log('Fallback status:', regArt.fallback.status);
    if (!regArt.fallback.ok && regArt.fallback.data?.apierror) {
      console.log('Fallback erreur:', regArt.fallback.data.apierror.message);
    }
  }

  // 4) Register Étudiant
  const sSuffix = rand();
  const student = {
    username: `stu_${sSuffix}`,
    password: 'Secret123',
    email: `stu_${sSuffix}@example.com`,
    nom: 'Stu',
    prenom: 'Dent',
    telephone: '9' + String(Math.floor(1000000 + Math.random() * 8999999)),
    adresse: 'Lomé, Togo',
    numeroEnr: `STU${Math.floor(Math.random() * 100000)}`,
    sousCategories: 1,
    longitude: 1.2226,
    latidute: 6.1304, // IMPORTANT: l'API attend "latidute" (avec faute)
    facebook: 'https://facebook.com/student',
    whatsapp: '+22890000002',
    tweeter: 'https://twitter.com/student'
  };
  console.log('\n[Inscription Étudiant]');
  console.log('Données envoyées:', JSON.stringify(student, null, 2));
  const regStu = await testRegister(student);
  console.log('Status:', regStu.primary.status);
  
  if (!regStu.primary.ok) {
    console.log('❌ ÉCHEC - Détails de l\'erreur:');
    if (regStu.primary.data?.apierror) {
      const err = regStu.primary.data.apierror;
      console.log('  - status:', err.status);
      console.log('  - message:', err.message);
      if (Array.isArray(err.subErrors) && err.subErrors.length > 0) {
        console.log('  - Erreurs de validation:');
        err.subErrors.forEach((e, i) => {
          console.log(`    [${i+1}] Champ: "${e.field}" | Valeur rejetée: "${e.rejectedValue}" | Message: "${e.message}"`);
        });
      }
    } else {
      console.log('  - Données:', JSON.stringify(regStu.primary.data, null, 2));
    }
  } else {
    console.log('✅ Succès:', regStu.primary.data?.message || 'Étudiant créé');
  }
  
  if (regStu.fallback) {
    console.log('Fallback status:', regStu.fallback.status);
  }

  // 5) Tentative de login des comptes créés (si succès)
  if (regArt.primary.ok) {
    console.log('\n[Login Artisan créé]');
    const loginArt = await testLogin(artisan.username, artisan.password);
    console.log('status=', loginArt.status, 'ok=', loginArt.ok);
    if (loginArt.ok) {
      console.log('✅ Login artisan réussi');
    }
  }

  if (regStu.primary.ok) {
    console.log('\n[Login Étudiant créé]');
    const loginStu = await testLogin(student.username, student.password);
    console.log('status=', loginStu.status, 'ok=', loginStu.ok);
    if (loginStu.ok) {
      console.log('✅ Login étudiant réussi');
    }
  }

  // 6) Refresh token
  if (adminLogin.ok && adminRefresh) {
    console.log('\n[Refresh Token sysadmin]');
    const r = await testRefresh(adminRefresh);
    console.log('status=', r.status, 'ok=', r.ok);
    if (r.ok) {
      console.log('✅ Refresh token réussi');
      console.log('Nouveau accessToken:', r.data?.accessToken ? 'Présent' : 'Absent');
    }
  }

  console.log('\n=== FIN TEST ===');
}

run().catch((e) => {
  console.error('Erreur test:', e);
  process.exit(1);
});
