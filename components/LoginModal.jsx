"use client";
import { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, onClose }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(15px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }} onClick={onClose}>
      
      <div className="glass" style={{
        width: '90%', maxWidth: '420px', padding: '40px', borderRadius: '30px',
        position: 'relative', border: '1px solid rgba(69, 243, 255, 0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(69, 243, 255, 0.1) inset',
        animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '25px', background: 'transparent',
          border: 'none', color: '#a0aab5', fontSize: '1.8rem', cursor: 'pointer', transition: 'color 0.2s'
        }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#a0aab5'}>
          &times;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
            Únete a <span className="text-gradient">IdarThur</span>
          </h2>
          <p style={{ color: '#a0aab5', fontSize: '0.95rem' }}>Desbloquea ofertas secretas y el poder de nuestros Agentes IA.</p>
        </div>

        <button 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => alert("Autenticación con Google en desarrollo...")}
          style={{
            width: '100%', padding: '15px', borderRadius: '15px', background: isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.05rem', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', transition: 'all 0.3s',
            marginBottom: '20px'
          }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
          Continuar con Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ margin: '0 15px', color: '#6a7b8c', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          onClick={() => alert("Opción de email en desarrollo...")}
          style={{
            width: '100%', padding: '15px', borderRadius: '15px', background: 'transparent',
            border: '1px solid rgba(69, 243, 255, 0.4)', color: 'var(--primary)', fontSize: '1.05rem', cursor: 'pointer',
            transition: 'all 0.3s', fontWeight: '500'
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(69, 243, 255, 0.1)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent' }}
        >
          Continuar con Email
        </button>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#a0aab5', fontSize: '0.8rem', opacity: 0.7 }}>
          Al continuar, aceptas nuestros términos de servicio y políticas de privacidad para la personalización de tu experiencia.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}} />
    </div>
  );
}
