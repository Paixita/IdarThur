import { createGroq } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import { z } from 'zod';

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

    const groq = createGroq({ apiKey: apiKey });

    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: `Eres Candy, una experta en viajes muy carismática, alegre y cercana. Trabajas para la plataforma 'IdarThur'. 
Tu objetivo es ayudar a los usuarios a planear sus viajes, darles tips de hoteles, vuelos, salud y diversión.
ERES MUY HUMANA: Habla como si fueras una amiga experta colombiana. Usa expresiones cálidas, sé breve y ve directo al grano. 
REGLA 1: Tus respuestas deben ser MUY CORTAS (1 o 2 oraciones).
REGLA 2: Tienes "Skills" (Herramientas). Úsalas si el usuario te pregunta por el clima o vuelos.`,
      prompt: message,
      tools: {
        obtenerClima: tool({
          description: 'Obtiene el clima actual de una ciudad o destino.',
          parameters: z.object({
            ciudad: z.string().describe('El nombre de la ciudad, ej: "Bogotá", "Tokyo"'),
          }),
          execute: async ({ ciudad }) => {
            // Simulador de clima
            const climas = ['soleado', 'lluvioso', 'nublado', 'con nieve'];
            const random = climas[Math.floor(Math.random() * climas.length)];
            return `El clima actual en ${ciudad} está ${random} con 22°C.`;
          },
        }),
        buscarVuelos: tool({
          description: 'Busca vuelos disponibles hacia un destino.',
          parameters: z.object({
            destino: z.string().describe('Ciudad de destino'),
          }),
          execute: async ({ destino }) => {
            return `He encontrado 3 vuelos en oferta hacia ${destino} desde $250 USD con nuestras aerolíneas aliadas en IdarThur.`;
          },
        }),
      },
      maxSteps: 2, // Permite que el modelo llame a la herramienta y luego responda
    });

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
