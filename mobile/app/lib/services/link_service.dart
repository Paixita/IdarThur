import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../screens/feature_screens.dart';
import '../screens/tienda_screen.dart';
import '../screens/historias_screen.dart';
import '../screens/noticias_screen.dart';
import '../screens/settings_screen.dart';

String? nativeRoute(String href) {
  final uri = Uri.tryParse(href);
  if (uri == null) return null;
  if (href.startsWith('#')) return '/tienda';
  if (uri.hasScheme &&
      !(uri.scheme == 'https' &&
          {
            Uri.parse(AppConfig.webUrl).host,
            Uri.parse(AppConfig.apiBaseUrl).host,
          }.contains(uri.host))) {
    return null;
  }
  final path = uri.path;
  if (path == '/peru' ||
      path == '/tienda' ||
      path == '/autos' ||
      path == '/hoteles' ||
      path == '/agentes' ||
      path == '/noticias') {
    return path;
  }
  if (path.startsWith('/historias')) return '/historias';
  if ([
    '/privacidad',
    '/terminos',
    '/cookies',
    '/afiliados',
    '/ia',
    '/app',
  ].contains(path)) {
    return '/ajustes';
  }
  return null;
}

Future<void> openChatLink(BuildContext context, String href) async {
  final route = nativeRoute(href);
  void news() => Navigator.push(
    context,
    MaterialPageRoute<void>(
      builder: (_) => const Scaffold(body: NoticiasScreen()),
    ),
  );
  final Widget? page = switch (route) {
    '/peru' => FeatureDetailScreen(
      feature: TravelFeature.peru,
      onOpenNews: news,
    ),
    '/autos' => FeatureDetailScreen(
      feature: TravelFeature.cars,
      onOpenNews: news,
    ),
    '/hoteles' => FeatureDetailScreen(
      feature: TravelFeature.vipPrices,
      onOpenNews: news,
    ),
    '/tienda' => const Scaffold(body: TiendaScreen()),
    '/historias' => const Scaffold(body: HistoriasScreen()),
    '/noticias' => const Scaffold(body: NoticiasScreen()),
    '/agentes' => const AgentSquadScreen(),
    '/ajustes' => const SettingsScreen(),
    _ => null,
  };
  if (page != null) {
    await Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (_) => page),
    );
    return;
  }
  final uri = Uri.tryParse(
    href.startsWith('/') ? AppConfig.webUrl + href : href,
  );
  if (uri != null && uri.scheme == 'https') {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }
}
