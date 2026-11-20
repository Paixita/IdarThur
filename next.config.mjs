import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para desarrollo local y despliegue estándar
  output: 'standalone',
  async redirects() {
    return [{ source: '/historias/el-viaje-que-no-estaba-en-el-mapa', destination: '/historias/la-noche-en-que-el-cielo-guardo-silencio', permanent: true }];
  },
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  outputFileTracingIncludes: {
    '/api/tts': [
      'assets/kokoro-model/**',
      'node_modules/kokoro-js/voices/em_alex.bin',
      'node_modules/kokoro-js/voices/ef_dora.bin',
      'node_modules/kokoro-js/voices/af_heart.bin',
      'node_modules/kokoro-js/voices/if_sara.bin',
      'node_modules/kokoro-js/voices/pf_dora.bin',
      'node_modules/kokoro-js/voices/am_michael.bin',
      'node_modules/kokoro-js/voices/ff_siwis.bin',
      'node_modules/kokoro-js/voices/im_nicola.bin',
      'node_modules/kokoro-js/voices/pm_alex.bin',
      'node_modules/espeak-ng/dist/*.wasm',
      'node_modules/onnxruntime-node/bin/napi-v3/linux/x64/*',
    ],
  },
  outputFileTracingExcludes: {
    '/api/tts': [
      'node_modules/@huggingface/transformers/.cache/**',
      'node_modules/onnxruntime-node/bin/napi-v3/darwin/**',
      'node_modules/onnxruntime-node/bin/napi-v3/win32/**',
      'node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**',
    ],
  },
  reactStrictMode: true,
  // Paquetes con WASM/ONNX nativo: no deben empaquetarse en el bundle
  serverExternalPackages: ['kokoro-js', 'espeak-ng', '@huggingface/transformers', 'onnxruntime-node', 'phonemizer'],
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

