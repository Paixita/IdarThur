"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import ChatMessage from './ChatMessage';
import PremiumAudioModal from './PremiumAudioModal';
import { playAlvaroAudio, stopAlvaroAudio } from '@/utils/playAlvaro';
import { useVipAudio } from '@/hooks/useVipAudio';
import config from '@/data/config.json';

export default function YesselFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `¡Hola! Soy Yessel, el conserje principal de ${config.brandName}. Estoy aquí para conseguirte las mejores tarifas no publicadas. ¿A dónde te gustaría viajar hoy?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [isAudioPremium, setIsAudioPremium] = useVipAudio();
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  const processMessage = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, browserLanguage: navigator.language, messages: [...messages, userMessage].slice(-12) })
      });
      const data = await res.json();
      if (!res.ok || typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Respuesta no disponible');
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, language: data.language }]);
      if (isAudioPremium) {
        playAlvaroAudio(data.reply, { language: data.language });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  }, [isAudioPremium, messages]);

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Evento para abrir el chat desde botones externos
  useEffect(() => {
    const handleOpenChat = (e) => {
      setIsOpen(true);
      const initialMessage = e.detail?.message;
      if (initialMessage) {
        processMessage(initialMessage);
      } else if (isAudioPremium) {
        playAlvaroAudio(messages[0].content);
      }
    };
    window.addEventListener('openCandyChat', handleOpenChat); // Mantenemos el nombre del evento para no romper dependencias
    return () => window.removeEventListener('openCandyChat', handleOpenChat);
  }, [isAudioPremium, messages, processMessage]);

  // Escucha del servidor WebSocket de TikTok Live
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ws;
    let disposed = false;
    let reconnectTimer;
    const connectWS = () => {
      if (disposed) return;
      ws = new WebSocket('ws://localhost:3002');
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'chat') {
            // Abrir el chat automáticamente si estaba cerrado
            setIsOpen(true);
            // Agregar el mensaje del usuario y la respuesta de Yessel al chat de la UI
            setMessages(prev => [
              ...prev, 
              { role: 'user', content: `[TikTok @${data.username}]: ${data.comment}` },
              { role: 'assistant', content: data.reply, language: data.language }
            ]);
            // Reproducir la voz si la cuenta tiene el audio premium activado
            if (isAudioPremium) {
              playAlvaroAudio(data.reply, { language: data.language });
            }
          }
        } catch (e) {
          console.error('[TikTok WS Msg Error]', e);
        }
      };
      
      ws.onclose = () => {
        // Intentar reconectar cada 5 segundos si el servidor local de TikTok se apaga
        if (!disposed) reconnectTimer = setTimeout(connectWS, 5000);
      };
      
      ws.onerror = () => {
        ws.close();
      };
    };
    
    connectWS();
    
    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [isAudioPremium]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const text = input;
    
    if (text.trim() === '/yessel-audio') {
      setIsAudioPremium(true);
      setInput('');
      setMessages(prev => [...prev, { role: 'assistant', content: '✅ ¡Voz VIP de Yessel desbloqueada con éxito! Ahora te hablaré de forma natural.' }]);
      return;
    }

    setInput("");
    await processMessage(text);
  };



  return (
    <>
      <style>{`
        @keyframes candyBreathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .candy-avatar-base {
          animation: candyBreathe 4s infinite ease-in-out;
        }
      `}</style>

      {!isOpen && (
        <div 
          onClick={() => {
            setIsOpen(true);
            if (isAudioPremium) {
              playAlvaroAudio(messages[0].content);
            }
          }}
          className={`candy-avatar-base`}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', width: '70px', height: '70px',
            borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            cursor: 'pointer', zIndex: 9999, boxShadow: '0 10px 30px rgba(255, 42, 95, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.2)', transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {isOpen && (
        <div className="glass" style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '90%', maxWidth: '380px', height: '600px', maxHeight: '80vh',
          zIndex: 9999, display: 'flex', flexDirection: 'column', borderRadius: '25px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)',
          overflow: 'hidden', background: 'rgba(11, 12, 16, 0.95)'
        }}>
          <div style={{ padding: '20px', background: 'rgba(255, 42, 95, 0.1)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className={`candy-avatar-base`} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', transition: 'all 0.3s' }}>
                <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Yessel</h3>
                <span style={{ fontSize: '0.8rem', color: '#45f3ff' }}>● Conserje VIP Online</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={() => {
                  if (isAudioPremium) {
                    playAlvaroAudio("Hola, mi voz VIP está activada. Dime en qué te ayudo.");
                  } else {
                    setIsAudioModalOpen(true);
                  }
                }} 
                style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${isAudioPremium ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, borderRadius: '50%', width: '35px', height: '35px', color: isAudioPremium ? 'var(--primary)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                title="Voz de Yessel"
              >
                {isAudioPremium ? '🔊' : '🔈'}
              </button>
              <button onClick={() => { setIsOpen(false); stopAlvaroAudio(); }} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? '#0b0c10' : '#fff',
                padding: '12px 16px', borderRadius: '20px', maxWidth: '85%',
                fontSize: '0.95rem', lineHeight: '1.4',
                borderBottomRightRadius: msg.role === 'user' ? '5px' : '20px',
                borderTopLeftRadius: msg.role === 'assistant' ? '5px' : '20px',
              }}><ChatMessage language={msg.language} text={msg.content} assistant={msg.role === 'assistant'} /></div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#45f3ff', fontStyle: 'italic', fontSize: '0.9rem' }}>Yessel está escribiendo...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '8px', lineHeight: '1.2' }}>
              🤖 Estás chateando con un asistente de Inteligencia Artificial (Yessel AI) conforme al Reglamento de IA de la UE.
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"Escribe a Yessel..."} 
                style={{ flex: 1, padding: '12px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', fontSize: '0.95rem' }} 
              />
              <button type="submit" disabled={isLoading || !input.trim()} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: input.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
      
      <PremiumAudioModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} onSuccess={() => setIsAudioPremium(true)} />
    </>
  )
}
