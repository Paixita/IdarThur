"use client";
import Link from 'next/link';
import { useState } from 'react';
import { stories } from '../../data/historias';
import PremiumAudioModal from '@/components/PremiumAudioModal';
import { playAlvaroAudio, stopAlvaroAudio } from '@/utils/playAlvaro';
import { useVipAudio } from '@/hooks/useVipAudio';

export default function HistoriasClient() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy Yessel Cronista, tu redactor y curador de historias de viaje. Cuéntame una anécdota y te ayudaré a adaptarla de forma cinematográfica para publicarla en nuestro portal.", sender: "ai" }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAudioPremium, setIsAudioPremium] = useVipAudio();
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Estados del generador de historias con IA
  const [promptIA, setPromptIA] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');

  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (isAudioPremium) {
      playAlvaroAudio(messages[0].text);
    }
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
      const reply = "¡Esa historia suena fantástica! Me encantaría redactarla con un estilo cinematográfico e ilustrarla. Para comenzar a trabajar en ella y coordinar la publicación, regálame tu **WhatsApp** o **Correo Electrónico**.";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      if (isAudioPremium) playAlvaroAudio(reply);
    }, 1500);
  };

  // Generar historia usando la API de Groq
  const handleGenerateStory = async (e) => {
    e.preventDefault();
    if (!promptIA.trim()) return;

    setIsGenerating(true);
    setGeneratedStory(null);
    setPublishStatus('');

    try {
      const res = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptIA })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedStory(data.story);
      } else {
        setPublishStatus(`❌ Error al generar: ${data.error}`);
      }
    } catch (err) {
      setPublishStatus(`❌ Error de red: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Publicar historia (Someter a local + GitHub)
  const handlePublishStory = async () => {
    if (!generatedStory) return;

    setIsPublishing(true);
    setPublishStatus('Sincronizando con base de datos e iniciando commit a GitHub...');

    try {
      const res = await fetch('/api/stories/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedStory)
      });
      const data = await res.json();
      if (data.success) {
        setPublishStatus(`✅ ¡Publicado! ${data.message}`);
        // Recargar página después de un momento si fue exitoso
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setPublishStatus(`❌ Error al publicar: ${data.error}`);
      }
    } catch (err) {
      setPublishStatus(`❌ Error al enviar commit: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
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

      {/* Yessel Cronista Recomendación */}
      <div 
        className="glass" 
        style={{ padding: '30px', borderRadius: '25px', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '25px', background: 'linear-gradient(135deg, rgba(0,255,170,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(0,255,170,0.2)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 170, 0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={handleOpenChat}
      >
        <div className="icon-glow" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 170, 0.4))' }}>
           <img src="/agentes/yessel_cronista.png" alt="Yessel Cronista" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00ffaa' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: '#00ffaa', fontWeight: 'bold' }}>Yessel Cronista (Redacción e Ilustración)</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.1rem', fontStyle: 'italic' }}>
            "¡Hola! Soy Yessel Cronista, del Escuadrón IA. Estoy aquí para convertir tus anécdotas de viajes en relatos cinematográficos e ilustrados. Haz clic aquí para chatear conmigo o usa el generador interactivo abajo para redactar y publicar historias en la web al instante."
          </p>
        </div>
      </div>

      {/* Redactor Asistido por IA */}
      <div className="glass" style={{ padding: '40px', borderRadius: '30px', marginBottom: '80px', border: '1px solid rgba(0, 255, 170, 0.3)', background: 'linear-gradient(180deg, rgba(10,15,25,0.8), rgba(0,255,170,0.03))' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#00ffaa' }}>
          🪄 Redactor e Ilustrador de Historias IA
        </h2>
        <p style={{ color: '#a0aab5', textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
          Ingresa una idea de viaje o anécdota. Yessel Cronista redactará la crónica y seleccionará la ilustración perfecta. Luego podrás publicarla en producción a través de GitHub Commit.
        </p>

        <form onSubmit={handleGenerateStory} style={{ display: 'flex', gap: '15px', maxWidth: '800px', margin: '0 auto 30px' }}>
          <input 
            type="text" 
            placeholder="Ej: Un divertido viaje a Roma con mi perro Tom en el año 2026..." 
            value={promptIA}
            onChange={e => setPromptIA(e.target.value)}
            required
            disabled={isGenerating || isPublishing}
            style={{
              flex: 1, padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
            }}
          />
          <button 
            type="submit" 
            disabled={isGenerating || isPublishing} 
            className="btn-primary" 
            style={{ padding: '15px 30px', borderRadius: '15px', background: 'linear-gradient(135deg, #00ffaa, #0088ff)', border: 'none', color: '#0b0c10', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isGenerating ? 'Escribiendo...' : 'Redactar con IA'}
          </button>
        </form>

        {/* Preview Story area */}
        {generatedStory && (
          <div style={{ maxWidth: '800px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'white', textAlign: 'center' }}>Vista Previa de la Crónica Generada</h3>
            
            <div className="glass" style={{ padding: '30px', borderRadius: '20px', marginBottom: '30px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                <span style={{ color: '#00ffaa', fontWeight: 'bold' }}>{generatedStory.personajes}</span>
                <span style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '10px' }}>{generatedStory.categoria}</span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>{generatedStory.titulo}</h4>
              <p style={{ color: '#00ffaa', fontSize: '1.1rem', marginBottom: '20px', fontStyle: 'italic' }}>{generatedStory.subtitulo}</p>
              
              <div style={{ borderRadius: '15px', overflow: 'hidden', marginBottom: '25px', maxHeight: '300px' }}>
                <img src={generatedStory.imagen} alt="Ilustración" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div 
                style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1.05rem' }} 
                dangerouslySetInnerHTML={{ __html: generatedStory.narrativa }} 
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handlePublishStory}
                disabled={isPublishing}
                className="btn-primary" 
                style={{ padding: '15px 40px', borderRadius: '15px', fontSize: '1.15rem' }}
              >
                {isPublishing ? 'Publicando...' : '🚀 Publicar en la Web (GitHub Commit)'}
              </button>
            </div>
          </div>
        )}

        {publishStatus && (
          <div style={{ maxWidth: '800px', margin: '20px auto 0', padding: '15px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db', textAlign: 'center', fontWeight: '500' }}>
            {publishStatus}
          </div>
        )}
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

      {/* Chat Modal Simulator para Yessel Cronista */}
      {isChatOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid #00ffaa`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px rgba(0, 255, 170, 0.3)` }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/agentes/yessel_cronista.png" alt="Yessel Cronista" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid #00ffaa` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Yessel Cronista</h3>
                <span style={{ color: '#00ffaa', fontSize: '0.85rem' }}>Especialista en Historias</span>
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
                <button onClick={() => { setIsChatOpen(false); stopAlvaroAudio(); }} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
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
                placeholder={`Escribe a Yessel Cronista...`} 
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
