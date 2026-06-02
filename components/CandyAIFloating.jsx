"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { playPremiumAudio } from "@/utils/playTts";

export default function CandyAIFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const pathname = usePathname();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "¡Hola! Soy Candy. I speak English, 私は日本語を話します, Я говорю по-русски, و أتحدث العربية. ¿A dónde te gustaría viajar hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = async (text) => {
    if (typeof window === 'undefined') return;
    
    if (window.currentAudio) {
      window.stopAudioFlag = true;
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    
    try {
      await playPremiumAudio(cleanText, 'candy');
      setIsSpeaking(false);
    } catch (error) {
      console.log("Fallo TikTok TTS, usando fallback", error);
      // Fallback a nativa si la API de TikTok falla
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
      
      if (spanishVoices.length > 0) {
        const googleVoice = spanishVoices.find(v => v.name.includes('Google') && v.name.includes('español'));
        const femaleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer') || v.name.includes('Sabina') || v.name.includes('Monica'));
        utterance.voice = googleVoice || femaleVoice || spanishVoices[0];
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Reacción de voz a cambios de ruta
  useEffect(() => {
    if (audioEnabled) {
      if (pathname === '/hoteles') speak("Bienvenido a la sección de Hoteles. Te mostraré alojamientos increíbles con protección legal garantizada.");
      else if (pathname === '/tienda') speak("Bienvenido a la tienda IdarThur. Descubre artículos premium para tu viaje.");
      else if (pathname === '/') speak("Has vuelto a la pantalla principal. ¿A dónde viajamos hoy?");
      else if (pathname === '/eventos') speak("Bienvenido a la sección de Eventos Globales. Encuentra las mejores fiestas del mundo y reserva de inmediato.");
      else if (pathname === '/autos') speak("Bienvenido a Alquiler de Vehículos. Encuentra el auto perfecto para tu aventura con los mejores precios en más de ciento cincuenta países.");
      else if (pathname === '/historias') speak("Bienvenido a Historias. Inspírate con las aventuras reales de nuestra comunidad de viajeros y nómadas digitales alrededor del mundo.");
      else if (pathname === '/agentes') speak("Bienvenido al Cuartel General del Escuadrón I A. Conoce a nuestro equipo de inteligencia artificial, listo para protegerte y optimizar tu viaje.");
    }
  }, [pathname, audioEnabled]);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (!newState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = navigator.language || 'es-ES'; 
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => handleSendVoice(transcript), 800);
    };

    recognition.onerror = (event) => {
      console.error("Error de voz", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSendVoice = async (text) => {
    if (!text.trim()) return;
    setInput("");
    await processMessage(text);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput("");
    await processMessage(text);
  };

  const processMessage = async (text) => {
    // Desbloquear audio nativo con gesto de usuario
    if (typeof window !== 'undefined') {
      window.stopAudioFlag = false;
      const dummy = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      dummy.play().catch(()=>{});
    }

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      speak(data.reply); // Siempre habla cuando le preguntas directamente en el chat
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes candyBreathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes candySpeakPulse {
          0% { box-shadow: 0 0 10px var(--primary), 0 0 20px var(--accent); }
          50% { box-shadow: 0 0 30px var(--primary), 0 0 60px var(--accent); }
          100% { box-shadow: 0 0 10px var(--primary), 0 0 20px var(--accent); }
        }
        .candy-avatar-base {
          animation: candyBreathe 4s infinite ease-in-out;
        }
        .candy-speaking {
          animation: candySpeakPulse 1.2s infinite ease-in-out, candyBreathe 3s infinite ease-in-out !important;
          border-color: var(--primary) !important;
        }
      `}</style>
      {/* Botón Flotante para Activar Audio (Requisito de Navegadores) */}
      <div style={{ position: 'fixed', bottom: isOpen ? '650px' : '110px', right: '45px', zIndex: 9999, transition: 'bottom 0.3s' }}>
        <button 
          onClick={toggleAudio} 
          title={audioEnabled ? "Desactivar Voz de Candy" : "Activar Voz de Candy"}
          style={{ 
            background: audioEnabled ? 'var(--primary)' : 'rgba(0,0,0,0.6)', 
            border: audioEnabled ? 'none' : '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '50%', width: '45px', height: '45px', color: 'white', 
            cursor: 'pointer', boxShadow: audioEnabled ? '0 0 15px var(--primary)' : '0 5px 15px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', backdropFilter: 'blur(5px)', transition: 'all 0.3s'
          }}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className={`candy-avatar-base ${isSpeaking ? 'candy-speaking' : ''}`}
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
          <img src="/candy_avatar.png" alt="Candy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <div className={`candy-avatar-base ${isSpeaking ? 'candy-speaking' : ''}`} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', transition: 'all 0.3s' }}>
                <img src="/candy_avatar.png" alt="Candy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Candy AI</h3>
                <span style={{ fontSize: '0.8rem', color: '#45f3ff' }}>● Inteligencia Global Activa</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
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
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#45f3ff', fontStyle: 'italic', fontSize: '0.9rem' }}>Candy está procesando...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={startRecording}
                style={{ 
                  background: isRecording ? '#ff2a5f' : 'rgba(255,255,255,0.1)', 
                  border: 'none', width: '45px', height: '45px', borderRadius: '50%', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', transition: 'all 0.3s', flexShrink: 0,
                  boxShadow: isRecording ? '0 0 15px #ff2a5f' : 'none'
                }}
              >
                🎤
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "Escuchando..." : "Escribe tu destino..."} 
                style={{ flex: 1, padding: '12px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', fontSize: '0.95rem' }} 
              />
              <button type="submit" disabled={isLoading || !input.trim()} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: input.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
