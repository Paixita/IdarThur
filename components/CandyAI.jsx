"use client";
import Link from 'next/link';

export default function CandyAI() {
  return (
    <section id="candy" className="container" style={{ margin: '100px auto' }}>
      <div className="glass" style={{ padding: '50px', display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Lado Izquierdo: Avatar y Presentación */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div onClick={() => window.dispatchEvent(new Event('openCandyChat'))} style={{ width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', background: 'var(--glass-bg)', border: '4px solid rgba(255, 42, 95, 0.3)', marginBottom: '30px', transition: 'transform 0.4s, box-shadow 0.4s', cursor: 'pointer' }}
               onMouseEnter={e => {
                 e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 42, 95, 0.4)';
               }}
               onMouseLeave={e => {
                 e.currentTarget.style.transform = 'scale(1) translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
             <img src="/candy_avatar.png" alt="Candy AI Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Lado Derecho: Descripción */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '15px' }}>Tu Asistente <span style={{ color: '#ff2a5f' }}>Global</span></h2>
          <p style={{ color: '#a0aab5', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Candy no solo organiza tus vuelos y hoteles, sino que también cuida de tu salud. Ahora, Candy te acompaña en <strong>cada página</strong> de IdarThur y domina los idiomas del mundo (Asiático, Árabe, Ruso, Polaco, etc.).
          </p>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontStyle: 'italic', color: '#45f3ff', fontSize: '1.1rem' }}>
              "Haz clic en el botón flotante en la esquina inferior derecha para hablar conmigo. ¡Puedes usar el micrófono!" 🎤
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
