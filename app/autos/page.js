"use client";
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { playPremiumAudio } from '@/utils/playTts';

export default function AutosPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola viajero! Soy Candy. ¿Necesitas moverte con libertad? Te recomiendo reservar tu vehículo con anticipación para asegurar los mejores precios. Recuerda que nuestros socios globales te ofrecen cancelación gratuita en la mayoría de reservas. ¿Qué tipo de auto buscas hoy?", sender: "ai" }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const speak = async (text) => {
    if (typeof window === 'undefined') return;
    if (window.currentAudio) {
      window.stopAudioFlag = true;
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    
    try {
      await playPremiumAudio(cleanText, 'candy');
    } catch (error) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
      if (spanishVoices.length > 0) {
        const googleVoice = spanishVoices.find(v => v.name.includes('Google') && v.name.includes('español'));
        const femaleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer') || v.name.includes('Sabina'));
        utterance.voice = googleVoice || femaleVoice || spanishVoices[0];
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setTimeout(() => speak(messages[0].text), 300);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    if (typeof window !== 'undefined') {
      window.stopAudioFlag = false;
      const dummy = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      dummy.play().catch(()=>{});
    }

    const newMessages = [...messages, { text: inputMsg, sender: 'user' }];
    setMessages(newMessages);
    setInputMsg('');

    setTimeout(() => {
      const reply = "¡Excelente elección! Busca en nuestro panel para ver las opciones con cobertura completa. ¿Te puedo ayudar en algo más?";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speak(reply);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1a', color: 'white' }}>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
        
        {/* Cabecera con Video de Llaves */}
        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', padding: '100px 20px', borderRadius: '30px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}>
            <video autoPlay loop muted playsInline poster="/autos/banner.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/autos/video_autos.mp4?v=2" type="video/mp4" />
            </video>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(10,15,25,0.2) 0%, rgba(10,15,25,0.6) 100%)', zIndex: -1 }}></div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
            Alquiler de <span className="text-gradient">Vehículos</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Muévete con total libertad. Recibe las llaves de tu vehículo ideal con los mejores precios garantizados en más de 150 países.
          </p>
        </div>

        {/* Buscador de Vehículos Glassmorphism */}
        <div className="glass" style={{ padding: '30px', borderRadius: '30px', marginBottom: '60px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
          <input type="text" placeholder="Lugar de Recogida (Ej: Aeropuerto Miami)" style={{
            flex: '1 1 250px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s'
          }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
          
          <input type="text" placeholder="Lugar de Entrega (Opcional)" style={{
            flex: '1 1 200px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s'
          }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
          
          <input type="date" title="Fecha de Recogida" style={{
            flex: '1 1 150px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
          }} />
          
          <input type="date" title="Fecha de Entrega" style={{
            flex: '1 1 150px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
          }} />
          
          <button onClick={() => window.open('https://www.discovercars.com/?a_aid=IdarThur', '_blank')} className="btn-primary" style={{ padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Buscar Vehículos
          </button>
        </div>

        {/* Candy AI Recomendación */}
        <div 
          className="glass" 
          style={{ padding: '30px', borderRadius: '25px', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '25px', background: 'linear-gradient(135deg, rgba(69,243,255,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(69, 243, 255, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={handleOpenChat}
        >
          <div className="icon-glow" style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 128, 0.4))' }}>
             <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>Candy AI Asistente de Rentas (¡Tócame para hablar!)</h3>
            <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
              "Te recomiendo siempre tomar la Cobertura Total al momento de reservar. Es un poco más costosa, pero te ahorra dolores de cabeza si el vehículo sufre algún rayón o daño menor. ¡Así viajas sin preocupaciones!"
            </p>
          </div>
        </div>

        {/* Galería de Clases de Vehículos */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Nuestras Clases de Vehículos</h2>
            <p style={{ color: '#a0aab5', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Trabajamos con Códigos ACRISS universales. Selecciona tu clase ideal y nuestras agencias asociadas te garantizarán el vehículo que necesitas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {[
              { id: 'economy', name: 'Clase Económica / Compacta', desc: 'Ideal para la ciudad y fácil de estacionar.', img: '/autos/class_economy.png', color: '#ff0055' },
              { id: 'suv', name: 'Clase Familiar / SUV', desc: 'Espacio y comodidad para toda la familia.', img: '/autos/class_suv.png', color: '#ff9900' },
              { id: 'sedan', name: 'Clase Estándar / Sedán', desc: 'Confort y buen rendimiento para viajes largos.', img: '/autos/class_sedan.png', color: '#00d4ff' },
              { id: 'premium', name: 'Clase Premium / Lujo', desc: 'Para viajes de negocios o experiencias exclusivas.', img: '/autos/class_premium.png', color: '#ffd700' }
            ].map(cat => (
              <div key={cat.id} className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 15px 40px ${cat.color}30`; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', background: 'linear-gradient(to top, rgba(10,15,25,1), transparent)' }}></div>
                  <h3 style={{ position: 'absolute', bottom: '15px', left: '20px', fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>
                    {cat.name}
                  </h3>
                </div>
                
                <div style={{ padding: '25px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px' }}>
                    {cat.desc}
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <p style={{ color: '#a0aab5', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '15px', textAlign: 'center' }}>
                      *Modelos sujetos a disponibilidad en destino
                    </p>
                    <button onClick={() => window.open('https://www.discovercars.com/?a_aid=IdarThur', '_blank')} 
                            style={{ width: '100%', padding: '12px', borderRadius: '15px', background: `${cat.color}20`, border: `1px solid ${cat.color}`, color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.background = cat.color}
                            onMouseLeave={e => e.currentTarget.style.background = `${cat.color}20`}>
                      Ver Opciones
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Modal Simulator para Candy */}
        {isChatOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid var(--accent)`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px rgba(255, 0, 128, 0.3)` }}>
              
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
                <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Candy AI</h3>
                  <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Especialista en Transporte</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                  ×
                </button>
              </div>

              <div style={{ padding: '20px', height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ 
                      background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                      color: 'white', padding: '12px 18px', borderRadius: '20px', 
                      borderBottomRightRadius: msg.sender === 'user' ? '5px' : '20px',
                      borderBottomLeftRadius: msg.sender === 'ai' ? '5px' : '20px',
                      lineHeight: '1.5', fontSize: '0.95rem'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  placeholder={`Pregúntale a Candy...`} 
                  style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', outline: 'none' }}
                />
                <button type="submit" style={{ background: 'var(--accent)', border: 'none', borderRadius: '15px', padding: '0 20px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  Enviar
                </button>
              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
