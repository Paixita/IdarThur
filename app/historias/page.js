"use client";
import Link from 'next/link';
import { useState } from 'react';
import { stories } from '../../data/historias';
import { playPremiumAudio } from '@/utils/playTts';

export default function HistoriasPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Bienvenido al rincón de las historias! Soy Candy. Aquí encontrarás relatos fascinantes de otros viajeros y anécdotas de nuestro equipo. Si tienes una historia increíble que contar, ¡compártela con nosotros! Quién sabe, tal vez seas el próximo protagonista.", sender: "ai" }
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
      const reply = "¡Qué interesante! Puedes enviarnos tus anécdotas al correo oficial de IdarThur. Nuestros agentes las leerán con gusto para crear la próxima aventura.";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speak(reply);
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
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>El Saludo de Candy AI (¡Tócame para hablar!)</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
            "¡Bienvenido al rincón de las historias! Soy Candy. Aquí encontrarás relatos fascinantes de otros viajeros y anécdotas de nuestro equipo. Si tienes una historia increíble que contar, ¡compártela con nosotros!"
          </p>
        </div>
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

      {/* Chat Modal Simulator para Candy */}
      {isChatOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid var(--accent)`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px rgba(255, 0, 128, 0.3)` }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Candy AI</h3>
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Especialista en Historias</span>
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
