# 🚀 Guía de Despliegue - IdarThur (www.idarthur.com)

## Requisitos Previos

1. **Cuenta de Vercel** - https://vercel.com/signup
2. **Dominio idarthur.com** debe estar apuntando a Vercel (registro DNS)
3. **API Keys necesarias** (ver sección de Variables de Entorno)

---

## 🗝️ Variables de Entorno de Producción

Configurar en Vercel Dashboard → Project Settings → Environment Variables

### Perfil: Production

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GROQ_API_KEY` | Tu API Key de Groq | Para el agente Yessel IA |
| `MEILISEARCH_HOST` | https://tu-instancia-meili.com | Backend de búsqueda |
| `MEILISEARCH_MASTER_KEY` | Tu master key | Autenticación Meilisearch |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | https://api.tu-tienda.com | Backend e-commerce |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | pk_tu_clave_publica | Clave pública Medusa |
| `TIKTOK_PIXEL_ID` | D904FQRC77U4L9S4V6UG | Tracking TikTok |
| `TIKTOK_ACCESS_TOKEN` | Tu access token | API TikTok |

### Perfil: Preview & Development

| Variable | Valor |
|----------|-------|
| `GROQ_API_KEY` | (clave de prueba) |
| `MEILISEARCH_HOST` | http://localhost:7700 |
| `MEILISEARCH_MASTER_KEY` | idarthur_meili_master_key_2026 |
| `DEBUG` | true |

---

## 📋 Pasos de Despliegue

### Opción 1: CLI de Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy a producción
cd /ruta/a/IdarThur
vercel --prod

# 4. Si el dominio está configurado, Vercel lo detecta automágicamente
# De lo contrario:
vercel domains add idarthur.com www.idarthur.com
```

### Opción 2: GitHub Integration (Automático)

1. **Push código a GitHub:**
```bash
cd /home/paicita/Escritorio/IdarThur
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

2. **Conectar en Vercel Dashboard:**
   - Ve a https://vercel.com/dashboard
   - Importa el proyecto `idarthur`
   - Vercel detectará la configuración automáticamente

3. **Configurar dominio:**
   - Project Settings → Domains
   - Agregar: `idarthur.com` y `www.idarthur.com`
   - Configurar redirects de `idarthur.com` → `www.idarthur.com`

---

## 🔒 Seguridad

✅ **Ya protegido:** 
- `.env.local` no se publica (gitignore)
- Claves API deben ir en Variables de Entorno de Vercel
- No exponer claves privadas

⚠️ **Verificar antes del deploy:**
```bash
# Buscar claves accidentalmente expuestas
grep -r "gsk_" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "pk_21030ff" . --exclude-dir=node_modules --exclude-dir=.git
```

---

## 📊 Verificaciones Post-Deploy

1. **Verificar HTTPS:** https://www.idarthur.com
2. **Probar funcionalidades:**
   - Hero section carga correctamente
   - Buscador funciona
   - Chat Yessel responde
   - Links de Amazon funcionan
3. **Analytics:** Verificar TikTok Pixel en Shopify
4. **SEO:** https://vercel.com/docs/concepts/deployments/overview

---

## 🚨 Solución de Problemas

### Build fallido
```bash
# Localmente primero verificar
npm run build
# Revisar errores de TypeScript
npm run lint
```

### Error 404 en rutas
Verificar que `output: 'standalone'` en next.config.mjs

### Variables faltantes
Verificar Environment Variables en Vercel → Project Settings

---

## 📱 Conexión con IdarThur App (Flutter)

Las APIs están documentadas en:
- `lib/config/app_config.dart` - URLs de endpoints
- `lib/services/api_client.dart` - Cliente HTTP
- `lib/services/chat_service.dart` - API de chat Yessel
- `lib/services/news_service.dart` - API de noticias

---

## 🔄 Pipeline Automatizado

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: team_QjbuMHjfw2nXnOJjAmvMQC2v
          vercel-project-id: prj_1AuAvq1eTYXJkYrauP6OiPp3rmUx
          vercel-args: '--prod'
```