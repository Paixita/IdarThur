import { Outfit } from "next/font/google";
import "./globals.css";
import CandyAIFloating from "@/components/CandyAIFloating";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "IdarThur | Plataforma de Turismo Premium impulsada por IA",
  description: "Descubre el mundo con IdarThur. Reserva vuelos baratos con WayAway, hoteles exclusivos con Booking y equípate con Amazon. Tu agente de viajes virtual Candy AI te acompaña.",
  keywords: "viajes, vuelos baratos, cruceros, hoteles, turismo, IA, wayaway, booking, amazon travel, IdarThur",
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${outfit.variable}`} suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
        <CandyAIFloating />
      </body>
    </html>
  );
}
