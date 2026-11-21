import '../config/app_config.dart';

/// Producto de la Tienda del Viajero. Misma estructura que
/// `data/tienda/index.js` del proyecto web. Los enlaces son de
/// afiliado de Amazon con el tag `idarthur-20`.
class Product {
  final int id;
  final String categoryId;
  final String name;
  final String price;
  final String emoji;
  final String imageFileName;
  final String copy;
  final bool bestseller;
  final String affiliateLink;

  const Product({
    required this.id,
    required this.categoryId,
    required this.name,
    required this.price,
    required this.emoji,
    required this.imageFileName,
    required this.copy,
    required this.bestseller,
    required this.affiliateLink,
  });

  /// Enlace de afiliado garantizado (agrega el tag si faltara).
  String get purchaseUrl {
    if (affiliateLink.contains('tag=')) return affiliateLink;
    if (affiliateLink.contains('?')) {
      return '$affiliateLink&tag=${AppConfig.amazonTag}';
    }
    return '$affiliateLink?tag=${AppConfig.amazonTag}';
  }

  bool get isBestseller => bestseller;

  String get imageUrl => '${AppConfig.apiBaseUrl}$imageFileName';
}

/// Categoría de la tienda (misma estructura que la web).
class StoreCategory {
  final String id;
  final String name;
  final String emoji;

  const StoreCategory({
    required this.id,
    required this.name,
    required this.emoji,
  });
}

/// Catálogo embebido de la Tienda del Viajero.
class StoreData {
  StoreData._();

  static const List<StoreCategory> categories = [
    StoreCategory(id: 'equipaje', name: 'Equipaje y Organización', emoji: '🧳'),
    StoreCategory(id: 'ropa', name: 'Ropa Cómoda de Viaje', emoji: '👕'),
    StoreCategory(
      id: 'cuidado',
      name: 'Cuidado Personal y Belleza',
      emoji: '💄',
    ),
    StoreCategory(id: 'mascotas', name: 'Viajando con Mascotas', emoji: '🐶'),
    StoreCategory(
      id: 'entretenimiento',
      name: 'Entretenimiento y Juegos',
      emoji: '🎮',
    ),
    StoreCategory(id: 'tecnologia', name: 'Tecnología y Sistemas', emoji: '💻'),
    StoreCategory(id: 'hogar_oficina', name: 'Hogar y Oficina', emoji: '🏠'),
    StoreCategory(id: 'fitness', name: 'Fitness y Gimnasio', emoji: '🏋️'),
  ];

