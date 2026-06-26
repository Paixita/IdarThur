import { NextResponse } from 'next/server';
import { products as fallbackProducts } from '../../../data/tienda/index';

// We do NOT use "export const runtime = 'edge'" to allow full NodeJS functionality in this route if needed
export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  try {
    const response = await fetch(`${backendUrl}/store/products?fields=*variants.prices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': apiKey || '',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Medusa responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.products || data.products.length === 0) {
      // Fallback if Medusa has no products
      return NextResponse.json({ success: true, origin: 'fallback', products: formatFallbackProducts(fallbackProducts) });
    }

    // Format products from Medusa to match our expected frontend/search schema
    const formatted = data.products.map(p => {
      let price = '$29.99'; // Fallback price
      
      if (p.variants && p.variants.length > 0) {
        const variant = p.variants[0];
        // Medusa v2 calculation structures
        if (variant.calculated_price && typeof variant.calculated_price.calculated_amount === 'number') {
          price = `$${(variant.calculated_price.calculated_amount / 100).toFixed(2)}`;
        } else if (variant.prices && variant.prices.length > 0 && typeof variant.prices[0].amount === 'number') {
          price = `$${(variant.prices[0].amount / 100).toFixed(2)}`;
        }
      }

      return {
        id: p.id,
        name: p.title,
        price: price,
        img: p.thumbnail || (p.images && p.images[0] && p.images[0].url) || '/tienda/equipaje_premium.jpg',
        affiliateLink: `/tienda?producto=${p.id}`, // Custom local route for Medusa checkout
        copy: p.description || p.subtitle || 'Producto premium seleccionado de nuestra tienda local.',
        bestseller: false,
        origin: 'medusa'
      };
    });

    return NextResponse.json({ success: true, origin: 'medusa', products: formatted });

  } catch (error) {
    console.warn("Medusa Backend offline or failed. Using fallback catalog. Error:", error.message);
    
    // Graceful fallback to the simulated shop database
    return NextResponse.json({
      success: true,
      origin: 'fallback',
      products: formatFallbackProducts(fallbackProducts)
    });
  }
}

function formatFallbackProducts(productsList) {
  return productsList.map(p => ({
    id: `fb-${p.id}`,
    name: p.name,
    price: p.price,
    img: p.img,
    affiliateLink: p.affiliateLink,
    copy: p.copy,
    bestseller: p.bestseller || false,
    origin: 'fallback'
  }));
}
