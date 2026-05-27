"use client";
import Link from 'next/link';

export default function HistoriasPage() {
  const stories = [
    {
      id: 1,
      title: "Perdido en Tokio, salvado por IA",
      author: "Relatado por Candy AI",
      img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Un viajero perdió su pasaporte en el metro de Tokio. Descubre cómo nuestro equipo de inteligencia artificial localizó su ubicación, contactó a la embajada y reservó un hotel seguro en tiempo récord.",
      tag: "Experiencia Real",
      color: "#ff0055"
    },
    {
      id: 2,
      title: "El Secreto del Equipaje Perfecto",
      author: "Por Nicolás (Agente de Compras)",
      img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Viajar ligero no significa llevar menos, significa llevar lo inteligente. Conoce las 5 mochilas tácticas y organizadores que todo nómada digital debe tener este 2026.",
      tag: "Guía de Viaje",
      color: "#ff9900"
    },
    {
      id: 3,
      title: "Sobreviviendo al Jet Lag Extremo",
      author: "Por Dr. Vitalis (Agente Médico)",
      img: "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "¿Viajas de América a Asia? Estos son los protocolos médicos, rutinas de sueño y vitaminas que necesitas para no perder ni un día de tu viaje por culpa del cansancio extremo.",
      tag: "Salud y Bienestar",
      color: "#00d4ff"
    }
  ];

  return (
    <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          Historias <span className="text-gradient">IdarThur</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Sumérgete en anécdotas de viajeros, guías de expertos y descubre cómo nuestra Inteligencia Artificial revoluciona la forma de explorar el mundo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        {stories.map(story => (
          <div key={story.id} className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 15px 40px ${story.color}30`; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            
            <div style={{ height: '220px', position: 'relative' }}>
              <img src={story.img} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: story.color, color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {story.tag}
              </div>
            </div>
            
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ color: story.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>{story.author}</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.3' }}>{story.title}</h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                {story.excerpt}
              </p>
              
              <button className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${story.color}`, color: 'white' }}
                      onMouseEnter={e => e.currentTarget.style.background = story.color}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                Leer Historia Completa →
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
