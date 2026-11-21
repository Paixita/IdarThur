class ChatMessage {
  final String text;
  final String sender;
  final String language;
  final String voiceGender;
  const ChatMessage({
    required this.text,
    required this.sender,
    this.language = 'es',
    this.voiceGender = 'male',
  });
  bool get isUser => sender == 'user';
  Map<String, dynamic> toApi() => {
    'role': isUser ? 'user' : 'assistant',
    'content': text,
    'language': language,
  };
}
