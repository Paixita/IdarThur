const { test, expect } = require('@playwright/test');

test('La página principal carga con el Buscador y Natalia AI', async ({ page }) => {
  // Navegar al servidor local (asume npm run dev corriendo en 3000)
  await page.goto('/');

  // Verificar el título para SEO
  await expect(page).toHaveTitle(/IdarThur/);

  // Verificar que el buscador de vuelos esté en la pantalla (origen/destino)
  const buscadorOrigen = page.getByPlaceholder(/Medellín/i);
  await expect(buscadorOrigen).toBeVisible();

  const buscadorDestino = page.getByPlaceholder(/París/i);
  await expect(buscadorDestino).toBeVisible();

  // Verificar que el botón flotante de Natalia IA esté presente
  const nataliaAvatar = page.getByAltText(/Natalia/i).first();
  await expect(nataliaAvatar).toBeVisible();

  // Verificar la tienda (al menos un botón de "Ver Oferta" existe)
  const botonOferta = page.getByText(/Ver Oferta/i).first();
  await expect(botonOferta).toBeVisible();
});
