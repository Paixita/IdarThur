import { Outfit } from "next/font/google";
import "./globals.css";
import YesselFloating from "@/components/YesselFloating";
import VoicePlayer from "@/components/VoicePlayer";
import Script from "next/script";
import config from "@/data/config.json";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
import NotificationPrompt from "@/components/NotificationPrompt";

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