  static List<Product> products = [
    Product(
      id: 1,
      categoryId: 'ropa',
      name: 'Chaqueta Cotrasen para Hombre',
      price: r'$119.99',
      emoji: '🧥',
      imageFileName: 'chaqueta_hombre.png',
      copy:
          'Chaqueta de trabajo impermeable, de lona de pato, forro sherpa térmica y cálida con múltiples bolsillos. La protección absoluta para tus viajes más fríos.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Cotrasen+Chaqueta+de+trabajo+para+hombre&tag=idarthur-20',
    ),
    Product(
      id: 2,
      categoryId: 'ropa',
      name: 'Abrigo MAGCOMSEN para Mujer',
      price: r'$72.98',
      emoji: '🧥',
      imageFileName: 'chaqueta_mujer.png',
      copy:
          'Abrigo de invierno 3 en 1, chaqueta de esquí impermeable, cortavientos con forro polar y parka. Diseño elegante y máxima protección térmica.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=MAGCOMSEN+Abrigos+de+invierno+3+en+1+para+mujer&tag=idarthur-20',
    ),
    Product(
      id: 3,
      categoryId: 'equipaje',
      name: 'Cámara Blink Mini 2K+',
      price: r'$39.99',
      emoji: '📷',
      imageFileName: 'camara_seguridad.png',
      copy:
          'Cámara interior inteligente. Ve a tus mascotas o el interior de tu casa en resolución 2K mientras viajas, con visión nocturna a color y detección de movimiento.',
      bestseller: false,
      affiliateLink: 'https://www.amazon.com/dp/B0F3B4PPGM?tag=idarthur-20',
    ),
    Product(
      id: 4,
      categoryId: 'cuidado',
      name: 'Botiquín CTIME Organizador',
      price: r'$29.99',
      emoji: '🩹',
      imageFileName: 'botiquin_viaje.png',
      copy:
          'Organizador de medicamentos XL de 4 niveles. Botiquín portátil premium para tener todo a la mano en casa rodante, viajes o campamentos.',
      bestseller: false,
      affiliateLink: 'https://www.amazon.com/dp/B0FH239CV6?tag=idarthur-20',
    ),
    Product(
      id: 5,
      categoryId: 'equipaje',
      name: 'Maleta de Viaje Premium',
      price: r'$149.99',
      emoji: '🧳',
      imageFileName: 'equipaje_premium.png',
      copy:
          'Elegancia, resistencia y capacidad. Diseñada con tecnología de policarbonato ultraligero y candado TSA integrado. El equipaje perfecto para recorrer el mundo con estilo.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Premium+Polycarbonate+Luggage+Travel+Suitcase&tag=idarthur-20',
    ),
    Product(
      id: 6,
      categoryId: 'cuidado',
      name: 'Oud Royale - Perfume Árabe Elegante',
      price: r'$120.50',
      emoji: '🧴',
      imageFileName: 'perfume_arabe.jpg',
      copy:
          'Deja una huella inolvidable en cada aeropuerto. Notas exóticas de madera de Oud y especias orientales en un envase de lujo. El aroma exclusivo del viajero sofisticado.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Arabian+Oud+Luxury+Perfume&tag=idarthur-20',
    ),
    Product(
      id: 7,
      categoryId: 'mascotas',
      name: 'Comedero Automático Inteligente',
      price: r'$69.99',
      emoji: '🐶',
      imageFileName: 'comedero_inteligente.png',
      copy:
          'Alimenta y monitorea a tus mascotas desde cualquier lugar. Programa porciones y horarios con cámara integrada para verlas mientras viajas.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Automatic+Pet+Feeder+with+Camera&tag=idarthur-20',
    ),
    Product(
      id: 8,
      categoryId: 'mascotas',
      name: 'GPS Localizador para Mascotas',
      price: r'$25.99',
      emoji: '🐾',
      imageFileName: 'gps_mascota.png',
      copy:
          'Rastreador GPS con app dedicada. Perfecto para saber siempre dónde está tu peludo, incluso en destinos nuevos y desconocidos.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=GPS+Tracker+for+Pets+Collars&tag=idarthur-20',
    ),
    Product(
      id: 9,
      categoryId: 'entretenimiento',
      name: 'Consola de Juegos Portátil',
      price: r'$199.99',
      emoji: '🎮',
      imageFileName: 'juego_portatil.jpg',
      copy:
          'Horas de diversión asegurada en vuelos largos o escalas. Catálogo infinito de juegos retro y modernos en formato de bolsillo.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Portable+Game+Console&tag=idarthur-20',
    ),
    Product(
      id: 10,
      categoryId: 'mascotas',
      name: 'Mochila de Transporte para Mascotas',
      price: r'$32.99',
      emoji: '🎒',
      imageFileName: 'mochila_mascota.png',
      copy:
          'Lleva a tu mascota cómoda y segura en aviones, trenes o caminatas. Ventanas transpirables, base acolchada y diseño ergonómico.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Pet+Carrier+Backpack+Airline+Approved&tag=idarthur-20',
    ),
    Product(
      id: 11,
      categoryId: 'entretenimiento',
      name: 'Nintendo Switch OLED',
      price: r'$349.99',
      emoji: '🎮',
      imageFileName: 'juego_portatil.jpg',
      copy:
          'Horas de diversión asegurada en vuelos largos o escalas. Pantalla OLED vibrante, mandos desmontables y una librería de juegos infinita.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Nintendo+Switch+OLED&tag=idarthur-20',
    ),
    Product(
      id: 12,
      categoryId: 'tecnologia',
      name: 'Laptop ASUS Vivobook Go 15',
      price: r'$349.99',
      emoji: '💻',
      imageFileName: 'laptop_asus.jpg',
      copy:
          'Ideal para productividad en casa, oficina o viajes. Pantalla de 15.6 pulgadas FHD, procesador AMD Ryzen 3, 8GB de RAM y 256GB SSD.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=ASUS+Vivobook+Go+15+Laptop&tag=idarthur-20',
    ),
    Product(
      id: 13,
      categoryId: 'tecnologia',
      name: 'Memoria RAM Kingston FURY Beast DDR5 32GB',
      price: r'$105.00',
      emoji: '💾',
      imageFileName: 'ram_kingston.jpg',
      copy:
          'Eleva la velocidad de tu computadora. Kit de 2 módulos de 16GB con disipador de calor de perfil bajo y overclocking automático.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Kingston+FURY+Beast+DDR5+32GB&tag=idarthur-20',
    ),
    Product(
      id: 14,
      categoryId: 'hogar_oficina',
      name: 'Cojín Ergonómico de Espuma de Memoria',
      price: r'$35.99',
      emoji: '🪑',
      imageFileName: 'cojin_ergonomico.jpg',
      copy:
          'Protege tu postura en largas jornadas de trabajo en la oficina o durante viajes largos en automóvil. Diseño ortopédico que alivia la presión del coxis.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Memory+Foam+Ergonomic+Seat+Cushion+Office&tag=idarthur-20',
    ),
    Product(
      id: 15,
      categoryId: 'hogar_oficina',
      name: 'Lámpara LED con Cargador Inalámbrico',
      price: r'$28.50',
      emoji: '💡',
      imageFileName: 'lampara_escritorio.jpg',
      copy:
          'Estilo minimalista para tu hogar u oficina. 5 modos de color, 10 niveles de brillo, puerto USB y carga rápida inalámbrica para tu celular.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=LED+Desk+Lamp+Wireless+Charger&tag=idarthur-20',
    ),
    Product(
      id: 16,
      categoryId: 'fitness',
      name: 'Mancuernas Ajustables Premium (Par)',
      price: r'$189.99',
      emoji: '🏋️',
      imageFileName: 'mancuernas_ajustables.jpg',
      copy:
          'Entrena en casa como en el gimnasio. Sistema de selección rápida de peso que reemplaza hasta 15 mancuernas individuales.',
      bestseller: true,
      affiliateLink:
          'https://www.amazon.com/s?k=Adjustable+Dumbbell+Set+Pair&tag=idarthur-20',
    ),
    Product(
      id: 17,
      categoryId: 'fitness',
      name: 'Set de Bandas de Resistencia Elásticas',
      price: r'$18.50',
      emoji: '🏃',
      imageFileName: 'bandas_resistencia.jpg',
      copy:
          'Tu gimnasio portátil favorito. 5 bandas de diferentes intensidades, anclaje de puerta y correas para tobillos. Entrena en cualquier habitación de hotel.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Resistance+Bands+Workout+Set&tag=idarthur-20',
    ),
    Product(
      id: 18,
      categoryId: 'cuidado',
      name: 'Sérum Facial de Ácido Hialurónico',
      price: r'$24.99',
      emoji: '✨',
      imageFileName: 'serum_hidratante.jpg',
      copy:
          'Mantén tu rostro fresco y radiante del estrés diario. Fórmula de rápida absorción que hidrata profundamente, rellena líneas de expresión y mejora la elasticidad.',
      bestseller: false,
      affiliateLink:
          'https://www.amazon.com/s?k=Hyaluronic+Acid+Serum+Moisturizer&tag=idarthur-20',
    ),
  ];

  static String categoryName(String id) {
    for (final c in categories) {
      if (c.id == id) return '${c.emoji} ${c.name}';
    }
    return 'General';
  }
}
