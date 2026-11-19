"use client";
import Link from 'next/link';
import viajes from '@/data/intelligence/viajes.json';

const vuelo = (destino) =>
  viajes.enlaces.vuelos.replace('{destino}', encodeURIComponent(destino));

const hotel = (destino) =>
  viajes.enlaces.hoteles.replace('{destino}', encodeURIComponent(destino));

const CIUDADES = [
  {
    ciudad: 'Lima',
    code: 'LIM',
    img: '/historias/estambul_calle.png',
    tipo: 'Vuelo directo',
    detalle: '3 h 05 – 3 h 15 min',
    aerolineas: 'LATAM · JetSMART · Avianca',
    precio: 'USD 150 – 260 por tramo',
    nota: 'Ideal para combinar costa, gastronomía y conexión a Cusco.',
  },
  {
    ciudad: 'Cusco',
    code: 'CUZ',
    img: '/historias/machupicchu_portada.png',
    tipo: 'Conexión en Lima',
    detalle: '6 – 10 h según escala',
    aerolineas: 'LATAM · Avianca · JetSMART',
    precio: 'USD 260 – 480 ida y vuelta',
    nota: 'Puerta de entrada a Machu Picchu y el Valle Sagrado.',
  },
  {
    ciudad: 'Arequipa',
    code: 'AQP',
    img: '/historias/machupicchu_templo.png',
    tipo: 'Conexión en Lima',
    detalle: '7 – 11 h según escala',
    aerolineas: 'LATAM · Sky Airline Perú',
    precio: 'USD 280 – 520 ida y vuelta',
    nota: 'Cañón del Colca, gastronomía y arquitectura colonial.',
  },
  {
    ciudad: 'Iquitos',
    code: 'IQT',
    img: '/historias/angkor_exploracion.png',
    tipo: 'Conexión en Lima',
    detalle: '8 – 12 h según escala',
    aerolineas: 'LATAM · Sky Airline Perú',
    precio: 'USD 320 – 560 ida y vuelta',
    nota: 'Amazonía peruana; se llega solo por aire o río.',
  },
];

const HOTELES = [
  { ciudad: 'Lima', zona: 'Miraflores o Barranco' },
  { ciudad: 'Cusco', zona: 'Centro histórico' },
  { ciudad: 'Aguas Calientes', zona: 'Base de Machu Picchu' },
  { ciudad: 'Arequipa', zona: 'Plaza de Armas' },
];

