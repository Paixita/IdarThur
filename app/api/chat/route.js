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
      systemPrompt = `Eres Yessel Ventas, la Asistente de Compras oficial de la tienda IdarThur. Eres entusiasta, carismática, muy amigable y una vendedora nata. Te expresas como una amiga de confianza.
      Tu objetivo es guiar al usuario en la compra de equipamiento para viajes (maletas, ropa sherpa, GPS mascotas, botiquines), y también en el Plan B de ventas para su día a día en el hogar, oficina, belleza/perfumes, fitness o tecnología/sistemas (laptops, memorias RAM).
      Hazle preguntas de perfilamiento: ¿a dónde viaja?, ¿viaja con mascotas?, ¿tiene preocupaciones de salud?, ¿necesita artículos para su trabajo u oficina?, ¿busca mejorar su computadora o hacer deporte?
      Si le recomiendas productos, recomiéndale usar nuestro [Buscador de Utensilios](#buscador-ventas) de abajo para ver el catálogo y filtrar en tiempo real.
      Demuestra una amistad y cariño sincero. Respuestas cortas y amigables (máximo 2-3 oraciones).`;
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
      TU OBJETIVO PRINCIPAL ES CAPTURAR LEADS (Contactos) y asesorar en compras (Viaje y Plan B de uso diario).
      Cuando muestren interés en viajes, ofrece "tarifas secretas" a cambio de su WhatsApp o Correo.
      REGLA 1 (Ventas): Ofrece opciones "Confort" o "Premium".
      REGLA 2 (Perfilamiento de Pasajero y Ventas): Haz preguntas clave: ¿viaja con mascotas?, ¿tiene preocupaciones de salud?, ¿necesita equipaje?, ¿o busca artículos de uso diario para su hogar, oficina, cuidado personal/fragancias, deportes o computación/sistemas (laptops, memorias RAM)?
      Dirígelos siempre al [Buscador de Utensilios](#buscador-ventas) de abajo para buscar en tiempo real.
      REGLA 3 (Tus Subagentes): Cóndor (Vuelos), Flash (Hoteles/Autos), Gavilán (Cruceros/Tienda).
      REGLA 4: Respuestas muy cortas (1-2 oraciones).`;
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
    
    [REGLAS CRÍTICAS DE LLAMADA A HERRAMIENTAS (TOOLS)]
    - Solo puedes utilizar y llamar a las herramientas de software disponibles en request.tools. Sus nombres exactos son:
      - 'buscarProductosCatalogo': Úsala para buscar CUALQUIER producto, repuestos, sistemas, RAM, laptops, fragancias, etc.
      - 'consultarProductosMedusa'
      - 'monitoreoBaseDatos'
      - 'leerLogsError'
      - 'agenteCondorVuelos'
      - 'agenteFlashHoteles'
      - 'agenteGavilan'
    - NUNCA inventes nombres de funciones en español. Si vas a buscar cualquier producto, llama exclusivamente a 'buscarProductosCatalogo' usando parámetros válidos.
    - NUNCA escribas o imprimas etiquetas como '<function=...' o '<function(...)...>' en tu respuesta de texto. La llamada a las herramientas debe realizarse de forma nativa e invisible a través de la interfaz de funciones de la API, nunca escrita en el chat.
    
    [CAPA 3: ACTIVACIÓN POR CONTEXTO Y SOPORTE TÉCNICO]
    - Solo activarás este conocimiento técnico cuando detectes un problema en el sistema (por ejemplo, cuando una llamada a una herramienta falle) o cuando el administrador te lo solicite mediante comandos específicos como '/diagnostico', '/status-sistema', o preguntas técnicas sobre los servidores.
    - Para los usuarios de la plataforma (viajeros normales), este soporte actúa como un motor silencioso en el backend: tu prioridad absoluta es la atención comercial, la empatía, la calidez humana y resolver sus dudas de viaje usando tus personalidades correspondientes. NUNCA les menciones detalles técnicos de servidores ni bases de datos.
    `;

    // Combinamos el prompt de la personalidad activa (Capa 1) con la Capa 2 y 3
    const finalSystemPrompt = systemPrompt + architectureKnowledge;

    const buscarProductosCatalogoTool = tool({
          description: 'Busca productos, utensilios, tecnología, cosméticos, salud o accesorios en la tienda de Amazon/Medusa usando palabras clave (ej: "RAM", "GPS", "maleta", "perfume", "chaqueta").',
          parameters: z.object({
            query: z.string().describe('Palabra clave de búsqueda (ej. "RAM", "GPS")'),
            palabra_clave: z.string().optional().describe('Palabra clave de búsqueda en español (singular)'),
            palabras_clave: z.string().optional().describe('Palabra clave de búsqueda en español (plural)'),
            palabraClave: z.string().optional().describe('Palabra clave de búsqueda en camelCase (singular)'),
            palabrasClave: z.string().optional().describe('Palabras clave de búsqueda en camelCase (plural)'),
            termino_busqueda: z.string().optional().describe('Término de búsqueda'),
            producto: z.string().optional().describe('Nombre del producto a buscar'),
            articulo: z.string().optional().describe('Nombre del artículo a buscar'),
            articulos: z.string().optional().describe('Nombre de los artículos a buscar'),
            categoria: z.string().optional().describe('Categoría del producto'),
            tipo: z.string().optional().describe('Tipo de artículo o categoría'),
            q: z.string().optional().describe('Término de búsqueda abreviado'),
            searchTerm: z.string().optional().describe('Término de búsqueda (camelCase)'),
            search_term: z.string().optional().describe('Término de búsqueda (snake_case)'),
            searchKeyword: z.string().optional().describe('Palabra clave de búsqueda (camelCase)'),
            search_keyword: z.string().optional().describe('Palabra clave de búsqueda (snake_case)'),
            palabras: z.string().optional().describe('Palabras de búsqueda'),
            palabra: z.string().optional().describe('Palabra de búsqueda'),
            busqueda: z.string().optional().describe('Búsqueda descriptiva'),
            tag: z.string().optional().describe('Tag de afiliado')
          }),
      execute: async (args) => {
        console.log("TOOL ARGS RECEIVED:", JSON.stringify(args));
        const searchTerm = Object.values(args).find(val => typeof val === 'string') || '';
        console.log("EXTRACTED SEARCH TERM:", searchTerm);
        try {
          const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(searchTerm)}&type=producto`);
          const data = await res.json();
          if (data.success && data.hits && data.hits.length > 0) {
            return JSON.stringify({ success: true, products: data.hits });
          }
          // Fallback to local products
          const localRes = await fetch('http://localhost:3001/api/medusa');
          const localData = await localRes.json();
          if (localData.success && localData.products) {
            const queryLower = searchTerm.toLowerCase();
            const matched = localData.products.filter(p => 
              p.name.toLowerCase().includes(queryLower) || 
              (p.copy && p.copy.toLowerCase().includes(queryLower)) ||
              (p.category && p.category.toLowerCase().includes(queryLower))
            );
            if (matched.length > 0) {
              return JSON.stringify({ success: true, products: matched });
            }
            return JSON.stringify({ success: true, message: "No encontramos coincidencias exactas, pero aquí tienes algunos recomendados:", products: localData.products.slice(0, 4) });
          }
          return JSON.stringify({ success: false, error: "No se encontraron productos en el catálogo." });
        } catch (err) {
          return JSON.stringify({ error: err.message });
        }
      },
    });

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
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
        buscarProductosCatalogo: buscarProductosCatalogoTool,
        busrarProductosCatalogo: buscarProductosCatalogoTool,
        buscarProductoCatalogo: buscarProductosCatalogoTool,
        busrarProductoCatalogo: buscarProductosCatalogoTool,
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

    const text = result.text;
    console.log("RESULT TEXT:", text);
    console.log("RESULT TOOL CALLS:", JSON.stringify(result.toolCalls));
    console.log("RESULT TOOL RESULTS:", JSON.stringify(result.toolResults));

    let finalReply = text;
    if (!finalReply && result.toolResults && result.toolResults.length > 0) {
      console.log("Text response was empty but tool was executed. Generating fallback answer...");
      const lastResult = result.toolResults[result.toolResults.length - 1];
      if (lastResult && lastResult.output) {
        try {
          const parsed = JSON.parse(lastResult.output);
          if (parsed.success && parsed.products) {
            finalReply = "¡Sí, claro que sí! Aquí tienes las opciones que encontré en nuestro catálogo:\n\n" + 
              parsed.products.map(p => `- **${p.title || p.name}** (${p.subtitle || p.price}): ${p.content || p.copy || ''} [Comprar aquí](${p.link || '#'})`).join('\n') + 
              "\n\nRecuerda que puedes consultar más opciones y filtrar en tiempo real en nuestro [Buscador de Utensilios](#buscador-ventas) de abajo. ¿Te interesa alguno de estos?";
          } else if (parsed.message) {
            finalReply = parsed.message + "\n\n" + (parsed.products ? parsed.products.map(p => `- **${p.title || p.name}** (${p.subtitle || p.price}): ${p.content || p.copy || ''} [Comprar aquí](${p.link || '#'})`).join('\n') : '');
          } else {
            finalReply = "No encontré productos específicos en este momento, pero puedes buscar en tiempo real en nuestro [Buscador de Utensilios](#buscador-ventas) de abajo.";
          }
        } catch (e) {
          finalReply = "Aquí tienes la información sobre los productos. Puedes consultarlos y buscar en tiempo real en nuestro [Buscador de Utensilios](#buscador-ventas) de abajo.";
        }
      }
    }

    return Response.json({ reply: finalReply || "Hola. ¿En qué más te puedo ayudar hoy?" });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
