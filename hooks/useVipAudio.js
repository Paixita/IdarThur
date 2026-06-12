import { useState, useEffect } from 'react';

export function useVipAudio() {
  const [isAudioPremium, setIsAudioPremiumState] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Detectar si viene la palabra secreta en la URL para activar
      const params = new URLSearchParams(window.location.search);
      if (params.get('vip') === 'true' || params.get('yessel') === 'vip') {
        localStorage.setItem('yesselVipAudio', 'true');
        setIsAudioPremiumState(true);
        return;
      }

      // 2. Leer de localStorage (permanente) en lugar de sessionStorage
      const stored = localStorage.getItem('yesselVipAudio');
      if (stored === 'true') {
        setTimeout(() => {
          setIsAudioPremiumState(true);
        }, 0);
      }
    }
  }, []);

  const setIsAudioPremium = (value) => {
    setIsAudioPremiumState(value);
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem('yesselVipAudio', 'true');
      } else {
        localStorage.removeItem('yesselVipAudio');
      }
    }
  };

  return [isAudioPremium, setIsAudioPremium];
}
