/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para desarrollo local y despliegue estándar
  output: 'standalone',
  reactStrictMode: true,
  // Optimización de imágenes (permitir dominios de afiliados)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

