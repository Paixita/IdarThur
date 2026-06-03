export default function sitemap() {
  const baseUrl = "https://idarthur.pages.dev";

  // Rutas principales
  const routes = [
    "",
    "/hoteles",
    "/eventos",
    "/tienda",
    "/autos",
    "/historias",
    "/agentes",
    "/noticias"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '/noticias' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
