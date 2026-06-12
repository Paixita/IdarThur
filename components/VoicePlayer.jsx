"use client";
import { useState, useEffect } from 'react';
import { useVipAudio } from '@/hooks/useVipAudio';
import { playAlvaroAudio, stopAlvaroAudio, isAlvaroSpeaking } from '@/utils/playAlvaro';

export default function VoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [isPremium] = useVipAudio(); // returns [isAudioPremium, setIsAudioPremium]

  useEffect(() => {
    const handleStart = () => setIsPlaying(true);
    const handleEnd = () => setIsPlaying(false);

    window.addEventListener('alvaro-tts-start', handleStart);
    window.addEventListener('alvaro-tts-end', handleEnd);

    setIsPlaying(isAlvaroSpeaking());

    return () => {
      window.removeEventListener('alvaro-tts-start', handleStart);
      window.removeEventListener('alvaro-tts-end', handleEnd);
    };
  }, []);

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
      stopAlvaroAudio();
      return;
    }
    if (!text) return;
    playAlvaroAudio(text);
  };

  if (!isPremium) return null;

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
