# Manual de Instalación y Configuración: IdarThur (Marca Blanca)

¡Bienvenido a **IdarThur**! Este documento te guiará paso a paso para configurar, personalizar y desplegar tu nuevo portal inteligente de afiliados de viajes.

---

## 🗺️ Diagrama de Arquitectura de la Plataforma

Para comprender cómo se comunican las distintas piezas de la plataforma, aquí tienes el plano técnico de la infraestructura:

```mermaid
graph TD
    User([Cliente / Visitante]) -->|Interactúa / Busca / Chatea| FE[Frontend Next.js - Puerto 3001]
    
    subgraph Frontend [Aplicación Cliente (Next.js)]
        FE -->|Lee Configuración| Config[(config.json)]
        FE -->|Renderiza Vistas| Pages[Páginas Estáticas & Dinámicas]
        FE -->|Chat / TTS / Historias| API[API Routes / Edge Runtime]
    end

    subgraph Backend_Services [Servicios de Backend & Datos]
        API -->|Consulta Modelos de Lenguaje| Groq[Groq Cloud API - Llama/GPT-OSS]
        API -->|Búsqueda Rápida e Historias| Meili[Meilisearch Server - Puerto 7700]
        API -->|Gestión de Carrito y Catálogo| Medusa[MedusaJS Headless Commerce - Puerto 9000]
        Medusa -->|Almacenamiento de Productos| DB[(Base de Datos PostgreSQL)]
    end

    subgraph External_APIs [Monetización & Enlaces de Afiliados]
        FE -->|Reserva Vuelos / Hoteles| Travelpayouts[Travelpayouts / WayAway / Hotellook]
        FE -->|Alquiler de Vehículos| DiscoverCars[DiscoverCars Affiliate Portal]
        FE -->|Compra Equipaje y Accesorios| Amazon[Amazon Associates Affiliate Program]
    end

    classDef FEColor fill:#0f172a,stroke:#00f3ff,stroke-width:2px,color:#fff;
    classDef BEColor fill:#1e1b4b,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef ExtColor fill:#0c0a09,stroke:#eab308,stroke-width:2px,color:#fff;
    
    class FE,Pages,API FEColor;
    class Groq,Meili,Medusa,DB BEColor;
    class Travelpayouts,DiscoverCars,Amazon ExtColor;
```

---

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de comenzar:
1.  **Node.js:** Versión 18.0.0 o superior.
2.  **Base de Datos:** PostgreSQL (para el motor de E-commerce MedusaJS).
3.  **Meilisearch:** Motor de búsqueda (para sincronización del catálogo e historias).
4.  **Groq API Key:** Cuenta en Groq Cloud para el funcionamiento de los agentes de IA.

---

## 🛠️ Paso 1: Configurar Variables de Entorno

Copia el archivo `.env.example` y renómbralo como `.env.local` en la raíz del proyecto. Completa las siguientes credenciales:

```env
# Configuración del Backend de MedusaJS
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_medusa_publishable_key

# Configuración de Meilisearch
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_API_KEY=your_meilisearch_master_key

# APIs de Inteligencia Artificial (Groq)
GROQ_API_KEY=gsk_your_groq_api_key

# Enlaces y Tags de Afiliación
NEXT_PUBLIC_TRAVELPAYOUTS_MARKER=your_travelpayouts_marker
NEXT_PUBLIC_DISCOVERCARS_AID=your_discovercars_aid
NEXT_PUBLIC_AMAZON_TAG=your_amazon_tag
```

---

## 🎨 Paso 2: Personalizar tu Marca (config.json)

Abre el archivo `data/config.json` en la raíz del proyecto. Este archivo te permite cambiar toda la identidad visual del portal de forma instantánea:

```json
{
  "brandName": "IdarThur",
  "domainName": "idarthur.com",
  "tagline": "Agencia de Viajes Inteligente",
  "description": "Vuelos, Hoteles, Cruceros con el poder de la IA...",
  "keywords": ["idarthur", "viajes", "inteligencia artificial"],
  "supportEmail": "soporte@idarthur.com",
  "defaultAffiliateTag": "idarthur-20",
  "socials": {
    "whatsapp": "https://wa.me/573000000000",
    "instagram": "https://instagram.com/idarthur",
    "facebook": "https://facebook.com/idarthur"
  }
}
```

---

## 🚀 Paso 3: Despliegue en Producción

Puedes elegir cualquiera de los dos métodos de despliegue según tus preferencias:

### Opción A: Despliegue en Vercel (Recomendado y Gratis)
1.  Sube el código a un repositorio privado de **GitHub**.
2.  Inicia sesión en [Vercel](https://vercel.com) y haz clic en **Add New Project**.
3.  Importa el repositorio de GitHub de IdarThur.
4.  Configura las variables de entorno definidas en tu `.env.local` en el panel de configuración de Vercel.
5.  Haz clic en **Deploy**. ¡Tu web estará lista!

### Opción B: Despliegue en tu propio Servidor VPS (DigitalOcean, AWS, Linode)
1.  Conéctate a tu servidor Linux (Ubuntu recomendado).
2.  Clona el repositorio e instala las dependencias:
    ```bash
    npm install
    ```
3.  Compila la aplicación:
    ```bash
    npm run build
    ```
4.  Configura **PM2** para mantener la aplicación corriendo en segundo plano:
    ```bash
    npm install -g pm2
    ```
    Inicia la aplicación (ejemplo en puerto 3000):
    ```bash
    pm2 start npm --name "idarthur-frontend" -- run start -- -p 3000
    ```
5.  Configura un proxy inverso con **Nginx** y obtén un certificado SSL gratuito con **Let's Encrypt / Certbot** para asegurar tu dominio.

---

## 🌐 Paso 4: Configuración y Transferencia de Dominio

### Vinculación de un Dominio Existente
En tu panel de hosting o Vercel:
1.  Añade tu dominio (ej: `idarthur.com`).
2.  En el proveedor donde compraste el dominio (IONOS, GoDaddy, etc.), añade los registros DNS sugeridos:
    *   **Registro A:** Apuntando a la IP de tu VPS.
    *   **Registro CNAME:** Apuntando a los servidores de Vercel (si usas Vercel).

### Transferencia de Dominio desde IONOS (Si adquirió el proyecto completo)
Si el dominio `idarthur.com` está registrado en IONOS, los pasos para transferirlo a su cuenta son:
1.  El vendedor desbloqueará el dominio en IONOS y obtendrá el **Código de Autorización (Auth-Code)**.
2.  El comprador solicitará la transferencia de dominio en su propio registrador ingresando el Auth-Code obtenido.
3.  Una vez aprobado el proceso, el dominio pasará al panel de control del comprador en un plazo de 1 a 5 días.

---

## 🎬 Paso 5: Personalización de Multimedia

*   **Logotipo:** Reemplaza el archivo `/public/logo_blue.png` por tu propio logotipo con el mismo nombre.
*   **Video de Portada:** Reemplaza el archivo `/public/video-hero.mp4` por un video mp4 optimizado de fondo.
