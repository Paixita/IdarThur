"use client";
import Link from 'next/link';

const HOTEL = (destino) =>
  `https://search.hotellook.com/?destination=${encodeURIComponent(destino)}&marker=729418`;

const DESTINOS = [
  {
    id: 'crucero-caribe',
    title: 'Crucero por el Caribe',
    subtitle: '7 noches desde Cartagena',
    tag: 'Cruceros',
    img: '/cruceros/crucero-1.jpg',
    link: '/cruceros',
    internal: true,
  },
  {
    id: 'crucero-mediterraneo',
    title: 'Crucero a Panamá',
    subtitle: 'Cartagena, Aruba, Curazao y Colón',
    tag: 'Cruceros',
    img: '/cruceros/crucero-2.jpg',
    link: '/cruceros',
    internal: true,
  },
  {
    id: 'san-andres',
    title: 'San Andrés, Colombia',
    subtitle: 'Mar de siete colores',
    tag: 'Diciembre',
    img: '/destinos/slider_sanandres.png',
    link: HOTEL('San Andres'),
  },
  {
    id: 'santa-marta',
    title: 'Santa Marta, Colombia',
    subtitle: 'Tayrona y Sierra Nevada',
    tag: 'Diciembre',
    img: '/destinos/slider_santamarta.png',
    link: HOTEL('Santa Marta'),
  },
  {
    id: 'cancun',
    title: 'Cancún, México',
    subtitle: 'Caribe y todo incluido',
    tag: 'Diciembre',
    img: '/destinos/cancun.png',
    link: HOTEL('Cancun'),
  },
  {
    id: 'peru-machu',
    title: 'Machu Picchu, Perú',
    subtitle: 'Vuelo directo a Lima + tren',
    tag: 'Perú',
    img: '/historias/machupicchu_portada.png',
    link: '/peru',
    internal: true,
  },
  {
    id: 'paris',
    title: 'París, Francia',
    subtitle: 'Europa en temporada navideña',
    tag: 'Europa',
    img: '/destinos/slider_paris.png',
    link: HOTEL('Paris'),
  },
  {
    id: 'dubai',
    title: 'Dubái, EAU',
    subtitle: 'Lujo y desierto',
    tag: 'Internacional',
    img: '/destinos/slider_dubai.png',
    link: HOTEL('Dubai'),
  },
  {
    id: 'peru-promo',
    title: 'Perú te espera',
    subtitle: 'Cédula, sin visa · Rutas desde Medellín',
    tag: 'Promoción',
    img: '/historias/machupicchu_templo.png',
    link: '/peru',
    internal: true,
    promo: true,
  },
];

