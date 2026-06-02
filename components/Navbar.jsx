"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="glass" style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '1200px', padding: '10px 20px', zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderRadius: '20px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={closeMenu}>
          <div className="icon-glow nav-logo-container" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', filter: 'drop-shadow(0 0 15px rgba(69, 243, 255, 0.5))' }}>
             <img src="/IdarThur.png" alt="IdarThur Logo Neon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </Link>

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 102 }}
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>

        {/* Links Container */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link href="/" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Vuelos</Link>
          <Link href="/hoteles" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Hoteles</Link>
          <Link href="/eventos" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Eventos</Link>
          <Link href="/tienda" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Tienda</Link>
          <Link href="/autos" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Autos</Link>
          <Link href="/historias" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Historias</Link>
          <Link href="/agentes" onClick={closeMenu} style={{ transition: 'color 0.3s', textDecoration: 'none', color: '#45f3ff', fontWeight: 'bold', textShadow: '0 0 10px rgba(69,243,255,0.5)' }}>Escuadrón IA</Link>
          
          <button onClick={() => { setIsLoginOpen(true); closeMenu(); }} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', marginTop: '10px' }}>Ingresar</button>
        </div>
      </nav>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <style>{`
        /* Estilos por defecto (Desktop) */
        .nav-logo-container {
          width: 250px;
          height: 90px;
        }
        .mobile-menu-toggle {
          display: none !important;
        }
        .nav-links {
          display: flex;
          gap: 20px;
          font-weight: 500;
          align-items: center;
        }

        /* Estilos para Celulares y Tablets pequeñas */
        @media (max-width: 992px) {
          .nav-logo-container {
            width: 150px;
            height: 60px;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .nav-links {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: 100vh;
            background: rgba(10, 15, 26, 0.95);
            backdrop-filter: blur(15px);
            border-left: 1px solid rgba(69, 243, 255, 0.2);
            padding: 100px 30px 30px 30px;
            transition: right 0.4s ease-in-out;
            z-index: 101;
            align-items: flex-start;
          }
          .nav-links.mobile-open {
            right: 0;
            box-shadow: -10px 0 30px rgba(0,0,0,0.8);
          }
          .nav-links > a {
            font-size: 1.2rem;
            margin-bottom: 15px;
            width: 100%;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 10px;
          }
          .nav-links > button {
            width: 100%;
            margin-top: 20px !important;
          }
        }
      `}</style>
    </>
  )
}
