import '../config/app_config.dart';
import '../models/chat_message.dart';
import 'api_client.dart';

class ChatReply {
  final String reply, language, voiceGender;
  const ChatReply(this.reply, this.language, this.voiceGender);
}

class ChatService {
  ChatService._();
  static Future<ApiResult<ChatReply>> sendMessage({
    required String message,
    required String agentId,
    List<ChatMessage> messages = const [],
    String browserLanguage = 'es',
  }) async {
    var budget = 7000;
    final history = <Map<String, dynamic>>[];
    for (final m in messages.reversed.take(12)) {
      if (budget <= 0) break;
      final content = m.text.length > budget
          ? m.text.substring(0, budget)
          : m.text;
      history.insert(0, {
        'role': m.isUser ? 'user' : 'assistant',
        'content': content,
        'language': m.language,
      });
      budget -= content.length;
    }
    final result = await ApiClient.postJson(AppConfig.apiChat, {
      'message': message,
      'agentId': agentId,
      'messages': history,
      'browserLanguage': browserLanguage,
    });
    if (!result.isSuccess) return ApiResult.failure(result.error);
    final body = result.data!;
    if (body['reply'] is! String || (body['reply'] as String).isEmpty) {
      return const ApiResult.failure(
        'No se recibió respuesta. Intenta nuevamente.',
      );
    }
    return ApiResult.success(
      ChatReply(
        body['reply'] as String,
        body['language'] as String? ?? 'es',
        body['voiceGender'] as String? ??
            (agentId == 'cyberguard' ? 'female' : 'male'),
      ),
    );
  }
}
