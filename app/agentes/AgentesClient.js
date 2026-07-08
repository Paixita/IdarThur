"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import PremiumAudioModal from '@/components/PremiumAudioModal';
import { playAlvaroAudio, stopAlvaroAudio } from '@/utils/playAlvaro';
import { useVipAudio } from '@/hooks/useVipAudio';

export default function AgentesClient() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAudioPremium, setIsAudioPremium] = useVipAudio();
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isCandyChatOpen, setIsCandyChatOpen] = useState(false);
  const [candyMessages, setCandyMessages] = useState([
    { text: "Bienvenidos a IdarThur, el sitio donde aquí podrás escoger tus viajes con, de aerolíneas y también tus cruceros; de confianza, tus hoteles con tranquilidad para que puedas dormir tranquilo y sentirte renovado para seguir en tu tour, lo demás también tenemos Si quieres aparte de seleccionar y escoger automóviles dentro del plan de tu tour. No solamente tenemos eso sino que también podemos recomendarte implementos que vas a necesitar en el transcurso del viaje, aún para tus mascotas que tanto amas; para que te sientas cómodo y cómoda, y placentero; está bien te encontrarás con el sitio de las noticias por si de pronto deseas viajar a uno de esos sitios a los cuales están siempre actualizados; Y tenemos las dos últimas secciones donde encontrarás historias de pasajeros o hasta de los mismos pilotos reales que vivieron ellos en sus vuelos o en el lugar de su tour, y en la última sección te encontrarás con el agente Yessel, quién está listo para guiarte si necesitas alguna sugerencia para tu salud y puedas viajar con el conocimiento de lo que necesitas para tu viaje y tu regreso, solo dentro y conocerás más cosas de las cuales están listas para ti Gracias por visitarnos en IdarThur, tu casa segura para tus viajes.", sender: "ai" }
  ]);
  const [candyInputMsg, setCandyInputMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isCandyLoading, setIsCandyLoading] = useState(false);

  const chatEndRef = useRef(null);
  const candyChatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (candyChatEndRef.current) {
      candyChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [candyMessages, isCandyLoading]);

  const agents = [
    {
      id: "vitalis",
      name: "Dr. Yessel (Salud)",
      role: "Agente Médico de Viajes",
      color: "#00d4ff",
      img: "/agentes/yessel_medico.png",
      skills: ["Vacunación Global", "Emergencias", "Seguros Médicos"],
      desc: "Especialista en salud internacional. Analiza tu destino para recomendarte las vacunas obligatorias, restricciones locales y hospitales cercanos.",
      isPrivate: false,
      greeting: "¡Hola! Soy el Dr. Yessel. ¿A dónde planeas viajar? Cuéntame y te ayudo a revisar qué precauciones médicas necesitas."
    },
    {
      id: "nicolas",
      name: "Yessel Ventas",
      role: "Asistente de Compras",
      color: "#ff9900",
      img: "/agentes/yessel_ventas.png",
      skills: ["Comparación de Precios", "Gadgets de Viaje", "Equipaje Inteligente"],
      desc: "Tu personal shopper. Escanea tiendas online 24/7 buscando el equipamiento perfecto para tu clima y destino.",
      isPrivate: false,
      greeting: "¡Hola! Soy Yessel. ¿Buscando maletas o ropa para tu viaje? Dime a dónde vas y te busco las mejores opciones."
    },
    {
      id: "altamar",
      name: "Capitán Yessel",
      role: "Especialista en Cruceros",
      color: "#ffd700",
      img: "/agentes/yessel_capitan.png",
      skills: ["Rutas del Caribe", "Camarotes de Lujo", "Todo Incluido"],
      desc: "Tiene acceso a la base de datos maestra de las navieras. Te consigue mejoras gratuitas de cabina y ofertas exclusivas.",
      isPrivate: false,
      greeting: "¡Ahoy, marinero! Soy el Capitán Yessel. ¿Listo para surcar los mares? Dime qué ruta te interesa."
    },
    {
      id: "cronista",
      name: "Yessel Cronista",
      role: "Cronista y Creadora de Historias",
      color: "#00ffaa",
      img: "/agentes/yessel_cronista.png",
      skills: ["Escritura Creativa", "Ilustración Generativa", "Curación de Relatos"],
      desc: "Especialista en recopilar y redactar las mejores anécdotas de viajes. Diseña ilustraciones hiperrealistas para cada relato y actualiza la bitácora de la comunidad.",
      isPrivate: false,
      greeting: "¡Hola! Soy Yessel Cronista. ¿Tienes alguna aventura o anécdota increíble que quieras que redacte y publique en nuestra bitácora?"
    },
    {
      id: "cyberguard",
      name: "Natalia CyberGuard",
      role: "Oficial de Ciberseguridad",
      color: "#ff0055",
      img: "/agentes/natalia_cyberguard.jpg",
      skills: ["Anti-Phishing", "Pagos Encriptados", "Auditoría de Enlaces"],
      desc: "Tu guardaespaldas digital. Bloquea fraudes y garantiza que tus transacciones sean 100% blindadas.",
      isPrivate: true
    }
  ];

  const handleConnect = (agent) => {
    if (agent.isPrivate) return;
    setActiveChat(agent);
    setMessages([{ text: agent.greeting, sender: 'ai' }]);
    if (isAudioPremium) {
      playAlvaroAudio(agent.greeting);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || isLoading) return;

    const userMessage = inputMsg.trim();

    if (userMessage === '/yessel-audio') {
      setIsAudioPremium(true);
      setInputMsg('');
      setMessages(prev => [...prev, { text: '✅ ¡Voz VIP de Yessel desbloqueada con éxito!', sender: 'ai' }]);
      return;
    }

    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agentId: activeChat.id
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const reply = data.reply || "Lo siento, no pude obtener respuesta.";

      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      if (isAudioPremium) playAlvaroAudio(reply);
    } catch (error) {
      console.error("Error calling Chat API:", error);
      setMessages([...newMessages, { text: "Lo siento, tuve un problema al conectarme con mi cerebro. Intenta de nuevo.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };



  const handleOpenCandyChat = () => {
    setIsCandyChatOpen(true);
    if (isAudioPremium) {
      playAlvaroAudio("Bienvenidos a IdarThur, el sitio donde aquí podrás escoger tus viajes con, de aerolíneas y también tus cruceros; de confianza, tus hoteles con tranquilidad para que puedas dormir tranquilo y sentirte renovado para seguir en tu tour, lo demás también tenemos Si quieres aparte de seleccionar y escoger automóviles dentro del plan de tu tour. No solamente tenemos eso sino que también podemos recomendarte implementos que vas a necesitar en el transcurso del viaje, aún para tus mascotas que tanto amas; para que te sientas cómodo y cómoda, y placentero; está bien te encontrarás con el sitio de las noticias por si de pronto deseas viajar a uno de esos sitios a los cuales están siempre actualizados; Y tenemos las dos últimas secciones donde encontrarás historias de pasajeros o hasta de los mismos pilotos reales que vivieron ellos en sus vuelos o en el lugar de su tour, y en la última sección te encontrarás con el agente Yessel, quién está listo para guiarte si necesitas alguna sugerencia para tu salud y puedas viajar con el conocimiento de lo que necesitas para tu viaje y tu regreso, solo dentro y conocerás más cosas de las cuales están listas para ti Gracias por visitarnos en IdarThur, tu casa segura para tus viajes.");
    }
  };

  const handleSendCandyMessage = async (e) => {
    e.preventDefault();
    if (!candyInputMsg.trim() || isCandyLoading) return;

    const userMessage = candyInputMsg.trim();

    if (userMessage === '/yessel-audio') {
      setIsAudioPremium(true);
      setCandyInputMsg('');
      setCandyMessages(prev => [...prev, { text: '✅ ¡Voz VIP de Yessel desbloqueada con éxito!', sender: 'ai' }]);
      return;
    }

    const newMessages = [...candyMessages, { text: userMessage, sender: 'user' }];
    setCandyMessages(newMessages);
    setCandyInputMsg('');
    setIsCandyLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agentId: 'default'
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const reply = data.reply || "Lo siento, no pude obtener respuesta.";

      setCandyMessages([...newMessages, { text: reply, sender: 'ai' }]);
      if (isAudioPremium) playAlvaroAudio(reply);
    } catch (error) {
      console.error("Error calling Chat API:", error);
      setCandyMessages([...newMessages, { text: "Lo siento, tuve un problema al conectarme con mi cerebro. Intenta de nuevo.", sender: 'ai' }]);
    } finally {
      setIsCandyLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px', position: 'relative' }} className="container">
      
      {/* Banner del Equipo */}
      <div style={{ marginBottom: '50px', borderRadius: '30px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
        <video autoPlay loop muted playsInline poster="/agentes/banner.png" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <source src="/agentes/video_agentes.mp4?v=1" type="video/mp4" />
        </video>
        {/* Gradiente sutil para integrar con el fondo */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, rgba(10,15,26,1), transparent)' }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          El Escuadrón <span className="text-gradient">IdarThur IA</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', marginBottom: '40px' }}>
          No estás solo. Detrás de cada reserva, un equipo de especialistas de Inteligencia Artificial audita, protege y optimiza cada detalle de tu viaje. Conoce a tu equipo de élite.
        </p>

        {/* Yessel Recomendación */}
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
             <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>Yessel (Director de Operaciones)</h3>
            <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
              "Bienvenidos a IdarThur, el sitio donde aquí podrás escoger tus viajes con, de aerolíneas y también tus cruceros; de confianza, tus hoteles con tranquilidad para que puedas dormir tranquilo y sentirte renovado para seguir en tu tour, lo demás también tenemos Si quieres aparte de seleccionar y escoger automóviles dentro del plan de tu tour. No solamente tenemos eso sino que también podemos recomendarte implementos que vas a necesitar en el transcurso del viaje, aún para tus mascotas que tanto amas; para que te sientas cómodo y cómoda, y placentero; está bien te encontrarás con el sitio de las noticias por si de pronto deseas viajar a uno de esos sitios a los cuales están siempre actualizados; Y tenemos las dos últimas secciones donde encontrarás historias de pasajeros o hasta de los mismos pilotos reales que vivieron ellos en sus vuelos o en el lugar de su tour, y en la última sección te encontrarás con el agente Yessel, quién está listo para guiarte si necesitas alguna sugerencia para tu salud y puedas viajar con el conocimiento de lo que necesitas para tu viaje y tu regreso, solo dentro y conocerás más cosas de las cuales están listas para ti Gracias por visitarnos en IdarThur, tu casa segura para tus viajes."
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => {
                    if (isAudioPremium) playAlvaroAudio(`Hola, mi voz VIP está activada como ${activeChat.name}. Dime en qué te ayudo.`);
                    else setIsAudioModalOpen(true);
                  }} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${isAudioPremium ? activeChat.color : 'rgba(255,255,255,0.2)'}`, borderRadius: '50%', width: '35px', height: '35px', color: isAudioPremium ? activeChat.color : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isAudioPremium ? '🔊' : '🔈'}
                </button>
                <button onClick={() => { setActiveChat(null); stopAlvaroAudio(); }} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                  ×
                </button>
              </div>
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
              {isLoading && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    color: '#a0aab5', padding: '12px 18px', borderRadius: '20px', 
                    borderBottomLeftRadius: '5px',
                    lineHeight: '1.5', fontSize: '0.95rem',
                    fontStyle: 'italic'
                  }}>
                    Escribiendo...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder={isLoading ? "Pensando..." : `Escribe a ${activeChat.name}...`} 
                disabled={isLoading}
                style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', outline: 'none', opacity: isLoading ? 0.6 : 1 }}
              />
              <button type="submit" disabled={isLoading} style={{ background: isLoading ? '#555' : activeChat.color, border: 'none', borderRadius: '15px', padding: '0 20px', color: isLoading ? '#888' : '#000', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? '...' : 'Enviar'}
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
              <img src="/yessel_avatar.png" alt="Yessel" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Yessel</h3>
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Directora de Operaciones</span>
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
                <button onClick={() => { setIsCandyChatOpen(false); stopAlvaroAudio(); }} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                  ×
                </button>
              </div>
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
              {isCandyLoading && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    color: '#a0aab5', padding: '12px 18px', borderRadius: '20px', 
                    borderBottomLeftRadius: '5px',
                    lineHeight: '1.5', fontSize: '0.95rem',
                    fontStyle: 'italic'
                  }}>
                    Escribiendo...
                  </div>
                </div>
              )}
              <div ref={candyChatEndRef} />
            </div>

            <form onSubmit={handleSendCandyMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={candyInputMsg}
                onChange={e => setCandyInputMsg(e.target.value)}
                placeholder={isCandyLoading ? "Pensando..." : `Escribe a Yessel...`} 
                disabled={isCandyLoading}
                style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', outline: 'none', opacity: isCandyLoading ? 0.6 : 1 }}
              />
              <button type="submit" disabled={isCandyLoading} style={{ background: isCandyLoading ? '#555' : 'var(--accent)', border: 'none', borderRadius: '15px', padding: '0 20px', color: '#fff', fontWeight: 'bold', cursor: isCandyLoading ? 'not-allowed' : 'pointer' }}>
                {isCandyLoading ? '...' : 'Enviar'}
              </button>
            </form>

          </div>
        </div>
      )}

      <PremiumAudioModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} onSuccess={() => setIsAudioPremium(true)} />
    </main>
  );
}
