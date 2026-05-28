import { NextResponse } from 'next/server';
import { Communicate } from 'edge-tts-universal';

export const runtime = 'edge'; // Obliga a Next.js a compilar para Cloudflare

export async function POST(req) {
  try {
    const { text, agentId } = await req.json();
    
    // Configuración por defecto (Candy)
    let voiceId = 'es-CO-SalomeNeural'; 

    // Personalidad de voces según el agente
    if (agentId === 'nicolas') {
      voiceId = 'es-MX-JorgeNeural'; 
    } else if (agentId === 'vitalis') {
      voiceId = 'es-MX-DaliaNeural'; 
    }

    // Usamos el cliente universal que funciona en memoria sin disco duro
    const communicate = new Communicate(text, voiceId);
    let audioChunks = [];
    
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio') {
        audioChunks.push(chunk.data);
      }
    }

    // Juntamos los pedazos de audio en un solo buffer
    const totalLength = audioChunks.reduce((acc, val) => acc + val.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (let chunk of audioChunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('Error TTS Edge Universal:', error);
    return NextResponse.json({ error: 'Fallo al generar el audio en memoria' }, { status: 500 });
  }
}
