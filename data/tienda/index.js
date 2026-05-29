export const categories = [
  { id: "equipaje", name: "Equipaje y Organización", icon: "🧳" },
  { id: "ropa", name: "Ropa Cómoda de Viaje", icon: "👕" },
  { id: "cuidado", name: "Cuidado Personal y Belleza", icon: "💄" },
  { id: "mascotas", name: "Viajando con Mascotas", icon: "🐶" },
  { id: "entretenimiento", name: "Entretenimiento y Juegos", icon: "🎮" }
];

export const products = [
  {
    id: 1,
    categoryId: "equipaje",
    name: "Maleta de Viaje Premium",
    price: "$149.99",
    img: "/tienda/equipaje_premium.jpg",
    affiliateLink: "https://amzn.to/example_equipaje",
    copy: "Elegancia, resistencia y capacidad. Diseñada con tecnología de policarbonato ultraligero y candado TSA integrado. El equipaje perfecto para recorrer el mundo con estilo.",
    bestseller: true
  },
  {
    id: 2,
    categoryId: "ropa",
    name: "Chaqueta Térmica de Viaje (Unisex)",
    price: "$89.99",
    img: "/tienda/chaqueta_viaje.jpg",
    affiliateLink: "https://amzn.to/example_ropa",
    copy: "Desafía cualquier clima. Material rompevientos, impermeable y con bolsillos tácticos ocultos para proteger tu pasaporte y dinero. Moda y seguridad en una sola prenda.",
    bestseller: false
  },
  {
    id: 3,
    categoryId: "cuidado",
    name: "Oud Royale - Perfume Árabe Elegante",
    price: "$120.50",
    img: "/tienda/perfume_arabe.jpg",
    affiliateLink: "https://amzn.to/example_perfume",
    copy: "Deja una huella inolvidable en cada aeropuerto. Notas exóticas de madera de Oud y especias orientales en un envase de lujo. El aroma exclusivo del viajero sofisticado.",
    bestseller: true
  },
  {
    id: 4,
    categoryId: "mascotas",
    name: "Kit de Viaje Amistad Péluda",
    price: "$45.00",
    img: "/tienda/mascotas_amigos.jpg",
    affiliateLink: "https://amzn.to/example_mascotas",
    copy: "¡La comodidad de tu perro y gato es lo primero! Incluye comedero portátil plegable, cinturones de seguridad para el asiento trasero y dispensador de bolsas. Viajar juntos nunca fue tan fácil.",
    bestseller: true
  },
  {
    id: 5,
    categoryId: "entretenimiento",
    name: "Consola Portátil Híbrida",
    price: "$299.00",
    img: "/tienda/juego_portatil.jpg",
    affiliateLink: "https://amzn.to/example_juego",
    copy: "Horas de diversión asegurada en vuelos largos o escalas. Pantalla OLED vibrante, mandos desmontables y una librería de juegos infinita. El compañero de entretenimiento definitivo.",
    bestseller: true
  }
];
