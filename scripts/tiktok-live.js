// scripts/tiktok-live.js - Conector gratuito de Yessel para transmisiones de TikTok Live
const { WebcastPushConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

// Nombre de usuario de la cuenta de TikTok que transmite (pasado por argumento o por defecto)
const tiktokUsername = process.argv[2] || 'idarthur';

console.log(`[Yessel TikTok Bridge] Iniciando puente para usuario: @${tiktokUsername}`);

// Servidor WebSocket en puerto 3002
const wss = new WebSocketServer({ port: 3002 });
let activeClients = [];

wss.on('connection', (ws) => {
  console.log('[WebSocket] Cliente del navegador (Next.js) conectado.');
  activeClients.push(ws);
  
  ws.on('close', () => {
    activeClients = activeClients.filter(c => c !== ws);
    console.log('[WebSocket] Cliente del navegador desconectado.');
  });
});

const broadcast = (data) => {
  const payload = JSON.stringify(data);
  activeClients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  });
};

// Crear la conexión hacia TikTok Live
const tiktokConnection = new WebcastPushConnection(tiktokUsername);

console.log('[TikTok Live] Conectando al directo de TikTok...');
tiktokConnection.connect()
  .then(state => {
    console.log(`[TikTok Live] Conectado exitosamente. Room ID: ${state.roomId}`);
    console.log(`[TikTok Live] Escuchando comentarios en tiempo real de @${tiktokUsername}...`);
  })
  .catch(err => {
    console.warn(`[TikTok Live] Advertencia de conexión: ${err.message}`);
    console.warn('[TikTok Live] Nota: Asegúrate de que la cuenta esté transmitiendo EN VIVO para que la conexión sea exitosa.');
  });

// Escuchar comentarios del chat
tiktokConnection.on('chat', async (data) => {
  const { uniqueId, comment } = data;
  console.log(`[Chat Recibido] @${uniqueId}: "${comment}"`);
  
  // Ignorar comandos del sistema del chat o mensajes vacíos
  if (!comment || comment.trim() === '') return;

  try {
    // Consultar el cerebro de Yessel a través del endpoint local
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: comment,
        agentId: 'default' // Usar conserje principal
      })
    });
    
    if (!res.ok) {
      throw new Error(`Chat API responded with status ${res.status}`);
    }
    
    const chatData = await res.json();
    const reply = chatData.reply || '';
    
    console.log(`[Yessel Respuesta] -> "${reply.substring(0, 80)}..."`);
    
    // Transmitir al navegador mediante WebSocket para pintar en el chat y hablar por audio
    broadcast({
      event: 'chat',
      username: uniqueId,
      comment: comment,
      reply: reply
    });
  } catch (error) {
    console.error('[Error de Procesamiento Yessel]', error.message);
  }
});

// Manejo de desconexión y reintento
tiktokConnection.on('disconnected', () => {
  console.log('[TikTok Live] Conexión cerrada. Intentando reconectar en 10 segundos...');
  setTimeout(() => {
    tiktokConnection.connect().catch(e => console.error('[TikTok Live] Fallo al reconectar:', e.message));
  }, 10000);
});
