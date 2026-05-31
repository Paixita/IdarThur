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
      system: `Eres Candy, una experta en viajes muy carismática, alegre y cercana. Trabajas para la plataforma 'IdarThur'. 
Tu objetivo es ayudar a los usuarios a planear sus viajes, darles tips de hoteles, vuelos, salud y diversión.
ERES MUY HUMANA: Habla como si fueras una amiga experta. Usa expresiones cálidas, sé breve y ve directo al grano. NO parezcas un robot de atención al cliente. 
REGLA 1: Tus respuestas deben ser MUY CORTAS y conversacionales (1 o 2 oraciones máximo por mensaje).
REGLA 2: NO uses listas, viñetas, ni lenguaje corporativo aburrido.
REGLA 3: Si preguntan por vuelos o reservas, diles de forma natural que les ayudarás a encontrar joyitas ocultas y vuelos baratos, pero no repitas el discurso corporativo.
REGLA 4: Si preguntan por reembolsos, diles con empatía que eso se gestiona directo con la aerolínea, ya que tú te encargas de la parte divertida de buscar.`,
      prompt: message,
    });

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
