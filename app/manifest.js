export default function manifest() {
  return {
    name: 'IdarThur Agencia VIP',
    short_name: 'IdarThur',
    description: 'Tu agencia de viajes inteligente VIP',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1a',
    theme_color: '#45f3ff',
    icons: [
      {
        src: '/icon-512x512.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  }
}