export default function DestinationsSlider() {
  const sliderItems = [...DESTINOS, ...DESTINOS];

  return (
    <section className="destinos-section" aria-labelledby="destinos-titulo">
      <div className="container destinos-head">
        <span className="destinos-eyebrow">Diciembre y fin de año</span>
        <h2 id="destinos-titulo">
          Destinos <span className="text-gradient-emerald">recomendados</span>
        </h2>
        <p>
          Playas de Colombia y el Caribe, Europa navideña y Perú a 3 horas de vuelo.
          Toca una carátula para ver tarifas y disponibilidad.
        </p>
      </div>

      <div className="destinos-slider">
        <div className="destinos-track">
          {sliderItems.map((dest, idx) => {
            const contenido = (
              <>
                <img
                  src={dest.img}
                  alt={`${dest.title} — ${dest.subtitle}`}
                  className="destino-img"
                  loading="lazy"
                />
                <div className="destino-shade" aria-hidden="true" />
                <span className={`destino-tag ${dest.promo ? 'destino-tag--promo' : ''}`}>
                  {dest.tag}
                </span>
                <div className="destino-info">
                  <span className="destino-sub">{dest.subtitle}</span>
                  <h3>{dest.title}</h3>
                  <span className="destino-cta">
                    {dest.internal ? 'Ver detalles →' : 'Ver tarifas →'}
                  </span>
                </div>
              </>
            );

            return dest.internal ? (
              <Link
                key={`${dest.id}-${idx}`}
                href={dest.link}
                className="destino-card"
                aria-label={`${dest.title}: ${dest.subtitle}`}
              >
                {contenido}
              </Link>
            ) : (
              <a
                key={`${dest.id}-${idx}`}
                href={dest.link}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="destino-card"
                aria-label={`${dest.title}: ${dest.subtitle}`}
              >
                {contenido}
              </a>
            );
          })}
        </div>
      </div>

      <div className="container destinos-footer">
        <Link href="/peru" className="destinos-btn">
          Ver vuelos y rutas a Perú →
        </Link>
      </div>

      <style>{`
        .destinos-section {
          padding: 66px 0 34px;
          background: radial-gradient(120% 90% at 50% 0%, rgba(16, 185, 129, 0.10) 0%, #0a0f1a 55%);
          overflow: hidden;
        }
        .destinos-head { text-align: center; margin-bottom: 34px; }
        .destinos-eyebrow {
          color: #34d399;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .destinos-head h2 {
          font-size: clamp(2rem, 4vw, 3.3rem);
          font-weight: 800;
          margin: 12px 0 14px;
        }
        .text-gradient-emerald {
          background: linear-gradient(135deg, #34d399, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .destinos-head p {
          color: #a0aab5;
          font-size: 1.1rem;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .destinos-slider { position: relative; width: 100%; padding: 10px 0 24px; }
        .destinos-track {
          display: flex;
          gap: 26px;
          width: max-content;
          animation: destinos-scroll 52s linear infinite;
        }
        .destinos-slider:hover .destinos-track,
        .destinos-slider:focus-within .destinos-track { animation-play-state: paused; }

        @keyframes destinos-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-360px * 9 - 26px * 9)); }
        }

        .destino-card {
          position: relative;
          display: block;
          width: 360px;
          height: 460px;
          flex-shrink: 0;
          border-radius: 26px;
          overflow: hidden;
          text-decoration: none;
          background: #0b1120;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.38);
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .destino-card:hover,
        .destino-card:focus-visible {
          transform: translateY(-10px);
          border-color: rgba(52, 211, 153, 0.6);
          box-shadow: 0 20px 48px rgba(16, 185, 129, 0.28);
        }
        .destino-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .destino-card:hover .destino-img,
        .destino-card:focus-visible .destino-img { transform: scale(1.08); }

        .destino-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(3, 10, 8, 0.92) 0%, rgba(3, 10, 8, 0.32) 45%, rgba(3, 10, 8, 0.05) 75%);
        }
        .destino-tag {
          position: absolute;
          top: 18px;
          left: 18px;
          padding: 7px 14px;
          border-radius: 30px;
          background: rgba(16, 185, 129, 0.92);
          color: #04231a;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .destino-tag--promo {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #3b2503;
        }
        .destino-info { position: absolute; left: 24px; right: 24px; bottom: 24px; }
        .destino-sub {
          display: block;
          color: #6ee7b7;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .destino-info h3 {
          color: #fff;
          font-size: 1.85rem;
          font-weight: 800;
          margin: 0 0 10px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
          line-height: 1.15;
        }
        .destino-cta {
          display: inline-block;
          font-size: 0.95rem;
          font-weight: 800;
          color: #d1fae5;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .destino-card:hover .destino-cta,
        .destino-card:focus-visible .destino-cta { opacity: 1; transform: translateY(0); }

        .destinos-footer { text-align: center; margin-top: 6px; }
        .destinos-btn {
          display: inline-block;
          padding: 14px 34px;
          border-radius: 30px;
          font-weight: 800;
          color: #04231a;
          background: linear-gradient(135deg, #34d399, #059669);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .destinos-btn:hover,
        .destinos-btn:focus-visible {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.55);
        }

        @media (max-width: 640px) {
          .destino-card { width: 285px; height: 410px; }
          .destino-info h3 { font-size: 1.55rem; }
          @keyframes destinos-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-285px * 9 - 26px * 9)); }
          }
        }
      `}</style>
    </section>
  );
}
