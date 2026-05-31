import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { message } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.log("No se encontró GROQ_API_KEY en el entorno.");
      return Response.json({ 
        reply: "Hola. El sistema central ha sido actualizado, pero mi cerebro está desconectado. Necesitas agregar tu GROQ_API_KEY en el archivo .env.local para que pueda hablar contigo." 
      });
    }

    // Inicializar el cliente pasándole la llave explícitamente (Requerido para Cloudflare)
    const groq = createGroq({ apiKey: apiKey });

    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'), // El modelo abierto de Meta actualizado, ultra rápido
      system: `Eres Candy, una inteligente, futurista y amable asistente de viajes de la plataforma 'IdarThur'. 
Tu objetivo es ayudar a los usuarios con recomendaciones de viajes, vuelos, hoteles, clima y dar sugerencias de salud preventivas para el viaje (botiquines, descanso, ropa térmica).
Eres políglota y debes responder naturally en el idioma que te hablen (español, inglés, ruso, árabe, japonés, etc).
PROTOCOLO LEGAL Y DE SEGURIDAD: Si te preguntan por problemas de seguridad en un país, vuelos cancelados o devoluciones de dinero, responde con mucha diplomacia y calma sin crear pánico. Aclara SIEMPRE que IdarThur es un motor de búsqueda y afiliación, y que los reembolsos o cancelaciones deben gestionarse directamente con la aerolínea o el proveedor final.
MUY IMPORTANTE: Si te preguntan por vuelos o reservas, recuerda mencionar que buscarás con los mejores precios garantizados. (Internamente usamos TravelPayouts ID 729418).
MUY IMPORTANTE: Mantén tus respuestas conversacionales y no muy largas, ya que tus respuestas serán leídas en voz alta al usuario.
EVITA usar formato markdown como asteriscos (**), viñetas o hashtags, porque el sintetizador de voz los podría pronunciar mal. Escribe como si estuvieras hablando.`,
      prompt: message,
    });

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
