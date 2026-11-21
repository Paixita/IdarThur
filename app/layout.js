import { Outfit } from "next/font/google";
import "./globals.css";
import YesselFloating from "@/components/YesselFloating";
import VoicePlayer from "@/components/VoicePlayer";
import CookiePreferences from "@/components/CookiePreferences";
import config from "@/data/config.json";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: `${config.brandName} - ${config.tagline}`,
  description: config.description,
  keywords: config.keywords.join(", "),
  openGraph: {
    title: `${config.brandName} - El futuro de los viajes está aquí`,
    description: config.description,
    url: `https://${config.domainName}`,
    siteName: config.brandName,
    images: [
      {
        url: `https://${config.domainName}${config.logoUrl}`,
        width: 1200,
        height: 630,
        alt: `${config.brandName} ${config.tagline}`
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


export default function RootLayout({ children }) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.brandName,
    "url": `https://${config.domainName}`,
    "logo": `https://${config.domainName}${config.logoUrl}`,
    "description": config.description,
    "sameAs": []
  };

  const jsonLdSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.brandName,
    "url": `https://${config.domainName}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://${config.domainName}/noticias?search={search_term_string}`,
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

      </head>
      <body className={`${outfit.variable}`} suppressHydrationWarning>
        <CookiePreferences />
        <Navbar />
        {children}
        <Footer />
        <YesselFloating />
        <VoicePlayer />
      </body>
    </html>
  );
}