export default function PeruClient() {
  return (
    <main className="peru-page">
      <section className="peru-hero container">
        <span className="peru-eyebrow">Destino del mes · Diciembre</span>
        <h1>
          Perú desde <span className="peru-gradient">Medellín</span>
        </h1>
        <p>
          Vuelos directos a Lima en poco más de 3 horas y conexiones a Cusco, Arequipa e
          Iquitos. Los colombianos entran con cédula, sin visa, hasta 90 días.
        </p>
        <div className="peru-badges">
          <span>🪪 Cédula, sin visa</span>
          <span>✈️ Directo MDE–LIM</span>
          <span>🏔️ Machu Picchu</span>
          <span>💵 Soles (PEN)</span>
        </div>
        <div className="peru-hero-actions">
          <a
            className="peru-btn peru-btn--primary"
            href={vuelo('Lima')}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Buscar vuelos a Lima
          </a>
          <button
            className="peru-btn peru-btn--ghost"
            onClick={() => window.dispatchEvent(new Event('openCandyChat'))}
          >
            Preguntarle a Yessel
          </button>
        </div>
      </section>

      <section className="container peru-section">
        <h2>Rutas y precios de referencia</h2>
        <p className="peru-sub">
          Tarifas orientativas de temporada; el precio final se confirma en el buscador.
        </p>

        <div className="peru-grid">
          {CIUDADES.map((c) => (
            <article key={c.code} className="peru-card">
              <div className="peru-card-media">
                <img src={c.img} alt={`Viaje a ${c.ciudad}`} loading="lazy" />
                <span className="peru-card-code">{c.code}</span>
              </div>
              <div className="peru-card-body">
                <h3>{c.ciudad}</h3>
                <p className="peru-card-tipo">{c.tipo} · {c.detalle}</p>
                <p className="peru-card-air">{c.aerolineas}</p>
                <p className="peru-card-precio">{c.precio}</p>
                <p className="peru-card-nota">{c.nota}</p>
                <a
                  className="peru-card-btn"
                  href={vuelo(c.ciudad)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  Ver vuelos MDE → {c.code}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container peru-section">
        <h2>Dónde dormir</h2>
        <p className="peru-sub">Tarifas comparadas con cancelación flexible.</p>
        <div className="peru-hotels">
          {HOTELES.map((h) => (
            <a
              key={h.ciudad}
              className="peru-hotel"
              href={hotel(h.ciudad)}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              <strong>{h.ciudad}</strong>
              <span>{h.zona}</span>
              <em>Ver hoteles →</em>
            </a>
          ))}
        </div>
      </section>

      <section className="container peru-section">
        <div className="peru-tips">
          <h2>Antes de viajar</h2>
          <ul>
            {viajes.vuelosPeru.consejos.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
            <li>Moneda: sol peruano (PEN). Se aceptan tarjetas en hoteles y restaurantes turísticos.</li>
            <li>Seguro médico de viaje recomendado, sobre todo si vas a la sierra o a la selva.</li>
          </ul>
        </div>
      </section>

      <section className="container peru-final">
        <h2>¿Quieres que Yessel arme tu itinerario?</h2>
        <p>Cuéntale cuántos días tienes y con quién viajas; te propone ruta, vuelos y hoteles.</p>
        <div className="peru-hero-actions">
          <button
            className="peru-btn peru-btn--primary"
            onClick={() => window.dispatchEvent(new Event('openCandyChat'))}
          >
            Hablar con Yessel
          </button>
          <Link className="peru-btn peru-btn--ghost" href="/historias">
            Leer historias de Perú
          </Link>
        </div>
      </section>

      <style>{`
        .peru-page { padding-top: 120px; padding-bottom: 100px; }
        .peru-hero { text-align: center; max-width: 900px; }
        .peru-eyebrow {
          color: #34d399;
          font-weight: 800;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
        .peru-hero h1 {
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800;
          margin: 12px 0 16px;
        }
        .peru-gradient {
          background: linear-gradient(135deg, #34d399, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .peru-hero p {
          color: #b6c2cc;
          font-size: 1.15rem;
          line-height: 1.7;
          max-width: 720px;
          margin: 0 auto 24px;
        }
        .peru-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 28px;
        }
        .peru-badges span {
          padding: 8px 16px;
          border-radius: 30px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(52, 211, 153, 0.35);
          color: #d1fae5;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .peru-hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .peru-btn {
          padding: 15px 30px;
          border-radius: 30px;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .peru-btn--primary {
          background: linear-gradient(135deg, #34d399, #059669);
          color: #04231a;
          box-shadow: 0 10px 26px rgba(16, 185, 129, 0.35);
        }
        .peru-btn--ghost {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(52, 211, 153, 0.45);
          color: #d1fae5;
        }
        .peru-btn:hover, .peru-btn:focus-visible { transform: translateY(-3px); }

        .peru-section { margin-top: 80px; }
        .peru-section h2 { font-size: clamp(1.7rem, 3.4vw, 2.4rem); font-weight: 800; }
        .peru-sub { color: #9fb0be; margin: 8px 0 28px; }

        .peru-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .peru-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .peru-card:hover, .peru-card:focus-within {
          transform: translateY(-8px);
          border-color: rgba(52, 211, 153, 0.55);
          box-shadow: 0 16px 36px rgba(16, 185, 129, 0.2);
        }
        .peru-card-media { position: relative; height: 170px; overflow: hidden; }
        .peru-card-media img { width: 100%; height: 100%; object-fit: cover; }
        .peru-card-code {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(4, 35, 26, 0.85);
          border: 1px solid rgba(52, 211, 153, 0.5);
          color: #6ee7b7;
          font-weight: 800;
          font-size: 0.8rem;
        }
        .peru-card-body { padding: 20px; }
        .peru-card-body h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 6px; }
        .peru-card-tipo { color: #6ee7b7; font-weight: 700; font-size: 0.88rem; }
        .peru-card-air { color: #9fb0be; font-size: 0.86rem; margin-top: 4px; }
        .peru-card-precio { color: #fff; font-weight: 800; margin: 10px 0 6px; }
        .peru-card-nota { color: #9fb0be; font-size: 0.9rem; line-height: 1.5; min-height: 42px; }
        .peru-card-btn {
          display: block;
          margin-top: 16px;
          padding: 12px;
          text-align: center;
          border-radius: 14px;
          background: rgba(16, 185, 129, 0.14);
          border: 1px solid rgba(52, 211, 153, 0.5);
          color: #d1fae5;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .peru-card-btn:hover, .peru-card-btn:focus-visible {
          background: linear-gradient(135deg, #34d399, #059669);
          color: #04231a;
        }

        .peru-hotels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
        }
        .peru-hotel {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 20px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-decoration: none;
          color: #fff;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .peru-hotel:hover, .peru-hotel:focus-visible {
          border-color: rgba(52, 211, 153, 0.6);
          transform: translateY(-4px);
        }
        .peru-hotel strong { font-size: 1.1rem; }
        .peru-hotel span { color: #9fb0be; font-size: 0.88rem; }
        .peru-hotel em { color: #6ee7b7; font-style: normal; font-weight: 800; margin-top: 8px; }

        .peru-tips {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(10, 15, 25, 0.8));
          border: 1px solid rgba(52, 211, 153, 0.25);
          border-radius: 24px;
          padding: 36px;
        }
        .peru-tips ul { margin-top: 18px; padding-left: 20px; color: #c7d2dc; line-height: 1.8; }

        .peru-final {
          margin-top: 80px;
          text-align: center;
          padding: 48px 30px;
          border-radius: 28px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #04231a;
        }
        .peru-final h2 { color: #04231a; }
        .peru-final p { margin: 10px 0 22px; font-weight: 500; }
        .peru-final .peru-btn--primary { background: #04231a; color: #d1fae5; }
        .peru-final .peru-btn--ghost { background: rgba(4, 35, 26, 0.12); border-color: rgba(4, 35, 26, 0.35); color: #04231a; }
      `}</style>
    </main>
  );
}
