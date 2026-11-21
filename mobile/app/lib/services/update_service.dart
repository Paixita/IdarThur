import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:crypto/crypto.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:path_provider/path_provider.dart';
import '../config/app_config.dart';
import 'content_service.dart';

class AppUpdate {
  final int code, size;
  final String version, url, hash, notes;
  const AppUpdate(
    this.code,
    this.size,
    this.version,
    this.url,
    this.hash,
    this.notes,
  );
  static AppUpdate? parse(Map<String, dynamic> data, int installed) {
    if (data['versionCode'] is! int ||
        (data['versionCode'] as int) <= installed) {
      return null;
    }
    final url = Uri.tryParse(data['apkUrl'] as String? ?? '');
    if (url == null ||
        url.scheme != 'https' ||
        !ContentService.allowedOrigin(url.origin) ||
        !RegExp(r'^[a-f0-9]{64}$').hasMatch(data['sha256'] as String? ?? '') ||
        data['sizeBytes'] is! int ||
        (data['sizeBytes'] as int) > 150000000 ||
        (data['sizeBytes'] as int) < 1000000) {
      return null;
    }
    return AppUpdate(
      data['versionCode'] as int,
      data['sizeBytes'] as int,
      data['versionName'] as String? ?? '',
      url.toString(),
      data['sha256'] as String,
      data['releaseNotes'] as String? ?? '',
    );
  }
}

class UpdateService {
  static const _channel = MethodChannel('com.idarthur.app/updates');
  static Future<AppUpdate?> check() async {
    if (kIsWeb || !Platform.isAndroid) return null;
    try {
      final installed = await PackageInfo.fromPlatform();
      final res = await http
          .get(Uri.parse(AppConfig.channelUrl))
          .timeout(const Duration(seconds: 12));
      if (res.statusCode != 200) return null;
      return AppUpdate.parse(
        jsonDecode(res.body) as Map<String, dynamic>,
        int.tryParse(installed.buildNumber) ?? 0,
      );
    } catch (_) {
      return null;
    }
  }

  static Future<void> install(AppUpdate update) async {
    if (kIsWeb || !Platform.isAndroid) {
      throw StateError('Disponible para Android');
    }
    final response = await http
        .get(Uri.parse(update.url))
        .timeout(const Duration(minutes: 4));
    if (response.statusCode != 200 ||
        response.bodyBytes.length != update.size ||
        sha256.convert(response.bodyBytes).toString() != update.hash) {
      throw StateError('No se pudo verificar la descarga. No se instalará.');
    }
    final cache = await getTemporaryDirectory();
    final dir = Directory('${cache.path}/updates');
    await dir.create(recursive: true);
    final file = File('${dir.path}/idarthur-${update.code}.apk');
    await file.writeAsBytes(response.bodyBytes, flush: true);
    await _channel.invokeMethod('install', {'path': file.path});
  }
}
