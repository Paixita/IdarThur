"use client";

import Link from 'next/link';

export default function Benefits() {
  const steps = [
    {
      img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Explora y Compara',
      desc: 'Nuestro sistema inteligente analiza miles de opciones en segundos para mostrarte los mejores vuelos, hoteles y cruceros del mercado.',
      link: 'https://search.hotellook.com/?marker=729418'
    },
    {
      img: '/yessel_avatar.png',
      title: 'Asesoría con IA',
      desc: 'Natalia te acompaña en cada paso, recomendándote destinos, analizando precios y ayudándote a planificar el viaje perfecto.',
      link: '#chat'
    },
    {
      img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Viaja Equipado',
      desc: 'Desde la maleta perfecta hasta adaptadores universales. Compra en nuestra tienda integrada con las garantías de Amazon.',
      link: '/tienda'
    }
  ];

  const features = [
    { iconImg: '/icon_shield.png', title: 'Pagos 100% Seguros', desc: 'Transacciones protegidas por Booking.com y plataformas globales.', link: '/terminos' },
    { iconImg: '/icon_cashback.png', title: 'Cashback Directo', desc: 'Gana dinero de vuelta en tus reservas de vuelos con WayAway.', link: '/hoteles' },
    { iconImg: '/icon_globe.png', title: 'Soporte Mundial', desc: 'Red de asistencia internacional estés donde estés.', link: '/agentes' },
    { iconImg: '/icon_lightning.png', title: 'Reservas Rápidas', desc: 'Confirmación instantánea de hoteles y cruceros.', link: '/' }
  ];

  return (
    <section style={{ padding: '80px 20px', background: 'var(--background)' }}>
      <div className="container">
        
        {/* Cómo Funciona */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '20px' }}>Cómo Funciona <span className="text-gradient">IdarThur</span></h2>
          <p style={{ color: '#a0aab5', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 50px' }}>
            Tres pasos simples para el viaje de tus sueños, con el respaldo de la Inteligencia Artificial.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {steps.map((step, i) => {
              const CardContent = (
                <div className="glass step-card" style={{ padding: '40px 20px', borderRadius: '20px', textAlign: 'center', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s' }} 
                     onMouseEnter={e => {
                       e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(69, 243, 255, 0.15)';
                       e.currentTarget.querySelector('img').style.transform = 'scale(1.15) rotate(5deg)';
                     }} 
                     onMouseLeave={e => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = 'none';
                       e.currentTarget.querySelector('img').style.transform = 'scale(1) rotate(0deg)';
                     }}>
                  <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', padding: '4px', background: 'linear-gradient(45deg, var(--primary), var(--accent))' }}>
                      <img src={step.img} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transition: 'transform 0.5s', border: '3px solid #0f172a' }} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'white', transition: 'color 0.3s' }}>{step.title}</h3>
                  <p style={{ color: '#a0aab5', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              );

              if (step.link.startsWith('http')) {
                return <a key={i} href={step.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{CardContent}</a>;
              } else if (step.link === '#chat') {
                return <div key={i} onClick={() => window.dispatchEvent(new Event('openCandyChat'))} style={{ cursor: 'pointer', textDecoration: 'none' }}>{CardContent}</div>;
              } else {
                return <Link key={i} href={step.link} style={{ textDecoration: 'none' }}>{CardContent}</Link>;
              }
            })}
          </div>
        </div>

        {/* Por Qué Elegirnos */}
        <div style={{ background: 'linear-gradient(145deg, rgba(30,40,60,0.5) 0%, rgba(10,15,25,0.8) 100%)', borderRadius: '30px', padding: '60px 40px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>¿Por qué viajar con nosotros?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            {features.map((feat, i) => (
              <Link key={i} href={feat.link} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', padding: '15px', borderRadius: '20px', transition: 'background 0.3s, transform 0.3s' }}
                     onMouseEnter={e => {
                       e.currentTarget.style.background = 'rgba(69, 243, 255, 0.05)';
                       e.currentTarget.style.transform = 'translateX(10px)';
                     }}
                     onMouseLeave={e => {
                       e.currentTarget.style.background = 'transparent';
                       e.currentTarget.style.transform = 'translateX(0)';
                     }}>
                  <div style={{ padding: '5px', borderRadius: '15px', background: 'rgba(255,255,255,0.02)', boxShadow: '0 4px 15px rgba(0,212,255,0.1)' }}>
                    <img src={feat.iconImg} alt={feat.title} style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(69,243,255,0.5))' }} />
                  </div>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px', transition: 'color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'white'}>{feat.title}</h4>
                    <p style={{ color: '#a0aab5', fontSize: '0.95rem', lineHeight: '1.5' }}>{feat.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
