import 'content_service.dart';
import 'dart:async';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class SpeechService {
  SpeechService._();
  static final instance = SpeechService._();
  final AudioPlayer _player = AudioPlayer();
  final FlutterTts _tts = FlutterTts();
  int _session = 0;
  Completer<void>? _completion;
  String clean(String text) => text
      .replaceAll(
        RegExp(
          r'\n\n(?:Fuentes consultadas|Sources checked|Sources consultées) \([\s\S]*$',
        ),
        '',
      )
      .replaceAllMapped(RegExp(r'\[([^\]]+)\]\([^)]*\)'), (m) => m[1]!)
      .replaceAll(RegExp(r'https?://\S+'), '')
      .replaceAll(RegExp(r'<[^>]+>'), ' ')
      .replaceAll(RegExp(r'[*#_|~`]'), '')
      .trim();
  List<String> chunks(String text) {
    final words = text.split(RegExp(r'\s+'));
    final result = <String>[];
    var part = '';
    for (final word in words) {
      if (part.length + word.length > 340 && part.isNotEmpty) {
        result.add(part);
        part = '';
      }
      part = part.isEmpty ? word : '$part $word';
    }
    if (part.isNotEmpty) result.add(part);
    return result;
  }

  Future<void> speak(
    String text, {
    String language = 'es',
    String voiceGender = 'male',
  }) async {
    await stop();
    final session = _session;
    final rows = ContentService.content['stories'] as List? ?? [];
    final recordings = rows
        .where((v) => v['narrativaTexto'] == text && v['audio'] is String)
        .toList();
    if (recordings.isNotEmpty && language == 'es' && voiceGender == 'male') {
      final completion = Completer<void>();
      _completion = completion;
      final sub = _player.onPlayerComplete.listen((_) {
        if (!completion.isCompleted) completion.complete();
      });
      try {
        await _player.play(
          UrlSource('${AppConfig.apiBaseUrl}${recordings.first['audio']}'),
        );
        await completion.future;
        return;
      } catch (_) {
        if (session != _session) return;
      } finally {
        await sub.cancel();
      }
    }
    final parts = chunks(clean(text));
    if (parts.isEmpty) return;
    Future<http.Response> load(String part) => http
        .get(
          Uri.parse(AppConfig.apiTts).replace(
            queryParameters: {
              'text': part,
              'lang': language,
              'gender': voiceGender,
              'v': '5',
            },
          ),
        )
        .timeout(const Duration(seconds: 55));
    Future<http.Response>? pending = load(parts.first);
    for (var i = 0; i < parts.length; i++) {
      if (session != _session) return;
      try {
        final response = await pending!;
        if (session != _session) return;
        if (response.statusCode != 200 ||
            !(response.headers['content-type'] ?? '').startsWith('audio/')) {
          throw StateError('Voz no disponible');
        }
        pending = i + 1 < parts.length ? load(parts[i + 1]) : null;
        // Attach error handler immediately while the next audio is being prefetched.
        pending?.ignore();
        final done = Completer<void>();
        _completion = done;
        final sub = _player.onPlayerComplete.listen((_) {
          if (!done.isCompleted) done.complete();
        });
        try {
          await _player.play(
            BytesSource(
              response.bodyBytes,
              mimeType: response.headers['content-type'],
            ),
          );
          await done.future.timeout(const Duration(minutes: 3));
        } finally {
          await sub.cancel();
        }
      } catch (e) {
        if (session != _session) return;
        final voices = await _tts.getVoices;
        final candidates = (voices as List)
            .where(
              (v) =>
                  v is Map &&
                  (v['locale'] as String? ?? '').toLowerCase().startsWith(
                    language.toLowerCase(),
                  ) &&
                  (v['gender']?.toString().toLowerCase() == voiceGender ||
                      RegExp(
                        voiceGender == 'female'
                            ? r'female|femenina|dora|denise|siwis'
                            : r'(?<!fe)male|masculino|alvaro|henri|alex',
                        caseSensitive: false,
                      ).hasMatch(v['name'].toString())),
            )
            .toList();
        if (candidates.isEmpty) rethrow;
        if (session != _session) return;
        final v = candidates.first as Map;
        await _tts.setVoice({
          'name': v['name'].toString(),
          'locale': v['locale'].toString(),
        });
        await _tts.awaitSpeakCompletion(true);
        await _tts.speak(parts.sublist(i).join(' '));
        return;
      }
    }
  }

  Future<void> stop() async {
    _session++;
    final completion = _completion;
    _completion = null;
    if (completion != null && !completion.isCompleted) completion.complete();
    await _player.stop();
    await _tts.stop();
  }
}
