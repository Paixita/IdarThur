"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from './LoginModal';

import config from "@/data/config.json";

const NAV_ITEMS = [
  { href: '/', label: 'Vuelos', match: (path) => path === '/' },
  { href: '/hoteles', label: 'Hoteles', match: (path) => path.startsWith('/hoteles') },
  { href: '/cruceros', label: 'Cruceros', match: (path) => path.startsWith('/cruceros') },
  { href: '/noticias', label: 'Noticias', match: (path) => path.startsWith('/noticias') },
  { href: '/eventos', label: 'Eventos', match: (path) => path.startsWith('/eventos') },
  { href: '/tienda', label: 'Tienda', match: (path) => path.startsWith('/tienda') },
  { href: '/autos', label: 'Autos', match: (path) => path.startsWith('/autos') },
  { href: '/historias', label: 'Historias', match: (path) => path.startsWith('/historias') },
  { href: '/agentes', label: 'Escuadrón IA', match: (path) => path.startsWith('/agentes') },
];

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="glass main-nav" aria-label="Navegación principal">
        {/* Logo */}
        <Link href="/" className="nav-logo-link" onClick={closeMenu} aria-label={`${config.brandName}, ir al inicio`}>
          <div className="nav-logo-container">
            <img src={config.logoUrl} alt={`${config.brandName} Logo`} />
          </div>
        </Link>

        <a href="/downloads/idarthur.apk" download="IdarThur.apk"
          className="nav-download-quick" aria-label="Descargar app para Android">
          <span>Descargar app</span><small>Android · APK</small>
        </a>

        {/* Botón móvil */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Enlaces */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname || '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                {item.label}
                {item.href === '/noticias' && <span aria-hidden="true"> 🌍</span>}
              </Link>
            );
          })}

          <a href="/downloads/idarthur.apk" download="IdarThur.apk"
            className="nav-link nav-download-menu" onClick={closeMenu}>
            Descargar APK ↓
          </a>

          <button
            onClick={() => { setIsLoginOpen(true); closeMenu(); }}
            className="nav-login"
          >
            Ingresar
          </button>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <style>{`
        .main-nav {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 94%;
          max-width: 1460px;
          padding: 12px 22px;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 22px;
        }

        .nav-logo-container {
          width: 252px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-logo-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .nav-logo-link:hover .nav-logo-container img,
        .nav-logo-link:focus-visible .nav-logo-container img {
          transform: scale(1.04);
        }

        .nav-download-quick { display: none; }
        .nav-download-menu { color: #34d399; }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          z-index: 102;
          padding: 0;
        }

        .nav-links {
          display: flex;
          gap: 4px;
          align-items: center;
          font-weight: 900;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 8px 10px;
          border-radius: 12px;
          font-size: 1.18rem;
          font-weight: 900;
          letter-spacing: 0.2px;
          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }

        .nav-link:hover,
        .nav-link:focus-visible {
          color: #34d399;
          background: rgba(16, 185, 129, 0.14);
          box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }

        .nav-link--active {
          color: #34d399;
          background: rgba(16, 185, 129, 0.16);
          box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.45);
          text-shadow: 0 0 12px rgba(52, 211, 153, 0.35);
        }

        .nav-link--active::after {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 3px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #34d399, #059669);
        }

        .nav-login {
          margin-left: 8px;
          padding: 11px 26px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 900;
          color: #04231a;
          background: linear-gradient(135deg, #34d399, #059669);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }

        .nav-login:hover,
        .nav-login:focus-visible {
          transform: translateY(-2px);
          filter: brightness(1.08);
          box-shadow: 0 10px 26px rgba(16, 185, 129, 0.5);
        }

        /* Tablets y celulares */
        @media (max-width: 1180px) {
          .nav-logo-container {
            width: 210px;
            height: 72px;
          }
          .nav-link {
            font-size: 1.12rem;
            padding: 8px 9px;
          }
        }

        @media (max-width: 1500px) {
          .main-nav {
            padding: 10px 16px;
            top: 12px;
          }
          .nav-logo-container {
            width: 196px;
            height: 68px;
          }
          .nav-download-quick {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 6px 12px;
            margin-left: auto;
            margin-right: 16px;
            border-radius: 12px;
            background: #34d399;
            color: #04231a;
            text-decoration: none;
            font-size: 15px;
            font-weight: 900;
            line-height: 1.3;
          }
          .nav-download-quick small { font-size: 11px; font-weight: 600; }
          .nav-download-quick:focus-visible { outline: 3px solid white; outline-offset: 3px; }
          .mobile-menu-toggle {
            display: block !important;
          }
          .nav-links {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            right: -100%;
            width: 82%;
            max-width: 340px;
            height: 100dvh;
            overflow-y: auto;
            background: rgba(6, 12, 10, 0.97);
            backdrop-filter: blur(18px);
            border-left: 1px solid rgba(16, 185, 129, 0.25);
            padding: 110px 26px 30px 26px;
            transition: right 0.4s ease-in-out;
            z-index: 101;
            align-items: stretch;
            gap: 4px;
          }
          .nav-links.mobile-open {
            right: 0;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
          }
          .nav-links > .nav-link {
            font-size: 1.4rem;
            font-weight: 900;
            margin-bottom: 6px;
            width: 100%;
            padding: 12px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .nav-link--active::after {
            display: none;
          }
          .nav-login {
            width: 100%;
            margin: 18px 0 0 0;
            padding: 15px 20px;
            font-size: 1.1rem;
          }
        }
        @media (max-width: 600px) {
          .main-nav { padding: 8px 10px; }
          .nav-logo-container { width: 114px; height: 60px; }
          .nav-download-quick { padding: 6px 10px; margin-right: 10px; }
        }
      `}</style>
    </>
  );
}
