// app/api/tiktok/route.js - Servidor de API para TikTok Events API (Conversions API)
import { headers } from 'next/headers';
import crypto from 'crypto';

// Función para encriptar datos del cliente en SHA-256 para cumplir con las políticas de privacidad de TikTok
function sha256(value) {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { event, event_id, user = {}, properties = {}, pageUrl, referrer } = body;

    const pixelId = process.env.TIKTOK_PIXEL_ID;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      console.warn('[TikTok API Server] Falta TIKTOK_PIXEL_ID o TIKTOK_ACCESS_TOKEN en las variables de entorno.');
      return new Response(JSON.stringify({ error: 'Falta la configuración de TikTok en el servidor.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener headers de la petición para extraer IP y User Agent automáticamente si no se proveen
    const headersList = await headers();
    const ip = user.ip || headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = user.user_agent || headersList.get('user-agent') || '';

    // Estructurar el payload conforme a la API oficial de TikTok Business v1.3
    const payload = {
      event_source: 'web',
      event_source_id: pixelId,
      data: [
        {
          event: event || 'ViewContent',
          event_id: event_id || `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          event_time: Math.floor(Date.now() / 1000),
          user: {
            // Hashing SHA-256 requerido por seguridad y privacidad en TikTok
            email: sha256(user.email),
            phone_number: sha256(user.phone),
            external_id: user.external_id ? sha256(user.external_id) : undefined,
            ttp: user.ttp, // Cookie TTP de TikTok del lado del cliente
            ip: ip,
            user_agent: userAgent
          },
          page: {
            url: pageUrl || 'https://www.idarthur.com',
            referrer: referrer || ''
          },
          properties: {
            contents: properties.contents || [],
            value: properties.value !== undefined ? Number(properties.value) : undefined,
            currency: properties.currency || 'USD',
            query: properties.query || undefined
          }
        }
      ]
    };

    console.log(`[TikTok Events API] Enviando evento "${event}" del servidor a TikTok...`);

    const tiktokRes = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await tiktokRes.text();
    let responseData = {};
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    if (!tiktokRes.ok || responseData.code !== 0) {
      console.error('[TikTok Events API Error]', responseData);
      return new Response(JSON.stringify({ success: false, error: responseData }), {
        status: tiktokRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[TikTok Events API Success] Evento "${event}" procesado por TikTok.`);
    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[TikTok Route Handler Error]', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
