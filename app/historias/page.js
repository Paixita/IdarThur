import Link from 'next/link';
import { stories } from '../../data/historias';

export default function HistoriasPage() {

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
