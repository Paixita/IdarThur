"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function HotelesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola de nuevo! Soy Candy. ¿Buscas un hotel económico, un resort todo incluido o una villa frente al mar? Cuéntame y te paso los mejores alojamientos con Booking Genius.", sender: "ai" }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const speak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    
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

      {/* Sección High Ticket: Paquete Estilo Aviatur */}
      <div style={{ marginTop: '100px', background: 'rgba(10,15,25,0.7)', borderRadius: '30px', padding: '60px 40px', border: '1px solid rgba(69, 243, 255, 0.2)' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Escapada de Lujo a <span style={{ color: 'var(--primary)' }}>Dubai & Maldivas</span>
          </h2>
          <p style={{ color: '#a0aab5', fontSize: '1.1rem' }}>Disfruta del máximo confort, playas de arena blanca y rascacielos imponentes.</p>
        </div>

        {/* Galería Masonry (Ajustada para no superponerse) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '60px' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/10' }}>
            <img src="/hoteles/hotel_model_balcony_1780184051146.png" alt="Balcón Resort" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/hoteles/hotel_model_pool_1780184068485.png" alt="Piscina Infinita" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/hoteles/hotel_lobby_model_1780184080152.png" alt="Lobby Lujo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>

        {/* Contenido del Paquete y Tarjeta de Reserva */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 350px', gap: '40px', alignItems: 'start' }}>
          
          {/* Detalles Izquierda */}
          <div>
            <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '30px', overflowX: 'auto' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '2px solid var(--primary)', paddingBottom: '13px', cursor: 'pointer' }}>General</span>
              <span style={{ color: '#a0aab5', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color='#a0aab5'}>Incluye</span>
              <span style={{ color: '#a0aab5', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color='#a0aab5'}>Itinerario</span>
              <span style={{ color: '#a0aab5', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color='#a0aab5'}>Condiciones</span>
            </div>

            <div style={{ color: '#d1d5db', lineHeight: '1.8' }}>
              <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '15px', fontWeight: 'bold' }}>El paquete incluye:</h3>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Alojamiento:</strong> 03 noches en Resort Maldives, 03 noches en Hotel Dubai Center.</li>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Alimentación:</strong> Desayuno buffet diario y cena de bienvenida.</li>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Traslados:</strong> Aeropuerto / Hotel / Aeropuerto en vehículo privado.</li>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: 'var(--primary)' }}>✓</span> Tour panorámico por la ciudad con guía en español.</li>
              </ul>

              <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '15px', fontWeight: 'bold' }}>No incluye:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: '#ff4b4b' }}>✗</span> Tiquetes aéreos internacionales (puedes cotizarlos por separado en nuestro buscador).</li>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: '#ff4b4b' }}>✗</span> Seguro médico de viaje (obligatorio).</li>
                <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}><span style={{ color: '#ff4b4b' }}>✗</span> Propinas o gastos personales no especificados.</li>
              </ul>
            </div>
          </div>

          {/* Tarjeta de Reserva Derecha (Sticky) */}
          <div className="glass" style={{ position: 'sticky', top: '100px', padding: '30px', borderRadius: '20px', border: '1px solid rgba(69, 243, 255, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#a0aab5', marginBottom: '10px' }}>Precio desde</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>$1,250 <span style={{ fontSize: '1rem', color: '#a0aab5', fontWeight: 'normal' }}>USD</span></div>
            <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 'bold' }}>Por persona / 7 Días, 6 Noches</p>
            
            <button 
              onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')} 
              className="btn-primary" 
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
              Reservar Oferta
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <p style={{ textAlign: 'center', color: '#a0aab5', fontSize: '0.8rem' }}>*Tarifas sujetas a disponibilidad del proveedor</p>
          </div>

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
