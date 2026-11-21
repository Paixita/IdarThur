import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';
import '../models/product.dart';
import '../models/story.dart';
import '../data/stories/stories_data.dart';
import 'api_client.dart';

class ContentService {
  static final revision = ValueNotifier<int>(0);
  static Map<String, dynamic> content = {};
  static bool cached = false;
  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('mobile:content');
    try {
      apply(
        jsonDecode(saved ?? await rootBundle.loadString('assets/content.json'))
            as Map<String, dynamic>,
      );
    } catch (_) {
      apply(
        jsonDecode(await rootBundle.loadString('assets/content.json'))
            as Map<String, dynamic>,
      );
    }
    final origin = prefs.getString('mobile:origin');
    if (origin != null && allowedOrigin(origin)) AppConfig.apiBaseUrl = origin;
  }

  static bool allowedOrigin(String value) {
    final u = Uri.tryParse(value);
    return u != null &&
        u.scheme == 'https' &&
        u.userInfo.isEmpty &&
        u.port == 443 &&
        (u.host == 'www.idarthur.com' ||
            u.host == 'api.idarthur.com' ||
            u.host == 'app.idarthur.com' ||
            u.host.endsWith('.vercel.app'));
  }

  static Future<void> refresh() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final res = await http
          .get(Uri.parse(AppConfig.channelUrl))
          .timeout(const Duration(seconds: 8));
      if (res.statusCode == 200) {
        final channel = jsonDecode(res.body) as Map<String, dynamic>;
        final origin = channel['apiOrigin'];
        if (origin is String && allowedOrigin(origin)) {
          AppConfig.apiBaseUrl = origin;
          await prefs.setString('mobile:origin', origin);
        }
      }
    } catch (_) {}
    final result = await ApiClient.getJson(AppConfig.apiCatalog);
    if (result.isSuccess) {
      try {
        apply(result.data!);
        cached = result.data!['_offline'] == true;
        await prefs.setString('mobile:content', jsonEncode(result.data));
        revision.value++;
      } catch (_) {}
    }
  }

  static void apply(Map<String, dynamic> data) {
    if (data['schemaVersion'] != 1 ||
        data['products'] is! List ||
        data['stories'] is! List) {
      throw const FormatException('Contenido incompatible');
    }
    final products = (data['products'] as List).map((v) {
      final p = v as Map<String, dynamic>;
      return Product(
        id: p['id'] as int,
        categoryId: p['categoryId'] as String,
        name: p['name'] as String,
        price: p['price'] as String,
        emoji: '🧳',
        imageFileName: p['img'] as String,
        copy: p['copy'] as String,
        bestseller: p['bestseller'] == true,
        affiliateLink: p['affiliateLink'] as String,
      );
    }).toList();
    final stories = (data['stories'] as List).map((v) {
      final s = v as Map<String, dynamic>;
      return Story(
        id: s['id'] as String,
        title: s['titulo'] as String,
        author: s['autor'] as String? ?? 'Equipo IdarThur',
        date:
            DateTime.tryParse(s['fecha'] as String? ?? '') ??
            DateTime(2026, 11, 20),
        location: s['lugar'] as String? ?? '',
        category: s['tipo'] as String? ?? 'Relato',
        narration: s['narrativaTexto'] as String,
        imageUrl: '${AppConfig.apiBaseUrl}${s['imagen']}',
        subtitle: s['resumen'] as String?,
      );
    }).toList();
    StoreData.products = products;
    travelStories = stories;
    content = data;
  }
}
