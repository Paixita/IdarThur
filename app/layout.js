import { Outfit } from "next/font/google";
import "./globals.css";
import YesselFloating from "@/components/YesselFloating";
import VoicePlayer from "@/components/VoicePlayer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "IdarThur - Agencia de Viajes Inteligente",
  description: "Descubre IdarThur: Tu agencia de viajes impulsada por Inteligencia Artificial. Encuentra los mejores vuelos con cashback, cruceros de lujo, noticias globales y la mejor tienda de viaje.",
  keywords: "agencia de viajes, vuelos baratos, cruceros de lujo, inteligencia artificial, noticias de viajes, nómada digital, viajar con mascotas",
  openGraph: {
    title: "IdarThur - El futuro de los viajes está aquí",
    description: "Vuelos, Hoteles, Cruceros y Noticias Globales con el poder de la IA. Explora el mundo con nosotros.",
    url: "https://idarthur.com",
    siteName: "IdarThur",
    images: [
      {
        url: "https://idarthur.com/logo_blue.png",
        width: 1200,
        height: 630,
        alt: "IdarThur Agencia de Viajes Inteligente"
      }
    ],
    locale: "es_CO",
    type: "website",
  },
  icons: {
    icon: '/favicon.png?v=6',
    apple: '/favicon.png?v=6',
    shortcut: '/favicon.png?v=6',
  }
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NotificationPrompt from "@/components/NotificationPrompt";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${outfit.variable}`} suppressHydrationWarning>
        <NotificationPrompt />
        <Navbar />
        {children}
        <Footer />
<YesselFloating />
        <VoicePlayer />
      </body>
    </html>
  );
}
