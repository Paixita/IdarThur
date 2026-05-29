import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function generateStaticParams() {
  const dataDir = path.join(process.cwd(), 'data', 'historias');
  if (!fs.existsSync(dataDir)) return [];
  
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  return files.map(file => ({
    id: file.replace('.json', '')
  }));
}

export default async function HistoriaDetalle({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const filePath = path.join(process.cwd(), 'data', 'historias', `${id}.json`);
  
  let story = null;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    story = JSON.parse(content);
  }

  if (!story) {
    return (
      <main className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '100vh' }}>
        <h1>Historia no encontrada</h1>
        <Link href="/historias" style={{ color: '#00d4ff' }}>Volver a las historias</Link>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header Imagen */}
      <div style={{ width: '100%', height: '60vh', position: 'relative', overflow: 'hidden' }}>
        <img src={story.imagen} alt={story.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '50px 20px', background: 'linear-gradient(transparent, #0b1120)' }}>
          <div className="container">
            <Link href="/historias" style={{ color: '#a0aab5', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
              ← Volver
            </Link>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
              {story.titulo}
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#00d4ff' }}>{story.subtitulo}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <span style={{ color: '#a0aab5', fontSize: '0.9rem', display: 'block' }}>Personajes</span>
            <strong style={{ fontSize: '1.1rem' }}>{story.personajes}</strong>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
            <span style={{ color: '#a0aab5', fontSize: '0.9rem', display: 'block' }}>Año</span>
            <strong style={{ fontSize: '1.1rem' }}>{story.ano}</strong>
          </div>
        </div>

        <div className="glass" style={{ padding: '40px', borderRadius: '25px', fontSize: '1.15rem', lineHeight: '1.8', color: '#d1d5db' }}
             dangerouslySetInnerHTML={{ __html: story.narrativa }}>
        </div>
      </div>
    </main>
  );
}
