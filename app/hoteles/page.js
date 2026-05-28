"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function HotelesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola de nuevo! Soy Candy. ¿Buscas un hotel económico, un resort todo incluido o una villa frente al mar? Cuéntame y te paso los mejores alojamientos con Booking Genius.", sender: "ai" }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const speak = async (text) => {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, agentId: 'candy' })
      });
      if (!res.ok) throw new Error('Error al generar la voz');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      window.currentAudio = audio;
      audio.play();
    } catch (error) {
      console.error('Error al reproducir audio de VoiceRSS:', error);
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setTimeout(() => speak(messages[0].text), 300);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMessages = [...messages, { text: inputMsg, sender: 'user' }];
    setMessages(newMessages);
    setInputMsg('');

    setTimeout(() => {
      const reply = "¡Entendido! Acabo de filtrar las mejores opciones con Booking. Te sugiero mirar los hoteles de 4 y 5 estrellas porque esta semana tienen descuentos por temporada. ¿Te abro la búsqueda oficial?";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speak(reply);
    }, 1500);
  };
  return (
    <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          Alojamientos <span className="text-gradient">Premium</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Descansa como la realeza. Encuentra los mejores hoteles, resorts y villas con tarifas exclusivas garantizadas por IdarThur y protegidas contra imprevistos.
        </p>
      </div>

      {/* Buscador de Hoteles Glassmorphism */}
      <div className="glass" style={{ padding: '30px', borderRadius: '30px', marginBottom: '60px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
        <input type="text" placeholder="¿A dónde viajas? (Ej: Roma)" style={{
          flex: '1 1 200px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s'
        }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
        
        <input type="date" style={{
          flex: '1 1 150px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
        }} />
        
        <input type="date" style={{
          flex: '1 1 150px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
        }} />
        
        <select style={{
          flex: '1 1 150px', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem'
        }}>
          <option value="1" style={{color: 'black'}}>1 Huésped</option>
          <option value="2" style={{color: 'black'}}>2 Huéspedes</option>
          <option value="3" style={{color: 'black'}}>3 Huéspedes</option>
          <option value="4" style={{color: 'black'}}>4+ Huéspedes</option>
        </select>
        
        <button onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Buscar Hoteles
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
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>El Consejo de Candy AI (¡Tócame para hablar!)</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
            "Siempre te recomendaré hoteles cerca del transporte público principal o aeropuertos. Es más seguro para ti, te ahorra dinero en taxis y optimiza tu tiempo. Además, recuerda que gestionamos las reservas a través de nuestros aliados para garantizar tu tranquilidad financiera. ¡Tú solo relájate y disfruta la cama!"
          </p>
        </div>
      </div>

      {/* Destinos Destacados */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Favoritos de la <span style={{ color: 'var(--primary)' }}>Comunidad</span></h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {[
          { id: 1, city: "París, Francia", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "1,240 Ofertas Disponibles" },
          { id: 2, city: "Tokio, Japón", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "850 Ofertas Premium" },
          { id: 3, city: "Kioto, Japón", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "340 Ryokans Exclusivos" },
          { id: 4, city: "Shanghái, China", img: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "590 Hoteles con Vista" },
          { id: 5, city: "Bali, Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "890 Villas con Piscina" },
          { id: 6, city: "Hong Kong", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "410 Ofertas Premium" },
          { id: 7, city: "Dubái, EAU", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "530 Resorts 5 Estrellas" },
          { id: 8, city: "Londres, Reino Unido", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "670 Ofertas Disponibles" },
          { id: 9, city: "Nueva York, EE. UU.", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "920 Ofertas Premium" },
          { id: 10, city: "Cancún, México", img: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", deals: "430 Resorts Todo Incluido" }
        ].map(dest => (
          <div key={dest.id} className="glass" style={{ borderRadius: '25px', overflow: 'hidden', position: 'relative', height: '350px', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }} 
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(69,243,255,0.2)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
               onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              <img src={dest.img} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.5', transition: 'opacity 0.4s' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', zIndex: 2, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>{dest.city}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{dest.deals}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección High Ticket: Cruceros */}
      <div style={{ marginTop: '100px', background: 'linear-gradient(135deg, rgba(10,15,25,0.95) 0%, rgba(15,25,40,0.95) 100%)', borderRadius: '30px', padding: '60px 40px', border: '1px solid rgba(255,215,0,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 60%)', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Experiencia High Ticket</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginTop: '20px', color: 'white' }}>Cruceros de <span style={{ color: '#ffd700' }}>Lujo</span></h2>
          <p style={{ color: '#a0aab5', fontSize: '1.2rem', maxWidth: '600px', margin: '20px auto 0', lineHeight: '1.6' }}>
            Navega por el Caribe, el Mediterráneo o los Fiordos Noruegos con todo incluido. Comisiones internacionales con respaldo total.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', position: 'relative', zIndex: 1 }}>
          {[
            { title: "Caribe Royal", price: "Desde $1,299", desc: "7 noches desde Miami. Todo incluido.", img: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { title: "Mediterráneo Épico", price: "Desde $2,450", desc: "10 noches Italia, Grecia y España.", img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { title: "Glaciares de Alaska", price: "Desde $1,890", desc: "Expedición de 7 noches en cabina balcón.", img: "https://images.unsplash.com/photo-1570776718536-cb7217db8350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
          ].map((cruise, i) => (
            <div key={i} className="glass" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,215,0,0.15)' }}>
              <img src={cruise.img} alt={cruise.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>{cruise.title}</h3>
                <p style={{ color: '#a0aab5', fontSize: '0.95rem', marginBottom: '20px' }}>{cruise.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>{cruise.price}</span>
                  <button onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '20px', background: 'linear-gradient(45deg, #d4af37, #ffd700)', color: 'black' }}>Cotizar</button>
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
            
            {/* Chat Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
              <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--accent)` }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Candy AI</h3>
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Especialista en Alojamientos</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
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
