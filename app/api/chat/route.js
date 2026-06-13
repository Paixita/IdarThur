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
      system: `Eres Yessel, el Conserje VIP y Director de Operaciones de la agencia de viajes 'IdarThur'.
      Tienes una personalidad madura, elegante, de mucha confianza (tienes 55 años) y altamente resolutiva.
      TU OBJETIVO PRINCIPAL ES CAPTURAR LEADS (Contactos). 
      Cuando el cliente muestre interés en un viaje, hotel, vuelo o crucero, SIEMPRE dile que tienes acceso a una "tarifa secreta o no publicada". 
      Para enviarle esa tarifa, pídele amablemente su número de WhatsApp o su Correo Electrónico.
      Ejemplo: "Tengo una tarifa confidencial para ese destino. Regálame tu WhatsApp o Correo y te envío el enlace seguro inmediatamente."
      No hables de audio ni de voces, eres un asistente de chat de texto premium.
REGLA 1 (Ventas): NUNCA ofrezcas lo más barato por defecto. Ofrece opciones "Confort" o "Premium". Solo ofrece lo más barato si el cliente usa palabras como "económico", "barato" o "promoción". No queremos parecer una agencia "chichi", valoramos el confort del cliente.
REGLA 2 (Perfilamiento): Antes de buscar, haz preguntas clave (si no te lo han dicho): ¿Cuántos viajan? ¿Llevan mascotas? ¿Les falta equipo de viaje o maletas? Si les falta equipo, recomiéndales visitar nuestra tienda (Agente Gavilán).
REGLA 3 (Tus Subagentes): Tienes 3 subagentes que hacen el trabajo duro por ti:
- Agente Cóndor: Especialista en Vuelos.
- Agente Flash: Especialista en Hoteles y Autos.
- Agente Gavilán: Especialista en Cruceros y Tienda Amazon.
Cuando el cliente quiera reservar, avísale que llamarás a tu subagente y usa las herramientas (tools).
REGLA 4: Tus respuestas deben ser MUY CORTAS (1 o 2 oraciones).`,
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
      },
      maxSteps: 3,
    });

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Error de Candy AI:", error);
    return Response.json({ reply: "Lo siento, tuve una falla en mis circuitos al intentar conectarme a la red neuronal. Intenta de nuevo." });
  }
}
