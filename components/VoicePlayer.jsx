"use client";
import { useState, useEffect } from 'react';
import { useVipAudio } from '@/hooks/useVipAudio';
import { playAlvaroAudio } from '@/utils/playAlvaro';

export default function VoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [isPremium] = useVipAudio(); // returns [isAudioPremium, setIsAudioPremium]

  // Render nothing for non‑premium users
  if (!isPremium) return null;

  // Gather visible textual content from the page
  const collectText = () => {
    const selectors = 'p, h1, h2, h3, h4, li, span, div';
    const nodes = document.querySelectorAll(selectors);
    let combined = '';
    nodes.forEach(n => {
      if (n.innerText) combined += n.innerText + ' ';
    });
    return combined.trim();
  };

  // Update text when DOM changes (simple MutationObserver)
  useEffect(() => {
    const update = () => setText(collectText());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    if (!text) return;
    setIsPlaying(true);
    playAlvaroAudio(text);
    // Reset state when speech ends
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
        clearInterval(check);
      }
    }, 500);
  };

  return (
    <div
      onClick={togglePlay}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: isPlaying ? 'rgba(0,212,255,0.2)' : 'linear-gradient(45deg, var(--primary), var(--accent))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'background 0.3s',
        zIndex: 1000,
      }}
      title={isPlaying ? 'Detener narración' : 'Escuchar página'}
    >
      {isPlaying ? '⏸' : '▶'}
    </div>
  );
}
