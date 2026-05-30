import { Outfit } from "next/font/google";
import "./globals.css";
import CandyAIFloating from "@/components/CandyAIFloating";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "IdarThur - Inteligencia Artificial para Viajeros",
  description: "Descubre IdarThur: Tu agencia de viajes potenciada por Inteligencia Artificial. Encuentra los mejores accesorios de viaje en Amazon, historias reales y tips de nómadas digitales.",
  keywords: "viajes, accesorios de viaje, amazon afiliados, equipaje inteligente, historias de viajes, nómada digital, viajar con mascotas",
  openGraph: {
    title: "IdarThur - El futuro de los viajes",
    description: "La tienda y comunidad de viajeros más avanzada del mundo, impulsada por IA.",
    type: "website"
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
        <CandyAIFloating />
      </body>
    </html>
  );
}
