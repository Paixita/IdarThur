async function test() {
  const voices = ['XrExE9yKIg1WjnnlVkGX', 'jsCqWAovK2zIkigvT1gq', 'oWAxZDx7w5VEj9dCyTzz', 'cgSgspJ2msm6clMCkdW9'];
  try {
    const res = await fetch('https://idarthur.pages.dev/api/tts', { method: 'GET' });
    const { apiKey } = await res.json();
    
    for (let v of voices) {
      const res2 = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: "Hola",
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });
      console.log(`Voice ${v} Response:`, res2.status);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
