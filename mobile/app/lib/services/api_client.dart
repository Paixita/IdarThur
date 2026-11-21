import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

class ApiResult<T> {
  final T? data;
  final String? error;
  const ApiResult.success(this.data) : error = null;
  const ApiResult.failure(this.error) : data = null;
  bool get isSuccess => error == null;
}

class ApiClient {
  static http.Client client = http.Client();
  ApiClient._();
  static String get baseUrl => AppConfig.apiBaseUrl;
  static Future<ApiResult<Map<String, dynamic>>> getJson(
    String url, {
    Map<String, String>? headers,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final res = await client
          .get(Uri.parse(url), headers: headers)
          .timeout(const Duration(seconds: 20));
      final result = _decode(res);
      if (result.isSuccess) {
        await prefs.setString(
          'cache:$url',
          jsonEncode({
            'at': DateTime.now().toUtc().toIso8601String(),
            'body': result.data,
          }),
        );
      }
      if (result.isSuccess) return result;
    } catch (_) {}
    final cached = prefs.getString('cache:$url');
    if (cached != null) {
      final record = jsonDecode(cached) as Map<String, dynamic>;
      if (DateTime.now()
              .difference(DateTime.parse(record['at'] as String))
              .inDays <
          7) {
        return ApiResult.success({
          ...record['body'] as Map<String, dynamic>,
          '_offline': true,
          '_cachedAt': record['at'],
        });
      }
    }
    return const ApiResult.failure(
      'No se pudo conectar. Puedes seguir explorando el contenido guardado e intentar más tarde.',
    );
  }

  static Future<ApiResult<Map<String, dynamic>>> postJson(
    String url,
    Map<String, dynamic> body, {
    Map<String, String>? headers,
  }) async {
    try {
      return _decode(
        await client
            .post(
              Uri.parse(url),
              headers: {'Content-Type': 'application/json', ...?headers},
              body: jsonEncode(body),
            )
            .timeout(const Duration(seconds: 120)),
      );
    } catch (_) {
      return const ApiResult.failure(
        'Yessel no está disponible en este momento. Tu conversación sigue aquí; intenta nuevamente.',
      );
    }
  }

  static ApiResult<Map<String, dynamic>> _decode(http.Response res) {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return ApiResult.failure(
        'El servicio no está disponible (HTTP ${res.statusCode}). Intenta más tarde.',
      );
    }
    try {
      final body = jsonDecode(utf8.decode(res.bodyBytes));
      if (body is Map<String, dynamic>) return ApiResult.success(body);
    } catch (_) {}
    return const ApiResult.failure(
      'No se pudo interpretar la respuesta del servicio.',
    );
  }
}
