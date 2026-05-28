"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function TiendaPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy Candy, tu IA protectora. ¿Dudas sobre qué comprar para tu viaje? ¡Pregúntame!", sender: "ai" }
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
      const reply = "¡Buena pregunta! Basado en tu destino, te súper recomiendo la Mochila Antirrobo y nuestro botiquín premium. ¿Te muestro los enlaces de Amazon con descuento?";
      setMessages([...newMessages, { text: reply, sender: 'ai' }]);
      speak(reply);
    }, 1500);
  };
  const products = [
    { 
      id: 1, name: "Cámara de Seguridad", price: "$44.99", img: "/store_camera.png", category: "Tecnología", affiliateLink: "https://amzn.to/4ulMw3w", 
      copy: "Mantén un ojo en lo que más importa mientras viajas por el mundo. Instalación en 5 minutos, visión nocturna 2K y alertas directas a tu celular." 
    },
    { 
      id: 2, name: "Chaqueta para Hombre", price: "$119.99", img: "/store_jacket.png", category: "Ropa Hombre", affiliateLink: "https://amzn.to/42MlRJi", 
      copy: "Desafía las montañas y la nieve sin perder el estilo. Confección térmica premium y bolsillos tácticos para mantener todo seguro y seco." 
    },
    { 
      id: 3, name: "Chaqueta para Mujer", price: "$62.03", img: "/store_jacket_woman.png", category: "Ropa Mujer", affiliateLink: "https://amzn.to/3RkMt9l", 
      copy: "Elegancia y máxima protección. Un cortavientos especializado con ajuste perfecto, forro térmico y diseño ligero ideal para llevar en la maleta." 
    },
    { 
      id: 4, name: "Botiquín de Viaje", price: "$29.99", img: "/store_firstaid.png", category: "Salud y Bienestar", affiliateLink: "https://amzn.to/4nDwNu2", 
      copy: "Tu seguro de vida en formato portátil. Completamente equipado para atender emergencias rápidas en la selva, la playa o el hotel." 
    },
    { 
      id: 5, name: "Mochila Antirrobo Unisex", price: "$51.98", img: "/store_backpack.png", category: "Accesorios Viaje", affiliateLink: "https://amzn.to/4uSoHA8", 
      copy: "Camina por Europa sin miedo a los carteristas. Cierres totalmente ocultos, diseño ergonómico y puerto USB integrado para tu powerbank." 
    }
  ];

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }} className="container">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          La Gran Tienda <span className="text-gradient">IdarThur</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Todo lo que necesitas para tu próxima aventura, probado en batalla y garantizado por las reseñas de miles de viajeros.
        </p>
      </div>

      {/* Módulo de Candy Vendedora */}
      <div 
        className="glass" 
        style={{ padding: '30px', borderRadius: '25px', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '25px', background: 'linear-gradient(135deg, rgba(69,243,255,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 0, 128, 0.2)';
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
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>Candy AI Recomienda (¡Tócame para hablar!)</h3>
          <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', fontStyle: 'italic' }}>
            "¡Hola viajer@! He procesado los datos climáticos y las tendencias de seguridad global. Si vas a ciudades muy turísticas, te exijo (como tu IA protectora) que lleves la <strong style={{color: 'var(--primary)'}}>Mochila Antirrobo</strong>. Y si vas a lugares de clima extremo, ¡no salgas sin una de nuestras chaquetas térmicas! He verificado estos proveedores en Amazon y tienen calificación perfecta."
          </p>
        </div>
      </div>

      {/* Catálogo de Productos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '35px' }}>
        {products.map(p => (
          <div key={p.id} className="glass product-card" style={{ padding: '35px', borderRadius: '25px', display: 'flex', flexDirection: 'column', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div className="icon-glow" style={{ textAlign: 'center', marginBottom: '25px' }}>
               <img src={p.img} alt={p.name} style={{ width: '150px', height: '150px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))', borderRadius: '15px' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: 'bold' }}>{p.name}</h3>
            
            <span style={{ display: 'inline-block', padding: '6px 15px', background: 'rgba(69, 243, 255, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '20px', width: 'fit-content', fontWeight: '600' }}>
              {p.category}
            </span>
            
            <p style={{ color: '#a0aab5', fontSize: '1rem', marginBottom: '30px', flexGrow: 1, lineHeight: '1.6' }}>
              {p.copy}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{p.price}</span>
              <a href={p.affiliateLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '12px 25px', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                Comprar en Amazon
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Sección de Tarjetas de Regalo (Gift Cards) */}
      <div style={{ marginTop: '100px', background: 'linear-gradient(135deg, rgba(30,40,60,0.8) 0%, rgba(10,15,25,0.9) 100%)', borderRadius: '30px', padding: '60px 40px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Regalo" 
               style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--primary)', filter: 'drop-shadow(0 0 20px rgba(69, 243, 255, 0.4))', transition: 'transform 0.4s, filter 0.4s', cursor: 'pointer' }}
               onMouseEnter={e => {
                 e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                 e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(69, 243, 255, 0.8))';
               }}
               onMouseLeave={e => {
                 e.currentTarget.style.transform = 'scale(1) rotate(0)';
                 e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(69, 243, 255, 0.4))';
               }}
          />
        </div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Tarjetas de Regalo <span className="text-gradient">IdarThur</span></h2>
        <p style={{ color: '#a0aab5', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          El regalo perfecto para bodas, cumpleaños o aniversarios. Regala el mundo entero con nuestras Gift Cards corporativas. Válidas para cruceros, vuelos y hoteles.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['$50', '$100', '$500', '$1000'].map((amount, i) => (
            <div key={i} className="glass" style={{ padding: '20px 40px', borderRadius: '15px', border: '1px solid var(--primary)', cursor: 'pointer', transition: 'transform 0.3s, background 0.3s', background: 'rgba(69,243,255,0.05)' }} 
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)';
                   e.currentTarget.style.background = 'rgba(69,243,255,0.15)';
                 }} 
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = 'scale(1) translateY(0)';
                   e.currentTarget.style.background = 'rgba(69,243,255,0.05)';
                 }}>
              <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{amount}</h3>
              <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Gift Card</span>
            </div>
          ))}
        </div>
        
        <button className="btn-primary" style={{ marginTop: '40px', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Comprar Tarjeta de Regalo
        </button>
        
        {/* Programa de Fidelidad / Regalías */}
        <div style={{ marginTop: '60px', padding: '30px', background: 'rgba(255,215,0,0.05)', borderRadius: '20px', border: '1px dashed rgba(255,215,0,0.3)', maxWidth: '800px', margin: '60px auto 0' }}>
          <h3 style={{ color: '#ffd700', fontSize: '1.5rem', marginBottom: '15px', fontWeight: 'bold' }}>⭐ Programa de Fidelidad IdarThur</h3>
          <p style={{ color: '#e5e7eb', lineHeight: '1.6', fontSize: '1.05rem' }}>
            Premiamos tu lealtad. A partir del <strong>1 de Julio</strong>, todos los clientes fieles que reserven con frecuencia a través de nuestra plataforma participarán automáticamente en nuestro <strong>Sorteo de Regalías</strong>.
            <br/><br/>
            Anunciaremos ganadores mensuales de Gift Cards de <strong>$50, $100 y hasta $500</strong> para gastar en su próximo viaje. ¡Entre más viajes con IdarThur, más oportunidades tienes de ganar!
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '80px' }}>
         <Link href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem' }}>
           ← Regresar al Buscador de Vuelos
         </Link>
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
                <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Personal Shopper e IA Protectora</span>
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
