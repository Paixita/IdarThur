"use client";
import Link from 'next/link';

const SECCIONES = [
  {
    id: 'vuelos',
    label: 'Vuelos',
    hint: 'Rutas y tarifas',
    icon: '✈️',
    href: '/',
    img: '/destinos/slider_paris.png',
  },
  {
    id: 'hoteles',
    label: 'Hoteles y Cruceros',
    hint: 'Alojamiento premium',
    icon: '🏨',
    href: '/hoteles',
    img: '/hoteles/hotel_lobby_banner.png',
  },
  {
    id: 'noticias',
    label: 'Noticias',
    hint: 'Alertas de viaje',
    icon: '📰',
    href: '/noticias',
    img: '/destinos/nuevayork.png',
  },
  {
    id: 'eventos',
    label: 'Eventos',
    hint: 'Qué pasa en el mundo',
    icon: '🎉',
    href: '/eventos',
    img: '/destinos/tokio.png',
  },
  {
    id: 'tienda',
    label: 'Tienda',
    hint: 'Equipo del viajero',
    icon: '🛒',
    href: '/tienda',
    img: '/tienda/equipaje_premium.jpg',
  },
  {
    id: 'autos',
    label: 'Autos',
    hint: 'Movilidad en destino',
    icon: '🚗',
    href: '/autos',
    img: '/autos/banner.png',
  },
  {
    id: 'historias',
    label: 'Historias',
    hint: 'Relatos de viajeros',
    icon: '📖',
    href: '/historias',
    img: '/historias/machupicchu_portada.png',
  },
  {
    id: 'agentes',
    label: 'Escuadrón IA',
    hint: 'Agentes que te ayudan',
    icon: '🤖',
    href: '/agentes',
    img: '/agentes/banner.png',
  },
];

export default function SectionsMarquee() {
  const items = [...SECCIONES, ...SECCIONES];

  return (
    <section className="secciones-section" aria-labelledby="secciones-titulo">
      <div className="container secciones-head">
        <h2 id="secciones-titulo">
          Todo IdarThur <span className="text-gradient-emerald">en un vistazo</span>
        </h2>
        <p>Toca cualquier tarjeta para entrar directo a esa sección.</p>
      </div>

      <div className="secciones-marquee">
        <div className="secciones-track">
          {items.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.href}
              className="seccion-card"
              aria-label={`Ir a ${item.label}`}
            >
              <img src={item.img} alt="" className="seccion-img" loading="lazy" aria-hidden="true" />
              <span className="seccion-shade" aria-hidden="true" />
              <span className="seccion-body">
                <span className="seccion-icon" aria-hidden="true">{item.icon}</span>
                <span className="seccion-text">
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .secciones-section {
          padding: 54px 0 64px;
          background: #080e14;
          overflow: hidden;
        }
        .secciones-head { text-align: center; margin-bottom: 28px; }
        .secciones-head h2 {
          font-size: clamp(1.7rem, 3.2vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 8px;
        }
        .secciones-head p { color: #9fb0be; font-size: 1.02rem; }
        .text-gradient-emerald {
          background: linear-gradient(135deg, #34d399, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .secciones-marquee { position: relative; }
        .secciones-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: secciones-scroll 38s linear infinite;
        }
        .secciones-marquee:hover .secciones-track,
        .secciones-marquee:focus-within .secciones-track {
          animation-play-state: paused;
        }
        @keyframes secciones-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-300px * 8 - 20px * 8)); }
        }

        .seccion-card {
          position: relative;
          width: 300px;
          height: 170px;
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .seccion-card:hover,
        .seccion-card:focus-visible {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(52, 211, 153, 0.65);
          box-shadow: 0 16px 36px rgba(16, 185, 129, 0.3);
        }
        .seccion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.6s ease;
        }
        .seccion-card:hover .seccion-img,
        .seccion-card:focus-visible .seccion-img { transform: scale(1.12); }

        .seccion-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(4, 12, 10, 0.9) 0%, rgba(4, 12, 10, 0.55) 55%, rgba(4, 12, 10, 0.15) 100%);
        }
        .seccion-body {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
        }
        .seccion-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          font-size: 1.5rem;
          background: rgba(16, 185, 129, 0.18);
          border: 1px solid rgba(52, 211, 153, 0.4);
        }
        .seccion-text { display: flex; flex-direction: column; }
        .seccion-text strong {
          color: #fff;
          font-size: 1.16rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .seccion-text small {
          color: #a7f3d0;
          font-size: 0.82rem;
          font-weight: 600;
          margin-top: 3px;
        }

        @media (max-width: 640px) {
          .seccion-card { width: 250px; height: 150px; }
          .seccion-text strong { font-size: 1.02rem; }
          @keyframes secciones-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-250px * 8 - 20px * 8)); }
          }
        }
      `}</style>
    </section>
  );
}
