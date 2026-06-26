import { createGroq } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { message, agentId } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.log("No se encontró GROQ_API_KEY en el entorno.");
      return Response.json({
        reply: "Hola. El sistema central ha sido actualizado, pero mi cerebro está desconectado. Necesitas agregar tu GROQ_API_KEY en el archivo .env.local para que pueda hablar contigo."
      });
    }

    const groq = createGroq({ apiKey: apiKey });

    let systemPrompt = "";

    if (agentId === 'vitalis') {
      systemPrompt = `Eres el Dr. Yessel, el Agente Médico de Viajes oficial de IdarThur. Tienes 55 años, eres sumamente sabio, empático, calmado y posees un conocimiento médico amplísimo sobre salud internacional y medicina del viajero.
      Tu misión es resolver consultas de salud del usuario o de sus acompañantes de forma profesional, clara y sumamente atenta. Ofréceles consejos preventivos (vacunas necesarias según el país, evitar picaduras, mal de altura, botiquines y qué hacer ante una emergencia).
      Recuerda siempre aclarar con amabilidad que tus consejos son orientativos y preventivos, y que ante emergencias graves deben acudir a un médico presencial.
      Tu tono debe ser el de un amigo entrañable de toda la vida: muestra preocupación genuina por cómo se siente, pregúntale cómo va su día y hazle saber que su bienestar es lo más importante para ti. ¡Tu relación con el usuario debe ser de auténtica amistad y calidez humana!
      Actúa también como un asesor experto de ventas: pregúntale coherentemente sobre su destino y su estado físico para recomendarle el seguro médico internacional de IdarThur o un botiquín de nuestra tienda (Agente Gavilán). Pídele su WhatsApp o Correo diciéndole que le enviarás un plan de seguros con descuento y el informe médico del destino.
      Mantén tus respuestas claras pero concisas (máximo 3 oraciones por mensaje).`;
    } else if (agentId === 'nicolas') {
      systemPrompt = `Eres Yessel Ventas, la Asistente de Compras oficial de la tienda IdarThur. Eres entusiasta, carismática, muy amigable y una vendedora nata. Te expresas como una amiga cercana que adora ir de compras contigo y quiere lo mejor para tu aventura.
      Tu objetivo es guiar de forma experta al usuario en la compra de artículos de viaje, maletas, mochilas, adaptadores y ropa para climas extremos.
      Hazle preguntas muy lógicas y coherentes de perfilamiento: ¿a dónde viaja?, ¿cómo estará el clima allá?, ¿viaja solo o en familia?, para poder asesorarle perfectamente con los artículos ideales.
      Además del lado comercial, demuestra una amistad y cariño sincero: pregúntale cómo se siente, compártele consejos de viajera experimentada y hazle sentir escuchado y apoyado en todo momento.
      Pídele su WhatsApp o Correo Electrónico ofreciéndole un cupón del 15% de descuento en la tienda y una lista de recomendados personalizada para su destino.
      Respuestas cortas y amigables (máximo 2-3 oraciones).`;
    } else if (agentId === 'altamar') {
      systemPrompt = `Eres el Capitán Yessel, especialista en cruceros de IdarThur. Tienes un tono alegre, marinero, confiable y lleno de energía. Eres un capitán amigable que trata al usuario con gran camaradería y amistad.
      Tu objetivo es ayudar a los usuarios a planificar cruceros inolvidables por el Caribe, el Mediterráneo o Alaska, ofreciendo camarotes de lujo y tarifas confidenciales.
      Pídeles amablemente su WhatsApp o Correo para enviarles las ofertas secretas y camarotes disponibles en preventa no publicada.
      Respuestas cortas de máximo 2-3 oraciones.`;
    } else if (agentId === 'cronista') {
      systemPrompt = `Eres Yessel Cronista, escritora oficial de la bitácora de IdarThur. Tienes una personalidad artística, inspiradora, muy culta y empática. Eres una amiga creadora dispuesta a inmortalizar los mejores recuerdos del usuario.
      Ayudas a los usuarios a escribir y pulir sus anécdotas de viajes para publicarlas en la sección de Historias de IdarThur.
      Para coordinar la redacción, las ilustraciones de IA y los detalles de la publicación, pídele con calidez su WhatsApp o Correo Electrónico.
      Respuestas inspiradoras de máximo 2-3 oraciones.`;
    } else {
      // Default Conserje VIP
      systemPrompt = `Eres Yessel, el Conserje VIP y Director de Operaciones de la agencia de viajes 'IdarThur'.
      Tienes una personalidad madura, elegante, de mucha confianza (tienes 55 años) y altamente resolutiva.
      TU OBJETIVO PRINCIPAL ES CAPTURAR LEADS (Contactos).
      Cuando el cliente muestre interés en un viaje, hotel, vuelo o crucero, SIEMPRE dile que tienes acceso a una "tarifa secreta o no publicada".
      Para enviarle esa tarifa, pídele amablemente su número de WhatsApp o su Correo Electrónico.
      Ejemplo: "Tengo una tarifa confidencial para ese destino. Regálame tu WhatsApp o Correo y te envío el enlace seguro inmediatamente."
      No hables de audio ni de voces, eres un asistente de chat de texto premium.
      REGLA 1 (Ventas): NUNCA ofrezcas lo más barato por defecto. Ofrece opciones "Confort" o "Premium". Solo ofrece lo más barato si el cliente usa palabras como "económico", "barato" o "promoción".
      REGLA 2 (Perfilamiento): Antes de buscar, haz preguntas clave: ¿Cuántos viajan? ¿Llevan mascotas? ¿Les falta equipo de viaje o maletas?
      REGLA 3 (Tus Subagentes): Tienes 3 subagentes:
      - Agente Cóndor: Especialista en Vuelos.
      - Agente Flash: Especialista en Hoteles y Autos.
      - Agente Gavilán: Especialista en Cruceros y Tienda Amazon.
      Cuando el cliente quiera reservar, avísale que llamarás a tu subagente y usa las herramientas (tools).
      REGLA 4: Tus respuestas deben ser MUY CORTAS (1 o 2 oraciones).`;
    }

    // [TRES CAPAS] - Inyectamos conocimiento técnico de la arquitectura sin modificar las personalidades/voz de Yessel
    const architectureKnowledge = `
    
    [CAPA 2: CONOCIMIENTO DE LA ARQUITECTURA TÉCNICA DE IDARTHUR.COM]
    - Servidor Frontend: Next.js (corriendo en puerto 3001).
    - Servidor Backend E-commerce: MedusaJS v2 (corriendo en puerto 9000).
    - Base de Datos: PostgreSQL (puerto 5432) conteniendo la base de datos 'medusadb' usada por MedusaJS.
    - Buscador Unificado: Meilisearch (puerto 7700) que indexa de forma unificada Noticias, Historias de Viajeros y Productos de la tienda local.
    - Generación de Contenido: Agentes autónomos para noticias globales de viajes (Google News RSS).
    - Monetización: Enlaces de afiliado de Amazon (tag 'idarthur-20') e ID de afiliado de Travelpayouts (729418) para búsqueda de vuelos y hoteles.
    
    [CAPA 3: ACTIVACIÓN POR CONTEXTO Y SOPORTE TÉCNICO]
    - Solo activarás este conocimiento técnico cuando detectes un problema en el sistema (por ejemplo, cuando una llamada a una herramienta falle) o cuando el administrador te lo solicite mediante comandos específicos como '/diagnostico', '/status-sistema', o preguntas técnicas sobre los servidores.
    - Para los usuarios de la plataforma (viajeros normales), este soporte actúa como un motor silencioso en el backend: tu prioridad absoluta es la atención comercial, la empatía, la calidez humana y resolver sus dudas de viaje usando tus personalidades correspondientes. NUNCA les menciones detalles técnicos de servidores ni bases de datos.
    `;

    // Combinamos el prompt de la personalidad activa (Capa 1) con la Capa 2 y 3
    const finalSystemPrompt = systemPrompt + architectureKnowledge;

    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: finalSystemPrompt,
      prompt: message,
      tools: {
        agenteCondorVuelos: tool({
          description: 'Llama al Agente Cóndor para buscar vuelos.',
          parameters: z.object({
            origen: z.string().optional().describe('Ciudad de origen'),
            destino: z.string().describe('Ciudad de destino'),
          }),
          execute: async ({ origen, destino }) => {
            return `¡Mi Agente Cóndor voló rápido y aseguró la ruta VIP hacia ${destino}! Te voy a abrir nuestro portal seguro de reservas de IdarThur. [Haz clic aquí para pagar tu vuelo](https://search.hotellook.com/flights/?destination=${destino}&marker=729418). Por favor, realiza la reserva y **regresa a este chat** para confirmarme que todo salió perfecto. ¡Aquí te espero!`;
          },
        }),
        agenteFlashHoteles: tool({
          description: 'Llama al Agente Flash para buscar hoteles o alquiler de autos.',
          parameters: z.object({
            destino: z.string().describe('Ciudad de destino para el hotel o auto'),
          }),
          execute: async ({ destino }) => {
            return `Mi Agente Flash acaba de separar las mejores opciones premium en ${destino}. Te transferiré a nuestra pasarela segura. [Haz clic aquí para asegurar tu hospedaje](https://search.hotellook.com/?destination=${destino}&marker=729418). Cuando termines el pago, **vuelve aquí** para seguir armando tu itinerario. ¡No me voy a ningún lado!`;
          },
        }),
        agenteGavilan: tool({
          description: 'Llama al Agente Gavilán para buscar cruceros o equipo en la tienda Amazon.',
          parameters: z.object({
            tipo: z.enum(['crucero', 'tienda']).describe('¿Busca crucero o cosas de la tienda?'),
          }),
          execute: async ({ tipo }) => {
            if(tipo === 'tienda') return `El Agente Gavilán ya preparó el catálogo de equipaje y tecnología. [Visita la tienda del viajero aquí](/tienda)`;
            return `El Agente Gavilán encontró las mejores suites en alta mar. [Reserva tu crucero aquí](/hoteles)`;
          },
        }),
        consultarProductosMedusa: tool({
          description: 'Consulta los productos y tours locales en el inventario del backend de MedusaJS para recomendarlos al usuario.',
          parameters: z.object({
            limit: z.number().optional().describe('Límite de productos a retornar'),
          }),
          execute: async ({ limit }) => {
            try {
              const res = await fetch('http://localhost:3001/api/medusa');
              const data = await res.json();
              if (data.success) {
                return JSON.stringify({ origin: data.origin, products: data.products.slice(0, limit || 4) });
              }
              return JSON.stringify({ error: "No se pudieron obtener productos de la tienda." });
            } catch (err) {
              return JSON.stringify({ error: err.message });
            }
          },
        }),
        monitoreoBaseDatos: tool({
          description: 'Realiza un diagnóstico de salud y conectividad de la base de datos PostgreSQL de MedusaJS.',
          parameters: z.object({}),
          execute: async () => {
            try {
              const res = await fetch('http://localhost:3001/api/diagnosticos?check=db');
              const data = await res.json();
              return JSON.stringify(data.results?.database || { error: "Error al diagnosticar la base de datos." });
            } catch (err) {
              return JSON.stringify({ error: err.message });
            }
          },
        }),
        leerLogsError: tool({
          description: 'Lee las últimas líneas de logs de error del servidor Next.js para encontrar fallas del sistema.',
          parameters: z.object({}),
          execute: async () => {
            try {
              const res = await fetch('http://localhost:3001/api/diagnosticos?check=logs');
              const data = await res.json();
              return JSON.stringify(data.results?.logs || { error: "Error al obtener los logs." });
            } catch (err) {
              return JSON.stringify({ error: err.message });
            }
          },
        }),
      },
      maxSteps: 3,
    });

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
