import '../models/agent.dart';
import 'content_service.dart';
import 'dart:async';
import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
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
      final limit = result.isEmpty ? 75 : 195;
      if (part.isNotEmpty && part.length + word.length + 1 > limit) {
        result.add(part);
        part = '';
      }
      part = part.isEmpty ? word : '$part $word';
      if (part.length >= (result.isEmpty ? 20 : 80) &&
          RegExp(r'[.!?…]$').hasMatch(word)) {
        result.add(part);
        part = '';
      }
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
    final greeting = text == AgentsData.yessel.greeting;
    if ((greeting || recordings.isNotEmpty) &&
        language == 'es' &&
        voiceGender == 'male') {
      final completion = Completer<void>();
      _completion = completion;
      final sub = _player.onPlayerComplete.listen((_) {
        if (!completion.isCompleted) completion.complete();
      });
      try {
        await _player.play(
          greeting
              ? AssetSource('voz/invitacion.mp3')
              : UrlSource(
                  '${AppConfig.apiBaseUrl}${recordings.first['audio']}',
                ),
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
        .post(
          Uri.parse(AppConfig.apiTts),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'text': part,
            'lang': language,
            'gender': voiceGender,
          }),
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
        Directory? scratch;
        try {
          scratch = await (await getTemporaryDirectory()).createTemp('yessel-');
          final wav = File('${scratch.path}/voz.wav');
          await wav.writeAsBytes(response.bodyBytes, flush: true);
          if (session != _session) return;
          await _player.play(DeviceFileSource(wav.path, mimeType: 'audio/wav'));
          await done.future.timeout(const Duration(minutes: 3));
        } finally {
          await sub.cancel();
          if (scratch != null) await scratch.delete(recursive: true);
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
    try {
      await _tts.stop();
    } on Exception {
      /* El motor local es opcional. */
    }
  }
}
