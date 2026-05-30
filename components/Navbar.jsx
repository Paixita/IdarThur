"use client";
import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="glass" style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '1200px', padding: '15px 30px', zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div className="icon-glow" style={{ width: '250px', height: '90px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', filter: 'drop-shadow(0 0 15px rgba(69, 243, 255, 0.5))' }}>
             <img src="/IdarThur.png" alt="IdarThur Logo Neon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '20px', fontWeight: '500' }}>
          <Link href="/" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Vuelos</Link>
          <Link href="/hoteles" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Hoteles</Link>
          <Link href="/eventos" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Eventos</Link>
          <Link href="/tienda" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Tienda</Link>
          <Link href="/autos" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Alquiler de Autos</Link>
          <Link href="/historias" style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'white' }}>Historias</Link>
          <Link href="/agentes" style={{ transition: 'color 0.3s', textDecoration: 'none', color: '#45f3ff', fontWeight: 'bold', textShadow: '0 0 10px rgba(69,243,255,0.5)' }}>Escuadrón IA</Link>
        </div>
        <button onClick={() => setIsLoginOpen(true)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Ingresar</button>
      </nav>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
