"use client";
import Link from 'next/link';
import config from '@/data/config.json';

const TAG = config.defaultAffiliateTag;

const PRODUCTOS = [
  {
    id: 1,
    name: 'Cámara Blink Mini 2K+',
    price: '$44.99',
    category: 'Seguridad del hogar',
    img: '/tienda/camara_seguridad.jpg',
    affiliateLink: 'https://amzn.to/4ulMw3w',
    badge: 'Más vendida',
  },
  {
    id: 2,
    name: 'Chaqueta Cotrasen para Hombre',
    price: '$119.99',
    category: 'Ropa de invierno',
    img: '/tienda/chaqueta_hombre.jpg',
    affiliateLink: 'https://www.amazon.com/s?k=Cotrasen+Chaqueta+de+trabajo+para+hombre',
  },
  {
    id: 3,
    name: 'Botiquín CTIME Organizador XL',
    price: '$29.99',
    category: 'Salud de viaje',
    img: '/tienda/botiquin_viaje.jpg',
    affiliateLink: 'https://www.amazon.com/s?k=CTIME+Botiquin+Organizador+XL',
  },
  {
    id: 4,
    name: 'Set de Maletas Rígidas Premium',
    price: '$159.00',
    category: 'Equipaje',
    img: '/tienda/equipaje_premium.jpg',
    affiliateLink: 'https://www.amazon.com/s?k=Hard+Shell+Luggage+Set',
    badge: 'Favorita',
  },
  {
    id: 5,
    name: 'Kit de Viaje para Mascotas',
    price: '$34.90',
    category: 'Viajar con mascotas',
    img: '/tienda/mascotas_amigos.jpg',
    affiliateLink: 'https://www.amazon.com/s?k=Travel+Pet+Kit',
  },
];

const withTag = (url) => {
  if (!url) return '#';
  const separator = url.includes('?') ? '&' : '?';
  return url.includes('tag=') ? url : `${url}${separator}tag=${TAG}`;
};

export default function EcommerceHighlights() {
  return (
    <section id="tienda" className="container tienda-destacados">
      <div className="tienda-head">
        <span className="tienda-eyebrow">Recomendados por Yessel</span>
        <h2>
          Equípate con <span className="text-gradient-emerald">{config.brandName}</span>
        </h2>
        <p>Productos reales, probados por viajeros. Cada compra se completa de forma segura en Amazon.</p>
      </div>

      <div className="tienda-grid">
        {PRODUCTOS.map((p) => (
          <article key={p.id} className="producto-card">
            <a
              href={withTag(p.affiliateLink)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="producto-media"
              aria-label={`Comprar ${p.name} en Amazon`}
            >
              <img src={p.img} alt={p.name} loading="lazy" />
              {p.badge && <span className="producto-badge">{p.badge}</span>}
            </a>

            <div className="producto-body">
              <span className="producto-cat">{p.category}</span>
              <h3>{p.name}</h3>
              <div className="producto-bottom">
                <strong>{p.price}</strong>
                <a
                  href={withTag(p.affiliateLink)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="producto-btn"
                >
                  Ver en Amazon →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="tienda-footer">
        <Link href="/tienda" className="tienda-btn">
          Explorar catálogo completo →
        </Link>
      </div>

      <style>{`
        .tienda-destacados { margin: 96px auto; padding-bottom: 40px; }
        .tienda-head { text-align: center; margin-bottom: 46px; }
        .tienda-eyebrow {
          color: #34d399;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 2.4px;
          text-transform: uppercase;
        }
        .tienda-head h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin: 10px 0 12px;
        }
        .tienda-head p {
          color: #a0aab5;
          font-size: 1.08rem;
          max-width: 660px;
          margin: 0 auto;
        }
        .text-gradient-emerald {
          background: linear-gradient(135deg, #34d399, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tienda-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 26px;
        }

        .producto-card {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          overflow: hidden;
          transition: transform 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease;
        }
        .producto-card:hover,
        .producto-card:focus-within {
          transform: translateY(-10px);
          border-color: rgba(52, 211, 153, 0.55);
          box-shadow: 0 18px 40px rgba(16, 185, 129, 0.22);
        }

        .producto-media {
          position: relative;
          display: block;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #0d1520;
        }
        .producto-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .producto-card:hover .producto-media img,
        .producto-card:focus-within .producto-media img { transform: scale(1.08); }

        .producto-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.95);
          color: #04231a;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .producto-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
        .producto-cat {
          color: #6ee7b7;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .producto-body h3 {
          font-size: 1.14rem;
          font-weight: 700;
          color: #fff;
          margin: 8px 0 18px;
          line-height: 1.35;
          flex: 1;
        }
        .producto-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .producto-bottom strong { font-size: 1.5rem; color: #34d399; }

        .producto-btn {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.14);
          border: 1px solid rgba(52, 211, 153, 0.5);
          color: #d1fae5;
          font-size: 0.86rem;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .producto-btn:hover,
        .producto-btn:focus-visible {
          background: linear-gradient(135deg, #34d399, #059669);
          color: #04231a;
          transform: translateY(-2px);
        }

        .tienda-footer { text-align: center; margin-top: 46px; }
        .tienda-btn {
          display: inline-block;
          padding: 14px 34px;
          border-radius: 30px;
          border: 1px solid rgba(52, 211, 153, 0.6);
          color: #d1fae5;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .tienda-btn:hover,
        .tienda-btn:focus-visible {
          background: linear-gradient(135deg, #34d399, #059669);
          color: #04231a;
          transform: translateY(-3px);
        }

        @media (max-width: 520px) {
          .producto-bottom { flex-direction: column; align-items: flex-start; }
          .producto-btn { width: 100%; text-align: center; }
        }
      `}</style>
    </section>
  );
}
