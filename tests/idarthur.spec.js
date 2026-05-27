const { test, expect } = require('@playwright/test');

test('La página principal carga con el Buscador y Candy AI', async ({ page }) => {
  // Navegar al servidor local (asume npm run dev corriendo en 3000)
  await page.goto('/');

  // Verificar el título para SEO
  await expect(page).toHaveTitle(/IdarThur/);

  // Verificar que el buscador futurista esté en la pantalla
  const buscador = page.getByPlaceholder(/Ej: Vuelo a Madrid/i);
  await expect(buscador).toBeVisible();

  // Verificar que el botón flotante de Candy IA esté presente
  const candyAvatar = page.getByAltText(/Candy/i).first();
  await expect(candyAvatar).toBeVisible();

  // Verificar la tienda (al menos un botón de "Ver Oferta" existe)
  const botonOferta = page.getByText(/Ver Oferta/i).first();
  await expect(botonOferta).toBeVisible();
});
