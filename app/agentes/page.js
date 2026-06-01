"use client";
import Link from 'next/link';
import { useState } from 'react';
import { playPremiumAudio } from '@/utils/playTts';

export default function AgentesPage() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  const agents = [
    {
      id: "vitalis",
      name: "Dra. Vitalis",
      role: "Agente Médico de Viajes",
      color: "#00d4ff",
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      skills: ["Vacunación Global", "Emergencias", "Seguros Médicos"],
      desc: "Especialista en salud internacional. Analiza tu destino para recomendarte las vacunas obligatorias, restricciones de salud locales y los mejores hospitales cercanos a tu hotel.",
      isPrivate: false,
      greeting: "¡Hola! Qué gusto saludarte. Soy la Dra. Vitalis. ¿Ya tienes pensado a dónde vas a viajar? Cuéntame y te ayudo a revisar qué vacunas o precauciones médicas necesitas para que viajes con total tranquilidad."
    },
    {
      id: "nicolas",
      name: "Nicolás",
      role: "Asistente de Compras",
      color: "#ff9900",
      img: "/agentes/nicolas.png",
      skills: ["Comparación de Precios", "Gadgets de Viaje", "Equipaje Inteligente"],
      desc: "Tu personal shopper. Escanea tiendas online 24/7 buscando el equipamiento perfecto para tu clima y destino. Garantiza que siempre compres al precio más bajo.",
      isPrivate: false,
      greeting: "¡Hola, hola! Soy Nicolás. ¿Qué andamos buscando hoy? ¿Una buena maleta que aguante todo, un adaptador o ropita térmica? Dime a dónde vas y te busco las mejores opciones y precios."
    },
    {
      id: "altamar",
      name: "Capitán Altamar",
      role: "Especialista en Cruceros",
      color: "#ffd700",
      img: "/agentes/altamar.png",
      skills: ["Rutas del Caribe", "Camarotes de Lujo", "Todo Incluido"],
      desc: "Tiene acceso a la base de datos maestra de las navieras. Te avisa antes que nadie de nuevas aperturas de cruceros y te consigue mejoras gratuitas de cabina.",
      isPrivate: true
    },
    {
      id: "cyberguard",
      name: "CyberGuard",
      role: "Oficial de Ciberseguridad",
      color: "#ff0055",
      img: "/agentes/cyberguard.png",
      skills: ["Anti-Phishing", "Pagos Encriptados", "Auditoría de Enlaces"],
      desc: "Tu guardaespaldas digital. Bloquea fraudes, te alerta si recibes correos falsos a nombre de agencias y garantiza que tus transacciones con tarjeta sean 100% blindadas.",
      isPrivate: true
    }
  ];

  const speak = async (text, overrideAgentId = null) => {
    if (typeof window === 'undefined') return;
    if (window.currentAudio) {
      window.stopAudioFlag = true;
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    const targetAgentId = overrideAgentId || activeChat?.id;
    
    try {
      await playPremiumAudio(cleanText, targetAgentId);
    } catch (error) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      
      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
      
      if (spanishVoices.length > 0) {
        const googleVoice = spanishVoices.find(v => v.name.includes('Google') && v.name.includes('español'));
        
        if (targetAgentId === 'nicolas') {
          utterance.pitch = 0.9;
          utterance.rate = 1.0;
          const maleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre') || v.name.includes('Jorge') || v.name.includes('Pablo'));
          utterance.voice = maleVoice || spanishVoices[0];
        } else {
          utterance.pitch = 1.1;
          utterance.rate = 1.05;
          const femaleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer') || v.name.includes('Sabina'));
          utterance.voice = googleVoice || femaleVoice || spanishVoices[0];
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConnect = (agent) => {
    if (agent.isPrivate) return;
    setActiveChat(agent);
    setMessages([{ text: agent.greeting, sender: 'ai' }]);
    setTimeout(() => speak(agent.greeting, agent.id), 300);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    if (typeof window !== 'undefined') {
      window.stopAudioFlag = false;
      const dummy = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      dummy.play().catch(()=>{});
    }

    // Add user message
    const newMessages = [...messages, { text: inputMsg, sender: 'user' }];
    setMessages(newMessages);
    setInputMsg('');

    // Simulate AI response based on agent
    setTimeout(() => {
      let reply = "Dame un segundito que lo reviso...";
      if (activeChat.id === 'vitalis') {
        reply = "¡Hola corazón! Aquí estoy para cuidarte. Para ese viaje te recomiendo llevar un repelente fuerte y tu vacuna al día. Y por favor, si tienes alguna pregunta más íntima o personal sobre tu salud en el viaje, siéntete con total confianza de preguntarme. Estamos en privado, ¿sí?";
      } else if (activeChat.id === 'nicolas') {
        reply = "¡Excelente elección! Acabo de hacer una búsqueda rápida y hay unas mochilas antirrobo súper en tendencia hoy con buen descuento. ¿Te paso el link para que las veas?";
      }
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speak(reply);
    }, 1500);
  };

  const [isCandyChatOpen, setIsCandyChatOpen] = useState(false);
  const [candyMessages, setCandyMessages] = useState([
    { text: "¡Hola! Estás en el centro de mando. Soy Candy, la líder de atención, pero aquí puedes conocer a todo mi equipo especializado. Desde Nicolás para tus compras hasta el Capitán Altamar para tus cruceros. Estamos diseñados para hacer que tu viaje sea absolutamente perfecto.", sender: "ai" }
  ]);
  const [candyInputMsg, setCandyInputMsg] = useState('');

  const speakCandy = async (text) => {
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

  const handleOpenCandyChat = () => {
    setIsCandyChatOpen(true);
    setTimeout(() => speakCandy(candyMessages[0].text), 300);
  };

  const handleSendCandyMessage = (e) => {
    e.preventDefault();
    if (!candyInputMsg.trim()) return;

    if (typeof window !== 'undefined') {
      window.stopAudioFlag = false;
      const dummy = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      dummy.play().catch(()=>{});
    }

    const newMessages = [...candyMessages, { text: candyInputMsg, sender: 'user' }];
    setCandyMessages(newMessages);
    setCandyInputMsg('');

    setTimeout(() => {
      const reply = "¡Claro que sí! Cada uno de nuestros agentes está entrenado en una rama distinta para ofrecerte el mejor servicio. ¿Quieres que te conecte con alguno en especial?";
      setCandyMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speakCandy(reply);
    }, 1500);
  };

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px', position: 'relative' }} className="container">
      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          El Escuadrón <span className="text-gradient">IdarThur IA</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', marginBottom: '40px' }}>
          No estás solo. Detrás de cada reserva, un equipo de especialistas de Inteligencia Artificial audita, protege y optimiza cada detalle de tu viaje. Conoce a tu equipo de élite.
        </p>

        {/* Candy AI Recomendación */}
        <div 
          className="glass" 
          style={{ padding: '30px', borderRadius: '25px', maxWidth: '900px', margin: '0 auto 60px', display: 'flex', alignItems: 'center', gap: '25px', background: 'linear-gradient(135deg, rgba(69,243,255,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', textAlign: 'left' }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(69, 243, 255, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={handleOpenCandyChat}
        >
          <div className="icon-glow" style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 128, 0.4))' }}>
             <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>Candy AI (Directora de Operaciones)</h3>
            <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
              "¡Hola! Estás en el centro de mando. Soy Candy, la líder de atención. Conoce a todo mi equipo especializado aquí abajo. Estamos diseñados para hacer que tu viaje sea absolutamente perfecto."
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {agents.map(agent => (
          <div key={agent.id} className="glass" style={{ borderRadius: '25px', overflow: 'hidden', border: `1px solid ${agent.color}40`, transition: 'transform 0.4s, box-shadow 0.4s' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 15px 40px ${agent.color}30`; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            
            <div style={{ height: '250px', position: 'relative' }}>
              <img src={agent.img} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(10,15,25,1), transparent)' }}></div>
              <h2 style={{ position: 'absolute', bottom: '15px', left: '20px', fontSize: '2rem', fontWeight: 'bold', color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                {agent.name}
              </h2>
            </div>
            
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 250px)' }}>
              <h4 style={{ color: agent.color, fontSize: '1.1rem', marginBottom: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {agent.role}
              </h4>
              <p style={{ color: '#a0aab5', fontSize: '1rem', lineHeight: '1.6', marginBottom: '25px' }}>
                {agent.desc}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 'auto', marginBottom: '20px' }}>
                {agent.skills.map((skill, i) => (
                  <span key={i} style={{ padding: '6px 12px', background: `${agent.color}15`, border: `1px solid ${agent.color}40`, borderRadius: '15px', fontSize: '0.85rem', color: 'white' }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Chat Connect Button */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center' }}>
                 <button 
                   onClick={() => handleConnect(agent)}
                   style={{ 
                     width: '100%', padding: '12px', borderRadius: '15px', 
                     background: agent.isPrivate ? `${agent.color}20` : `${agent.color}30`, 
                     border: `1px solid ${agent.color}`, color: agent.isPrivate ? agent.color : '#fff', fontWeight: 'bold', fontSize: '1rem', 
                     cursor: agent.isPrivate ? 'not-allowed' : 'pointer', opacity: agent.isPrivate ? '0.7' : '1',
                     transition: 'background 0.3s'
                   }}
                   onMouseEnter={e => { if(!agent.isPrivate) e.currentTarget.style.background = agent.color }}
                   onMouseLeave={e => { if(!agent.isPrivate) e.currentTarget.style.background = `${agent.color}30` }}
                 >
                   {agent.isPrivate ? '🔒 Acceso Restringido (Admin)' : '💬 Iniciar Diagnóstico'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '80px', padding: '40px', background: 'rgba(255,0,85,0.05)', borderRadius: '20px', border: '1px dashed #ff005550' }}>
         <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>¿Intento de Fraude?</h3>
         <p style={{ color: '#a0aab5', maxWidth: '600px', margin: '0 auto 25px' }}>
           Si recibiste un correo sospechoso pidiendo pagos a nombre de IdarThur, envíalo a nuestro equipo inmediatamente. CyberGuard auditará el enlace y bloqueará al atacante.
         </p>
         <button className="btn-primary" style={{ background: 'linear-gradient(45deg, #ff0055, #cc0044)', border: 'none', padding: '12px 30px', borderRadius: '20px', fontWeight: 'bold' }}>
           Reportar con CyberGuard
         </button>
      </div>

      {/* Chat Modal Simulator */}
      {activeChat && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid ${activeChat.color}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px ${activeChat.color}30` }}>
            
            {/* Chat Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src={activeChat.img} alt={activeChat.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${activeChat.color}` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>{activeChat.name}</h3>
                <span style={{ color: activeChat.color, fontSize: '0.85rem' }}>{activeChat.role}</span>
              </div>
              <button onClick={() => setActiveChat(null)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                ×
              </button>
            </div>

            {/* Chat Body */}
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

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder={`Escribe a ${activeChat.name}...`} 
                style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', outline: 'none' }}
              />
              <button type="submit" style={{ background: activeChat.color, border: 'none', borderRadius: '15px', padding: '0 20px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                Enviar
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Candy Chat Modal Simulator */}
      {isCandyChatOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: '#0a0f19', borderRadius: '25px', border: `1px solid var(--accent)`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 0 50px rgba(255, 0, 128, 0.3)` }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Candy AI</h3>
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Directora de Operaciones</span>
              </div>
              <button onClick={() => setIsCandyChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                ×
              </button>
            </div>

            <div style={{ padding: '20px', height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {candyMessages.map((msg, i) => (
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

            <form onSubmit={handleSendCandyMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={candyInputMsg}
                onChange={e => setCandyInputMsg(e.target.value)}
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
  );
}
