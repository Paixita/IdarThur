import Link from 'next/link';
import PrivacyPreferencesButton from './PrivacyPreferencesButton';
import config from '@/data/config.json';

const EXPLORAR = [
  { href: '/', label: 'Vuelos' },
  { href: '/hoteles', label: 'Hoteles' },
  { href: '/cruceros', label: 'Cruceros desde Colombia' },
  { href: '/peru', label: 'Perú: vuelos y rutas' },
  { href: '/noticias', label: 'Noticias de Viaje' },
  { href: '/eventos', label: 'Eventos Mundiales' },
  { href: '/tienda', label: 'Tienda y Accesorios' },
  { href: '/autos', label: 'Alquiler de Autos' },
  { href: '/historias', label: 'Historias de Viajeros' },
  { href: '/agentes', label: 'Escuadrón de IA' },
  { href: '/app', label: 'Descargar aplicación Android' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        {/* Marca */}
        <div>
          <h3 className="footer-brand">{config.brandName}</h3>
          <p className="footer-copy">
            Información de viajes con IA para descubrir el mundo, comparar tus opciones
            y conseguir el mejor equipamiento de la manera más inteligente.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="footer-title">Explorar</h4>
          <ul className="footer-list">
            {EXPLORAR.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="footer-title">Legal &amp; Transparencia</h4>
          <ul className="footer-list">
            <li><Link href="/privacidad" className="footer-link">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="footer-link">Términos y Condiciones</Link></li>
            <li><Link href="/ia" className="footer-link">Transparencia de IA</Link></li>
            <li><PrivacyPreferencesButton /></li>
            <li><Link href="/cookies" className="footer-link">Política de Cookies</Link></li>
            <li><Link href="/afiliados" className="footer-link">Aviso de Afiliados</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {config.brandName} Global. Todos los derechos reservados.</p>
        <p className="footer-legal">
          {config.brandName} actúa como socio afiliado de WayAway, Booking.com y Amazon Associates.
        </p>
      </div>

      <style>{`
        .site-footer {
          background: #070c11;
          color: #a0aab5;
          padding: 64px 20px 30px;
          border-top: 1px solid rgba(52, 211, 153, 0.16);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-brand {
          color: #fff;
          font-size: 1.55rem;
          font-weight: 800;
          margin-bottom: 18px;
        }
        .footer-copy { line-height: 1.7; font-size: 0.92rem; }
        .footer-title {
          color: #fff;
          margin-bottom: 18px;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.3px;
        }
        .footer-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-link {
          position: relative;
          display: inline-block;
          padding: 6px 10px 6px 0;
          color: #a0aab5;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: color 0.25s ease, transform 0.25s ease, text-shadow 0.25s ease;
        }
        .footer-link::before {
          content: "";
          position: absolute;
          left: -14px;
          top: 50%;
          width: 6px;
          height: 6px;
          margin-top: -3px;
          border-radius: 50%;
          background: #34d399;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .footer-link:hover,
        .footer-link:focus-visible {
          color: #34d399;
          transform: translateX(8px);
          text-shadow: 0 0 14px rgba(52, 211, 153, 0.45);
        }
        .footer-link:hover::before,
        .footer-link:focus-visible::before { opacity: 1; }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.85rem;
        }
        .footer-legal { margin-top: 6px; font-size: 0.76rem; opacity: 0.65; }
      `}</style>
    </footer>
  );
}
