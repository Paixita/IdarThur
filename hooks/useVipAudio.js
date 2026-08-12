import { useState, useEffect } from 'react';

export function useVipAudio() {
  const [isAudioPremium, setIsAudioPremiumState] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Force VIP audio to be true by default for all users
        try {
          localStorage.setItem('yesselVipAudio', 'true');
        } catch (e) {
          try { sessionStorage.setItem('yesselVipAudio', 'true'); } catch (err) {}
        }
        setIsAudioPremiumState(true);
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
            localStorage.setItem('yesselVipAudio', 'true');
          } catch (e) {
            try { sessionStorage.setItem('yesselVipAudio', 'true'); } catch (err) {}
          }
        } else {
          try {
            localStorage.removeItem('yesselVipAudio');
          } catch (e) {
            try { sessionStorage.removeItem('yesselVipAudio'); } catch (err) {}
          }
        }
      } catch (err) {
        console.error('Error in useVipAudio set:', err);
      }
    }
  };

  return [isAudioPremium, setIsAudioPremium];
}
