export const categories = [
  { id: "equipaje", name: "Equipaje y Organización", icon: "🧳" },
  { id: "ropa", name: "Ropa Cómoda de Viaje", icon: "👕" },
  { id: "cuidado", name: "Cuidado Personal y Belleza", icon: "💄" },
  { id: "mascotas", name: "Viajando con Mascotas", icon: "🐶" },
  { id: "entretenimiento", name: "Entretenimiento y Juegos", icon: "🎮" },
  { id: "tecnologia", name: "Tecnología y Sistemas", icon: "💻" },
  { id: "hogar_oficina", name: "Hogar y Oficina", icon: "🏠" },
  { id: "fitness", name: "Fitness y Gimnasio", icon: "🏋️" }
];

export const products = [
  {
    id: 1,
    categoryId: "ropa",
    name: "Chaqueta Cotrasen para Hombre",
    price: "$119.99",
    img: "/tienda/chaqueta_hombre.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Cotrasen+Chaqueta+de+trabajo+para+hombre&tag=idarthur-20",
    copy: "Chaqueta de trabajo impermeable, de lona de pato, forro sherpa térmica y cálida con múltiples bolsillos. La protección absoluta para tus viajes más fríos.",
    bestseller: true
  },
  {
    id: 2,
    categoryId: "ropa",
    name: "Abrigo MAGCOMSEN para Mujer",
    price: "$72.98",
    img: "/tienda/chaqueta_mujer.jpg",
    affiliateLink: "https://www.amazon.com/s?k=MAGCOMSEN+Abrigos+de+invierno+3+en+1+para+mujer&tag=idarthur-20",
    copy: "Abrigo de invierno 3 en 1, chaqueta de esquí impermeable, cortavientos con forro polar y parka. Diseño elegante y máxima protección térmica.",
    bestseller: true
  },
  {
    id: 3,
    categoryId: "equipaje",
    name: "Cámara Blink Mini 2K+",
    price: "$39.99",
    img: "/tienda/camara_seguridad.jpg",
    affiliateLink: "https://www.amazon.com/dp/B0F3B4PPGM?tag=idarthur-20",
    copy: "Cámara interior inteligente. Ve a tus mascotas o el interior de tu casa en resolución 2K mientras viajas, con visión nocturna a color y detección de movimiento.",
    bestseller: false
  },
  {
    id: 4,
    categoryId: "cuidado",
    name: "Botiquín CTIME Organizador",
    price: "$29.99",
    img: "/tienda/botiquin_viaje.jpg",
    affiliateLink: "https://www.amazon.com/dp/B0FH239CV6?tag=idarthur-20",
    copy: "Organizador de medicamentos XL de 4 niveles. Botiquín portátil premium para tener todo a la mano en casa rodante, viajes o campamentos.",
    bestseller: false
  },
  {
    id: 5,
    categoryId: "equipaje",
    name: "Maleta de Viaje Premium",
    price: "$149.99",
    img: "/tienda/equipaje_premium.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Premium+Polycarbonate+Luggage+Travel+Suitcase&tag=idarthur-20",
    copy: "Elegancia, resistencia y capacidad. Diseñada con tecnología de policarbonato ultraligero y candado TSA integrado. El equipaje perfecto para recorrer el mundo con estilo.",
    bestseller: true
  },
  {
    id: 6,
    categoryId: "cuidado",
    name: "Oud Royale - Perfume Árabe Elegante",
    price: "$120.50",
    img: "/tienda/perfume_arabe.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Arabian+Oud+Luxury+Perfume&tag=idarthur-20",
    copy: "Deja una huella inolvidable en cada aeropuerto. Notas exóticas de madera de Oud y especias orientales en un envase de lujo. El aroma exclusivo del viajero sofisticado.",
    bestseller: false
  },
  {
    id: 7,
    categoryId: "mascotas",
    name: "Kit de Viaje Amistad Peluda",
    price: "$45.00",
    img: "/tienda/mascotas_amigos.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Pet+Travel+Kit+Portable+Bowl+Carrier&tag=idarthur-20",
    copy: "¡La comodidad de tu perro y gato es lo primero! Incluye comedero portátil plegable, cinturones de seguridad para el asiento trasero y dispensador de bolsas. Viajar juntos nunca fue tan fácil.",
    bestseller: true
  },
  {
    id: 8,
    categoryId: "mascotas",
    name: "Mochila Cápsula Astronauta",
    price: "$55.99",
    img: "/tienda/mochila_mascota.png",
    affiliateLink: "https://www.amazon.com/s?k=Cat+Backpack+Carrier+Bubble&tag=idarthur-20",
    copy: "Mochila transportadora transparente panorámica. Tu gato o perro pequeño viajará súper cómodo y disfrutará del paisaje en cabina o de paseo contigo.",
    bestseller: true
  },
  {
    id: 9,
    categoryId: "mascotas",
    name: "Botella y Dispensador Portátil",
    price: "$22.50",
    img: "/tienda/botella_mascota.png",
    affiliateLink: "https://www.amazon.com/s?k=Dog+Water+Bottle+Portable+Dispenser&tag=idarthur-20",
    copy: "Botella 2 en 1 con dispensador de agua y compartimento para snacks. Mantén a tu peludo hidratado en el aeropuerto o en la carretera sin derrames.",
    bestseller: false
  },
  {
    id: 10,
    categoryId: "mascotas",
    name: "Collar Rastreador GPS Smart",
    price: "$89.99",
    img: "/tienda/gps_mascota.png",
    affiliateLink: "https://www.amazon.com/s?k=Pet+GPS+Tracker+Smart+Collar&tag=idarthur-20",
    copy: "Viaja con absoluta tranquilidad. Collar inteligente con rastreo GPS global en tiempo real y luz LED nocturna. Nunca pierdas de vista a tu mejor amigo.",
    bestseller: true
  },
  {
    id: 11,
    categoryId: "entretenimiento",
    name: "Consola Portátil Híbrida",
    price: "$299.00",
    img: "/tienda/juego_portatil.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Nintendo+Switch+OLED&tag=idarthur-20",
    copy: "Horas de diversión asegurada en vuelos largos o escalas. Pantalla OLED vibrante, mandos desmontables y una librería de juegos infinita. El compañero de entretenimiento definitivo.",
    bestseller: true
  },
  {
    id: 12,
    categoryId: "tecnologia",
    name: "Laptop ASUS Vivobook Go 15",
    price: "$349.99",
    img: "/tienda/laptop_asus.jpg",
    affiliateLink: "https://www.amazon.com/s?k=ASUS+Vivobook+Go+15+Laptop&tag=idarthur-20",
    copy: "Ideal para productividad en casa, oficina o viajes. Pantalla de 15.6 pulgadas FHD, procesador AMD Ryzen 3, 8GB de RAM y 256GB SSD. Eficiencia ultraliviana para tu día a día.",
    bestseller: true
  },
  {
    id: 13,
    categoryId: "tecnologia",
    name: "Memoria RAM Kingston FURY Beast DDR5 32GB",
    price: "$105.00",
    img: "/tienda/ram_kingston.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Kingston+FURY+Beast+DDR5+32GB&tag=idarthur-20",
    copy: "Eleva la velocidad de tu computadora de sistemas. Kit de 2 módulos de 16GB con disipador de calor de perfil bajo y overclocking automático para alto rendimiento.",
    bestseller: false
  },
  {
    id: 14,
    categoryId: "hogar_oficina",
    name: "Cojín Ergonómico de Espuma de Memoria",
    price: "$35.99",
    img: "/tienda/cojin_ergonomico.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Memory+Foam+Ergonomic+Seat+Cushion+Office&tag=idarthur-20",
    copy: "Protege tu postura en largas jornadas de trabajo en la oficina o durante viajes largos en automóvil. Diseño ortopédico que alivia la presión del coxis.",
    bestseller: true
  },
  {
    id: 15,
    categoryId: "hogar_oficina",
    name: "Lámpara de Escritorio LED con Cargador Inalámbrico",
    price: "$28.50",
    img: "/tienda/lampara_escritorio.jpg",
    affiliateLink: "https://www.amazon.com/s?k=LED+Desk+Lamp+Wireless+Charger&tag=idarthur-20",
    copy: "Estilo minimalista para tu hogar u oficina. 5 modos de color, 10 niveles de brillo, puerto de carga USB y base de carga rápida inalámbrica para tu celular.",
    bestseller: false
  },
  {
    id: 16,
    categoryId: "fitness",
    name: "Mancuernas Ajustables Premium (Par)",
    price: "$189.99",
    img: "/tienda/mancuernas_ajustables.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Adjustable+Dumbbell+Set+Pair&tag=idarthur-20",
    copy: "Entrena en casa como en el gimnasio. Sistema de selección rápida de peso que reemplaza hasta 15 mancuernas individuales. Perfectas para optimizar espacio.",
    bestseller: true
  },
  {
    id: 17,
    categoryId: "fitness",
    name: "Set de Bandas de Resistencia Elasticas",
    price: "$18.50",
    img: "/tienda/bandas_resistencia.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Resistance+Bands+Workout+Set&tag=idarthur-20",
    copy: "Tu gimnasio portátil favorito. 5 bandas de diferentes intensidades, anclaje de puerta y correas para tobillos. Entrena fuerza en cualquier habitación de hotel o casa.",
    bestseller: false
  },
  {
    id: 18,
    categoryId: "cuidado",
    name: "Sérum Facial Hidratante de Ácido Hialurónico",
    price: "$24.99",
    img: "/tienda/serum_hidratante.jpg",
    affiliateLink: "https://www.amazon.com/s?k=Hyaluronic+Acid+Serum+Moisturizer&tag=idarthur-20",
    copy: "Mantén tu rostro fresco y radiante del estrés diario. Fórmula de rápida absorción que hidrata profundamente, rellena líneas de expresión y mejora la elasticidad.",
    bestseller: false
  }
];
