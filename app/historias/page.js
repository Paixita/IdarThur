"use client";
import Link from 'next/link';
import { useState } from 'react';
import { stories } from '../../data/historias';
import PremiumAudioModal from '@/components/PremiumAudioModal';
import { playAlvaroAudio } from '@/utils/playAlvaro';
import { useVipAudio } from '@/hooks/useVipAudio';

export default function HistoriasPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Bienvenido al rincón de las historias! Soy Yessel. Aquí encontrarás relatos fascinantes de otros viajeros y anécdotas de nuestro equipo. Si tienes una historia increíble que contar, ¡compártela con nosotros!", sender: "ai" }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAudioPremium, setIsAudioPremium] = useVipAudio();
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    if (inputMsg.trim() === '/yessel-audio') {
      setIsAudioPremium(true);
      setInputMsg('');
      setMessages(prev => [...prev, { text: '✅ ¡Voz VIP de Yessel desbloqueada con éxito!', sender: 'ai' }]);
      return;
    }

    const newMessages = [...messages, { text: inputMsg, sender: 'user' }];
    setMessages(newMessages);
    setInputMsg('');

    setTimeout(() => {
      const reply = "¡Qué interesante! Nos encantaría conocer más de tu historia y de paso darte beneficios VIP. Regálame tu **WhatsApp** o **Correo Electrónico** para contactarte y darte acceso a tarifas ocultas exclusivas.";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      if (isAudioPremium) playAlvaroAudio(reply);
    }, 1500);
  };

  return (
    <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          Historias <span className="text-gradient">IdarThur</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Sumérgete en anécdotas de viajeros generadas e ilustradas 100% por nuestra Inteligencia Artificial.
        </p>
      </div>

      {/* Yessel Recomendación */}
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
           <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>El Saludo de Yessel</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
            "¡Bienvenido al rincón de las historias! Soy Yessel. Haz clic aquí y cuéntame si tienes una anécdota increíble de viaje que quieras compartir."
          </p>
        </div>
      </div>

      {/* Formulario Comparte tu Historia */}
      <div className="glass" style={{ padding: '40px', borderRadius: '30px', marginBottom: '80px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>¿Tienes una historia que contar?</h2>
        <p style={{ color: '#a0aab5', textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
          Cuéntanos tu mejor o peor anécdota de viaje. Nuestro equipo la adaptará con un toque cinematográfico y la ilustrará para nuestra galería. ¡Podrías ser el próximo protagonista!
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por compartir! Nuestro Escuadrón IA revisará tu historia pronto.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <input type="text" placeholder="Tu Nombre o Apodo (Ej: El Mochilero Anónimo)" required style={{
              padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s'
            }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
            
            <input type="text" placeholder="Título de tu anécdota" required style={{
              padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s'
            }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
          </div>
          
          <textarea placeholder="Escribe aquí tu historia completa. Dale todos los detalles divertidos, dramáticos o increíbles..." required rows="6" style={{
            padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s', resize: 'vertical'
          }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}></textarea>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0aab5', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" required style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
            Autorizo a IdarThur y su Inteligencia Artificial a adaptar y publicar mi historia (mantendremos tu identidad real en secreto si usas un apodo).
          </label>

          <button type="submit" className="btn-primary" style={{ padding: '15px 40px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center', marginTop: '10px' }}>
            Enviar al Escuadrón IA
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        {stories.map((story, idx) => {
          const color = ['#ff0055', '#ff9900', '#00d4ff', '#00ffaa'][idx % 4];
          return (
            <Link href={`/historias/${story.id}`} key={story.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass story-card" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={story.imagen} alt={story.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: color, color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {story.ano || "2026"}
                  </div>
                </div>
                
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: color, fontWeight: 'bold', fontSize: '0.9rem' }}>{story.personajes}</span>
                    <span style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>{story.categoria || 'Viajes'}</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.3' }}>{story.titulo}</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                    {story.subtitulo}
                  </p>
                  
                  <div className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}`, color: 'white', textAlign: 'center' }}>
                    Leer Historia Completa →
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Chat Modal Simulator para Yessel */}
      {isChatOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid var(--accent)`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px rgba(255, 0, 128, 0.3)` }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Yessel</h3>
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Especialista en Historias</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => {
                    if (isAudioPremium) playAlvaroAudio("Hola, mi voz VIP está activada. Dime en qué te ayudo.");
                    else setIsAudioModalOpen(true);
                  }} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${isAudioPremium ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, borderRadius: '50%', width: '35px', height: '35px', color: isAudioPremium ? 'var(--primary)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isAudioPremium ? '🔊' : '🔈'}
                </button>
                <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                  ×
                </button>
              </div>
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
                placeholder={`Escribe a Yessel...`} 
                style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', outline: 'none' }}
              />
              <button type="submit" style={{ background: 'var(--accent)', border: 'none', borderRadius: '15px', padding: '0 20px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                Enviar
              </button>
            </form>

          </div>
        </div>
      )}

      <PremiumAudioModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} onSuccess={() => setIsAudioPremium(true)} />
      <style>{`
        .story-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .story-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(255,255,255,0.1);
        }
        .story-card:hover .btn-primary {
          background: rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </main>
  );
}
