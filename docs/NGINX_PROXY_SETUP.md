# Configuration Nginx pour masquer l'adresse du VPS

## Problème
L'adresse IP du VPS (`51.75.162.85:8080`) est visible dans le code JavaScript et les requêtes HTTP.

## Solution : Reverse Proxy avec Nginx

### 1. Configuration Nginx

```nginx
# /etc/nginx/sites-available/api.alonu.shop
server {
    listen 80;
    server_name api.alonu.shop;

    # Redirection HTTPS (recommandé)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.alonu.shop;

    # Certificat SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.alonu.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.alonu.shop/privkey.pem;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy vers le backend
    location /artisanat_v8/api/ {
        proxy_pass http://127.0.0.1:8080;
        
        # Headers pour le proxy
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Modification du code

Dans `env.config.ts`, utiliser une variable d'environnement :

```typescript
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/artisanat_v8/api',
  // ...
};
```

### 3. Variables d'environnement

**Production** (`.env.production`) :
```
VITE_API_BASE_URL=https://api.alonu.shop/artisanat_v8/api
```

**Développement** (`.env.development`) :
```
VITE_API_BASE_URL=http://51.75.162.85:8080/artisanat_v8/api
```

### 4. Avantages

✅ L'adresse IP du VPS n'est plus visible dans le code
✅ Utilisation d'un nom de domaine professionnel
✅ SSL/TLS pour la sécurité
✅ Possibilité de mettre en cache les réponses
✅ Protection contre les attaques directes sur le VPS

### 5. Configuration DNS

Ajouter un enregistrement A :
```
api.alonu.shop  →  51.75.162.85
```

### 6. Alternative : Utiliser un chemin relatif

Si le frontend et l'API sont sur le même domaine :
```typescript
API_BASE_URL: '/artisanat_v8/api'  // Utilise le même domaine que le frontend
```

## Notes importantes

⚠️ **Les erreurs HTTP (401, etc.) resteront visibles** - C'est normal, le navigateur les affiche toujours
⚠️ **L'IP reste accessible directement** - Mais les utilisateurs ne la verront pas dans le code
⚠️ **Reverse proxy requis** - Il faut configurer nginx sur le serveur

