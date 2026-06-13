import NoticiasClient from './NoticiasClient';

export const metadata = {
  title: "Noticias Globales de Viajes | Reportes Climatológicos y Aeropuertos - IdarThur",
  description: "Accede al reporte global de vuelos, cancelaciones, clima y cruceros en tiempo real, auditado por la Inteligencia Artificial Natalia.",
  keywords: "noticias de viajes, retrasos de vuelos, cancelaciones de aeropuertos, clima de viajes, cruceros noticias, idarthur noticias"
};

export default function NoticiasPage() {
  return <NoticiasClient />;
}
