import { useState, useEffect } from 'react';

export function useVipAudio() {
  const [isAudioPremium, setIsAudioPremiumState] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('yesselVipAudio');
      if (stored === 'true') {
        setIsAudioPremiumState(true);
      }
    }
  }, []);

  const setIsAudioPremium = (value) => {
    setIsAudioPremiumState(value);
    if (typeof window !== 'undefined') {
      if (value) {
        sessionStorage.setItem('yesselVipAudio', 'true');
      } else {
        sessionStorage.removeItem('yesselVipAudio');
      }
    }
  };

  return [isAudioPremium, setIsAudioPremium];
}
