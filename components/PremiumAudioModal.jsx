import React, { useState } from 'react';

export default function PremiumAudioModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleActivate = () => {
    if (code.trim().toUpperCase() === 'VIP-YESS-2026') {
      setError('');
      setCode('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError('Código inválido. Verifica tu comprobante.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      <div className="glass" style={{ width: '90%', maxWidth: '450px', borderRadius: '30px', padding: '40px', textAlign: 'center', border: '1px solid var(--accent)', boxShadow: '0 0 60px rgba(255,0,128,0.3)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
          ×
        </button>

        <div style={{ width: '80px', height: '80px', background: 'rgba(255,0,128,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid var(--accent)' }}>
          <span style={{ fontSize: '2.5rem' }}>🔈</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'white', fontWeight: 'bold', marginBottom: '15px' }}>Desbloquea la Voz VIP</h2>
        
        <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '30px' }}>
          ¿Prefieres escuchar a Yessel? Desbloquea la comunicación por voz y obtén asistencia premium 24/7 con nuestro motor neuronal avanzado por solo:
        </p>

        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>
          $4.99 <span style={{ fontSize: '1.2rem', color: '#a0aab5', fontWeight: 'normal' }}>USD / mes</span>
        </div>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '30px' }}>Cancelación en cualquier momento</p>

        <button 
          onClick={() => window.open('https://www.paypal.com/paypalme/fieraintro/4.99', '_blank')}
          className="btn-primary" 
          style={{ width: '100%', padding: '18px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '15px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginBottom: '15px' }}
        >
          Pagar con PayPal
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <p style={{ color: '#a0aab5', fontSize: '0.8rem', marginBottom: '20px' }}>Una vez realizado el pago, envíanos el comprobante por correo para recibir tu código de activación.</p>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '10px' }}>
          <p style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px' }}>¿Ya tienes tu código de activación?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)}
              placeholder="Ingresa tu código VIP" 
              style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none' }}
            />
            <button onClick={handleActivate} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Activar
            </button>
          </div>
          {error && <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '10px', margin: 0 }}>{error}</p>}
        </div>

      </div>
    </div>
  );
}
