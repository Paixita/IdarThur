import { stories } from '../data/historias';

export default function sitemap() {
  const baseUrl = "https://idarthur.com";

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

  // Rutas de historias dinámicas
  const storyRoutes = stories.map((story) => ({
    url: `${baseUrl}/historias/${story.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...routes, ...storyRoutes];
}
