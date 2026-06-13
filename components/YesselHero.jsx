"use client";
import Link from "next/link";

export default function YesselHero() {
  return (
    <section className="container" style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
      <div className="glass" style={{ borderRadius: '30px', padding: '50px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', background: 'linear-gradient(135deg, rgba(69,243,255,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Avatar Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
          <div onClick={() => window.dispatchEvent(new Event('openCandyChat'))} style={{ width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', background: 'var(--glass-bg)', border: '4px solid rgba(69, 243, 255, 0.3)', marginBottom: '30px', transition: 'transform 0.4s, box-shadow 0.4s', cursor: 'pointer' }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 20px 40px rgba(69, 243, 255, 0.4)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'scale(1) translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
          >
             <img src="/yessel_avatar.png" alt="Yessel VIP Concierge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Text Section */}
        <div style={{ flex: '2 1 500px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
            Conoce a <span className="text-gradient">Yessel</span>,<br/>Tu Conserje VIP Online.
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#a0aab5', lineHeight: '1.7', marginBottom: '30px' }}>
            Yessel no solo organiza tus vuelos y hoteles, sino que también cuida de cada detalle de tu viaje. Con acceso a tarifas no publicadas y conexión directa con navieras y aerolíneas, Yessel garantiza que siempre consigas el trato de un cliente VIP.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.dispatchEvent(new Event('openCandyChat'))}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span>💬</span> Hablar con Yessel
            </button>
            <Link href="/agentes" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🛡️</span> Conocer a todo el equipo
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
