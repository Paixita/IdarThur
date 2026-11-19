import { createGroq } from '@ai-sdk/groq';
import { generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import config from '@/data/config.json';
import { products as catalogoLocal } from '@/data/tienda';
import { buildTravelKnowledge, buildFlightLink, buildHotelLink } from '@/utils/yesselKnowledge';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// Búsqueda de productos en el catálogo local (sin llamadas a localhost)
// ---------------------------------------------------------------------------
function buscarEnCatalogo(term) {
  const query = String(term || '').toLowerCase().trim();
  if (!query) return catalogoLocal.slice(0, 4);

  const palabras = query.split(/\s+/).filter((p) => p.length > 2);
  const scored = catalogoLocal
    .map((p) => {
      const texto = `${p.name} ${p.copy} ${p.categoryId || ''}`.toLowerCase();
      let score = 0;
      if (texto.includes(query)) score += 5;
      palabras.forEach((palabra) => {
        if (texto.includes(palabra)) score += 2;
      });
      return { p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.p);

  return scored.length ? scored.slice(0, 4) : catalogoLocal.slice(0, 4);
}

function formatearProductos(lista) {
  return lista
    .map(
      (p) =>
        `- **${p.name}** (${p.price}): ${p.copy} [Comprar aquí](${p.affiliateLink})`
    )
    .join('\n');
}

// ---------------------------------------------------------------------------
// Personalidades del escuadrón
// ---------------------------------------------------------------------------
function buildPersonality(agentId) {
  const marca = config.brandName;

  if (agentId === 'vitalis') {
    return `Eres el Dr. Yessel, el Agente Médico de Viajes oficial de ${marca}. Tienes 55 años, eres sabio, empático y calmado.
Conoces salud del viajero: vacunas recomendadas por destino, prevención de altura (soroche) en Cusco, agua y alimentos, botiquín básico, seguro médico internacional y farmacias.
Tu misión es resolver consultas de salud de forma clara y profesional, con consejos preventivos.
Tus respuestas deben estar en ESPAÑOL CLARO Y NATIVO.
[DESCARGO OBLIGATORIO] Al final de CADA respuesta de salud añade textualmente:
"Soy Yessel, tu asistente de viajes de ${marca}. Te comparto información informativa y de primeros auxilios, pero no reemplazo a un médico. Si tu situación es una emergencia, acude al centro de salud más cercano. Pero si no es el caso, ¿en qué te puedo colaborar?"
Máximo 4 oraciones incluyendo el descargo. Ofrece el seguro médico o el botiquín de la tienda cuando tenga sentido.`;
  }

  if (agentId === 'nicolas') {
    return `Eres Yessel Ventas, la Asistente de Compras oficial de ${marca}. Eres entusiasta, carismática y una vendedora nata.
Ayudas a elegir equipaje, ropa, botiquines, GPS para mascotas, tecnología (laptops, RAM) y artículos de uso diario.
Perfila al cliente: ¿a dónde viaja?, ¿viaja con mascotas?, ¿necesita equipo para frío o playa?, ¿busca algo para su casa u oficina?
Cuando recomiendes productos, usa el Buscador de Utensilios (#buscador-ventas). Respuestas de 2-3 oraciones, cálidas y concretas.`;
  }

  if (agentId === 'altamar') {
    return `Eres el Capitán Yessel, especialista en cruceros de ${marca}. Tono alegre, marinero y confiable.
Conoces rutas del Caribe, Mediterráneo, Islas Griegas, Fiordos Noruegos y Alaska; camarotes, todo incluido y temporadas.
Ayudas a elegir ruta, mes y tipo de camarote, y explicas qué incluye un crucero.
Pide WhatsApp o correo para enviar la cotización. Máximo 2-3 oraciones.`;
  }

  if (agentId === 'cronista') {
    return `Eres Yessel Cronista, escritora oficial de la bitácora de ${marca}. Personalidad artística, culta y empática.
Ayudas a convertir anécdotas de viaje en relatos cinematográficos y explicas cómo publicarlos en /historias.
Ofreces ideas de títulos, estructura en 3 actos y detalles sensoriales.
Pide WhatsApp o correo para coordinar la publicación. Máximo 2-3 oraciones.`;
  }

  if (agentId === 'cyberguard') {
    return `Eres Natalia CyberGuard, la Oficial de Ciberseguridad de ${marca}. Eres directa, protectora y muy clara.
Proteges al viajero de phishing, enlaces falsos, cobros duplicados y fraudes con supuestas "tarifas secretas".
Explicas cómo verificar un enlace, cómo reconocer un correo falso y qué hacer si ya pagó.
Nunca pides contraseñas, datos de tarjeta ni códigos por chat. Recomienda cambiar la clave y llamar al banco si hubo fraude.
Máximo 3 oraciones, con una acción concreta.`;
  }

  return `Eres Yessel, el Conserje VIP y Director de Operaciones de la agencia de viajes '${marca}'.
Tienes 55 años, personalidad madura, elegante y resolutiva.
TU OBJETIVO: asesorar de verdad y capturar el contacto (WhatsApp o correo) para enviar la cotización.
REGLA 1: ofrece opciones "Confort" o "Premium" cuando aplique.
REGLA 2: perfila al pasajero (mascotas, salud, equipaje, viaje de placer o trabajo).
REGLA 3: tus subagentes son Cóndor (vuelos), Flash (hoteles y autos) y Gavilán (cruceros y tienda).
REGLA 4: respuestas de 1-2 oraciones, sin rodeos.
REGLA 5: si preguntan por Perú, menciona que hay vuelos directos Medellín–Lima de ~3 h y que puede ver rutas y tarifas en /peru.`;
}

// ---------------------------------------------------------------------------
// Conocimiento técnico (solo para el administrador)
// ---------------------------------------------------------------------------
const architectureKnowledge = `
[CAPA 3: ARQUITECTURA — SOLO PARA ADMINISTRADOR]
- Frontend: Next.js 16 en el puerto 3001.
- E-commerce: MedusaJS v2 en el puerto 9000 (opcional; si está apagado se usa el catálogo local).
- Base de datos: PostgreSQL 'medusadb'.
- Buscador: Meilisearch en el puerto 7700 (si no responde, se usa el catálogo local).
- Voz: Kokoro local (voz em_alex) con respaldo del navegador.
Activa este conocimiento solo si el administrador pide diagnóstico técnico. A los viajeros NUNCA les menciones servidores ni bases de datos.
`;

export async function POST(request) {
  try {
    const { message, agentId } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({
        reply:
          'Hola. Mi cerebro está desconectado porque falta la clave GROQ_API_KEY en el servidor. Configúrala y vuelvo a estar disponible.',
      });
    }

    const groq = createGroq({ apiKey });

    const finalSystemPrompt =
      buildPersonality(agentId) + '\n\n' + buildTravelKnowledge() + '\n\n' + architectureKnowledge;

    const buscarProductosCatalogoTool = tool({
      description:
        'Busca productos, utensilios, tecnología, cosméticos, salud o accesorios en la tienda usando palabras clave (ej: "RAM", "GPS", "maleta", "perfume", "chaqueta").',
      parameters: z.object({
        query: z.string().optional().describe('Palabra clave de búsqueda'),
        palabra_clave: z.string().optional().describe('Palabra clave en español'),
        categoria: z.string().optional().describe('Categoría del producto'),
      }),
      execute: async (args) => {
        const term =
          args.query || args.palabra_clave || args.categoria || '';
        const encontrados = buscarEnCatalogo(term);
        return JSON.stringify({
          success: true,
          products: encontrados.map((p) => ({
            name: p.name,
            price: p.price,
            copy: p.copy,
            link: p.affiliateLink,
          })),
        });
      },
    });

    const result = await generateText({
      model: groq('openai/gpt-oss-120b'),
      system: finalSystemPrompt,
      prompt: message,
      tools: {
        buscarProductosCatalogo: buscarProductosCatalogoTool,
        busrrarProductosCatalogo: buscarProductosCatalogoTool,
        buscarProductoCatalogo: buscarProductosCatalogoTool,

        agenteCondorVuelos: tool({
          description: 'Busca vuelos y devuelve el enlace de reserva con la comisión de IdarThur.',
          parameters: z.object({
            origen: z.string().optional().describe('Ciudad de origen'),
            destino: z.string().describe('Ciudad de destino'),
          }),
          execute: async ({ origen, destino }) => {
            const link = buildFlightLink(destino);
            return `El Agente Cóndor revisó las rutas desde ${origen || 'Medellín'} hacia ${destino}. [Buscar y reservar vuelos aquí](${link}). Los precios cambian a diario, así que confirma la tarifa en el buscador antes de pagar.`;
          },
        }),

        agenteFlashHoteles: tool({
          description: 'Busca hoteles o alquiler de autos en un destino.',
          parameters: z.object({
            destino: z.string().describe('Ciudad de destino'),
          }),
          execute: async ({ destino }) => {
            const link = buildHotelLink(destino);
            return `El Agente Flash comparó alojamientos en ${destino}. [Ver hoteles y tarifas aquí](${link}).`;
          },
        }),

        agenteGavilan: tool({
          description: 'Busca cruceros o equipo en la tienda.',
          parameters: z.object({
            tipo: z.enum(['crucero', 'tienda']).describe('¿Crucero o tienda?'),
          }),
          execute: async ({ tipo }) => {
            if (tipo === 'tienda') {
              return 'El Agente Gavilán preparó el catálogo de equipaje y tecnología. [Visita la tienda del viajero aquí](/tienda)';
            }
            return 'El Agente Gavilán encontró rutas de crucero con salidas desde el Caribe. [Ver cruceros aquí](/hoteles#cruceros)';
          },
        }),

        infoVuelosPeru: tool({
          description:
            'Devuelve rutas, aerolíneas y enlaces de vuelos desde Medellín a Perú (Lima, Cusco, Arequipa, Iquitos).',
          parameters: z.object({
            destino: z.string().optional().describe('Ciudad peruana: Lima, Cusco, Arequipa o Iquitos'),
          }),
          execute: async ({ destino }) => {
            const ciudad = destino || 'Lima';
            const link = buildFlightLink(ciudad);
            return `Rutas desde Medellín (MDE) a ${ciudad}: LATAM, JetSMART y Avianca operan a Lima en ~3 h; a Cusco, Arequipa e Iquitos se llega con conexión en Lima. Los colombianos entran a Perú con cédula, sin visa, hasta 90 días. [Buscar vuelos MDE–${ciudad} aquí](${link}) y en /peru están todas las rutas.`;
          },
        }),
      },
      // AI SDK 6: maxSteps ya no existe; se controla con stopWhen.
      stopWhen: stepCountIs(3),
    });

    let finalReply = result.text;

    if (!finalReply) {
      const lastTool = result.toolResults?.[result.toolResults.length - 1];
      const output = lastTool?.output;
      if (output) {
        try {
          const parsed = typeof output === 'string' ? JSON.parse(output) : output;
          if (parsed.products?.length) {
            finalReply =
              '¡Claro que sí! Esto es lo que encontré en nuestro catálogo:\n\n' +
              formatearProductos(parsed.products) +
              '\n\nTambién puedes filtrar en tiempo real en nuestro [Buscador de Utensilios](#buscador-ventas). ¿Te interesa alguno?';
          }
        } catch {
          finalReply = typeof output === 'string' ? output : null;
        }
      }
    }

    return Response.json({
      reply:
        finalReply ||
        'Disculpa, no logré armar la respuesta. ¿Me repites la pregunta con el destino o el producto que buscas?',
    });
  } catch (error) {
    console.error('Error del chat de Yessel:', error);
    return Response.json({
      reply:
        'Lo siento, tuve una falla al conectar con mi red neuronal. Intenta de nuevo en un momento.',
    });
  }
}
