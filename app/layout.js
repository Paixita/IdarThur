import { Outfit } from "next/font/google";
import "./globals.css";
import YesselFloating from "@/components/YesselFloating";
import VoicePlayer from "@/components/VoicePlayer";
import Script from "next/script";

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
    icon: '/favicon.png?v=7',
    apple: '/favicon.png?v=7',
    shortcut: '/favicon.png?v=7',
  }
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NotificationPrompt from "@/components/NotificationPrompt";

export default function RootLayout({ children }) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IdarThur",
    "url": "https://idarthur.com",
    "logo": "https://idarthur.com/logo_blue.png",
    "description": "Tu agencia de viajes inteligente impulsada por Inteligencia Artificial. Encuentra los mejores vuelos con cashback, cruceros de lujo y noticias globales.",
    "sameAs": []
  };

  const jsonLdSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IdarThur",
    "url": "https://idarthur.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://idarthur.com/noticias?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSite) }}
        />
        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
            ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('D904FQRC77U4L9S4V6UG');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </head>
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
