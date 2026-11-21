/// Configuración central de la aplicación IdarThur.
///
/// Las URLs apuntan al backend y frontend desplegados en Render.
library;

import 'dart:ui';

class AppConfig {
  AppConfig._();

  // ─── Marca ────────────────────────────────────────────────────────────
  static const String brandName = 'IdarThur';
  static const String tagline = 'Tu guía inteligente de viajes';
  static const String description =
      'Vuelos, Hoteles, Cruceros y Noticias Globales con el poder de la IA. Explora el mundo con nosotros.';
  static const String supportEmail = 'soporte@idarthur.com';
  static const String webUrl = 'https://www.idarthur.com';
  static String apiBaseUrl = const String.fromEnvironment(
    'MOBILE_API_ORIGIN',
    defaultValue: 'https://idarthur-mobile-api.vercel.app',
  );
  static const channelUrl =
      'https://raw.githubusercontent.com/Paixita/IdarThur/main/mobile/channel.json';
  static String get logoImageUrl => '$apiBaseUrl/logo_blue.png';
  static String get yesselImageUrl => '$apiBaseUrl/yessel_avatar.png';
  static String get apiNoticias => '$apiBaseUrl/api/noticias';
  static String get apiChat => '$apiBaseUrl/api/chat';
  static String get apiTts => '$apiBaseUrl/api/tts';
  static String get apiStories => '$apiBaseUrl/api/mobile/catalog';
  static String get apiSearch => '$apiBaseUrl/api/search';
  static String get apiCatalog => '$apiBaseUrl/api/mobile/catalog';

  // ─── Afiliados ────────────────────────────────────────────────────────
  static const String amazonTag = 'idarthur-20';

  // ─── Redes sociales ───────────────────────────────────────────────────
  static const String whatsapp = 'https://wa.me/573000000000';
  static const String instagram = 'https://instagram.com/idarthur';
  static const String facebook = 'https://facebook.com/idarthur';

  // ─── URLs de reserva de socios ────────────────────────────────────────
  static const String partnerHotelUrl =
      'https://www.booking.com/searchresults.es.html?label=affnetTP_399989189573503';
  static const String partnerCarUrl =
      'https://www.discovercars.com/?a_aid=IdarThur';
  static const String partnerAwayUrl =
      'https://www.aviasales.com/?marker=729418';
}

/// Paleta oficial de IdarThur (Dark / Glassmorphism / Neón)
class AppColors {
  AppColors._();

  static const Color background = Color(0xFF0B0C10);
  static const Color surface = Color(0xFF0A0F1A);
  static const Color foreground = Color(0xFFFFFFFF);
  static const Color mutedText = Color(0xFFA0AAB5);
  static const Color primary = Color(0xFF45F3FF); // cian neón
  static const Color secondary = Color(0xFF0088FF); // azul
  static const Color accent = Color(0xFFFF2A5F); // rosa/magenta
  static const Color gold = Color(0xFFFFD700);
  static const Color success = Color(0xFF00FFAA);
}
