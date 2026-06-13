import { useState, useEffect } from 'react';

export function useVipAudio() {
  const [isAudioPremium, setIsAudioPremiumState] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 1. Detectar si viene la palabra secreta en la URL para activar
        const params = new URLSearchParams(window.location.search);
        if (params.get('vip') === 'true' || params.get('yessel') === 'vip' || params.get('natalia') === 'vip') {
          try {
            localStorage.setItem('nataliaVipAudio', 'true');
            localStorage.setItem('yesselVipAudio', 'true');
          } catch (e) {
            console.warn('Storage blocked:', e);
            // Fallback en sessionStorage si localStorage está bloqueado
            try { 
              sessionStorage.setItem('nataliaVipAudio', 'true'); 
              sessionStorage.setItem('yesselVipAudio', 'true'); 
            } catch (err) {}
          }
          setIsAudioPremiumState(true);
          return;
        }

        // 2. Leer de localStorage (o sessionStorage como fallback)
        let stored = null;
        try {
          stored = localStorage.getItem('nataliaVipAudio') || localStorage.getItem('yesselVipAudio');
        } catch (e) {
          try { stored = sessionStorage.getItem('nataliaVipAudio') || sessionStorage.getItem('yesselVipAudio'); } catch (err) {}
        }

        if (stored === 'true') {
          setTimeout(() => {
            setIsAudioPremiumState(true);
          }, 0);
        }
      } catch (globalError) {
        console.error('Error in useVipAudio initialization:', globalError);
      }
    }
  }, []);

  const setIsAudioPremium = (value) => {
    setIsAudioPremiumState(value);
    if (typeof window !== 'undefined') {
      try {
        if (value) {
          try {
            localStorage.setItem('nataliaVipAudio', 'true');
            localStorage.setItem('yesselVipAudio', 'true');
          } catch (e) {
            try { 
              sessionStorage.setItem('nataliaVipAudio', 'true'); 
              sessionStorage.setItem('yesselVipAudio', 'true'); 
            } catch (err) {}
          }
        } else {
          try {
            localStorage.removeItem('nataliaVipAudio');
            localStorage.removeItem('yesselVipAudio');
          } catch (e) {
            try { 
              sessionStorage.removeItem('nataliaVipAudio'); 
              sessionStorage.removeItem('yesselVipAudio'); 
            } catch (err) {}
          }
        }
      } catch (err) {
        console.error('Error in useVipAudio set:', err);
      }
    }
  };

  return [isAudioPremium, setIsAudioPremium];
}
