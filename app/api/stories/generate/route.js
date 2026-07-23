import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ success: false, error: "Falta GROQ_API_KEY" }, { status: 500 });
    }

    const groq = createGroq({ apiKey: apiKey });

    const response = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: `Eres Yessel Cronista, el agente de Inteligencia Artificial especializado en relatos y crónicas de viaje de 'IdarThur'.
      Tu misión es recibir una idea o anécdota y redactarla como una historia de viajes altamente cinematográfica, emocionante, inspiradora y profesional en español.
      
      Debes devolver ÚNICAMENTE un objeto JSON válido (sin código markdown extra, sin texto de introducción ni de cierre) con el siguiente formato:
      {
        "titulo": "Título emocionante y atractivo",
        "subtitulo": "Subtítulo intrigante",
        "personajes": "Nombres y roles (ej. 'Laura (Fotógrafa)')",
        "categoria": "Una sola palabra descriptiva (ej. 'Aventura', 'Romance', 'Misterio', 'Comedia', 'Cultura')",
        "narrativa": "La historia redactada en español. Usa etiquetas HTML <p>, <br>, y <strong> para dar formato. La historia debe tener entre 3 y 5 párrafos bien detallados.",
        "imagen": "Una URL de imagen de Unsplash de alta calidad y resolución (fit=crop&w=800&q=80) que represente la portada de esta historia de viaje."
      }

      Importante:
      - Para la clave 'imagen' y cualquier imagen dentro de la 'narrativa', elige una foto real de Unsplash relacionada con el destino (ej. si es París usa 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80').
      - No agregues bloques de código markdown como \`\`\`json o \`\`\`. Solo el objeto JSON directo.`,
      prompt: `Crea una historia basada en el siguiente prompt del usuario: "${prompt}"`,
    });

    const cleanText = response.text.trim();
    
    // Función para sanitizar saltos de línea crudos dentro de las comillas en JSON
    const sanitizeJsonString = (str) => {
      return str.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, p1) => {
        return '"' + p1.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim() + '"';
      });
    };

    let parsedData;
    try {
      // Eliminar posibles envoltorios markdown si la IA no obedeció del todo
      const jsonString = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      const sanitized = sanitizeJsonString(jsonString);
      parsedData = JSON.parse(sanitized);
    } catch (err) {
      console.error("Error al parsear JSON devuelto por Groq:", cleanText);
      return Response.json({ success: false, error: "La IA no devolvió un JSON estructurado válido. Intenta reformular tu idea.", raw: cleanText }, { status: 500 });
    }

    return Response.json({ success: true, story: parsedData });

  } catch (error) {
    console.error("Error al generar historia:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
