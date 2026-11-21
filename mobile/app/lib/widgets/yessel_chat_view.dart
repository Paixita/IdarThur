import 'package:shared_preferences/shared_preferences.dart';
import '../screens/settings_screen.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../services/link_service.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../models/agent.dart';
import '../models/chat_message.dart';
import '../services/chat_service.dart';
import '../services/speech_service.dart';

/// Vista de chat reutilizable para hablar con Yessel y su escuadrón.
///
/// Conecta directamente con `/api/chat` de idarthur.com (cerebro Groq).
class YesselChatView extends StatefulWidget {
  final String? initialPrompt;
  final String agentId;
  final String title;
  final String subtitle;
  final String avatarEmoji;
  final Color accentColor;
  final List<ChatMessage> initialMessages;

  const YesselChatView({
    super.key,
    this.initialPrompt,
    required this.agentId,
    required this.title,
    required this.subtitle,
    required this.avatarEmoji,
    required this.accentColor,
    required this.initialMessages,
  });

  /// Atajo para crear una vista con un agente del catálogo.
  factory YesselChatView.forAgent(Agent agent, {String? initialPrompt}) {
    return YesselChatView(
      initialPrompt: initialPrompt,
      agentId: agent.id,
      title: agent.name,
      subtitle: agent.role,
      avatarEmoji: agent.emoji,
      accentColor: agent.color,
      initialMessages: agent.isPrivate
          ? const [ChatMessage(text: '🔒 Agente privado.', sender: 'ai')]
          : [ChatMessage(text: agent.greeting, sender: 'ai')],
    );
  }

  /// Atajo para la vista principal de Yessel (conserje).
  factory YesselChatView.defaultYessel() {
    return YesselChatView.forAgent(AgentsData.yessel);
  }

  @override
  State<YesselChatView> createState() => _YesselChatViewState();
}

class _YesselChatViewState extends State<YesselChatView> {
  late final List<ChatMessage> _messages;
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scroll = ScrollController();
  final SpeechService _speech = SpeechService.instance;
  final SpeechToText _recognizer = SpeechToText();
  bool _isLoading = false;
  int? _speakingMessageIndex;
  int _speechRequestId = 0;

  @override
  void initState() {
    super.initState();
    _messages = List.of(widget.initialMessages);
    if (widget.initialPrompt != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          _controller.text = widget.initialPrompt!;
          _send();
        }
      });
    }
  }

  @override
  void dispose() {
    _recognizer.cancel();
    _speechRequestId++;
    _speech.stop();
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _toggleSpeech(ChatMessage message, int index) async {
    final requestId = ++_speechRequestId;
    if (_speakingMessageIndex == index) {
      setState(() => _speakingMessageIndex = null);
      await _speech.stop();
      return;
    }

    await _speech.stop();
    if (!mounted || requestId != _speechRequestId) return;
    setState(() => _speakingMessageIndex = index);

    try {
      await _speech.speak(
        message.text,
        language: message.language,
        voiceGender: widget.agentId == 'cyberguard'
            ? 'female'
            : message.voiceGender,
      );
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No fue posible reproducir la voz.')),
        );
      }
    } finally {
      if (mounted && requestId == _speechRequestId) {
        setState(() => _speakingMessageIndex = null);
      }
    }
  }

  Future<void> _dictate() async {
    final accepted = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Dictado por voz'),
        content: const Text(
          'El servicio de reconocimiento de tu dispositivo usará el micrófono y puede procesar audio en sus servidores. El texto aparecerá para revisarlo antes de enviarlo a Yessel.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(c, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(c, true),
            child: const Text('Continuar'),
          ),
        ],
      ),
    );
    if (accepted != true || !mounted) return;
    final ready = await _recognizer.initialize();
    if (ready && mounted) {
      await _recognizer.listen(
        listenOptions: SpeechListenOptions(
          localeId: Localizations.localeOf(context).toLanguageTag(),
        ),
        onResult: (r) {
          if (mounted) _controller.text = r.recognizedWords;
        },
      );
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isLoading) return;
    final preferences = await SharedPreferences.getInstance();
    if (preferences.getBool('ai:consent:v1') != true) {
      if (!mounted) return;
      final consent = await showDialog<bool>(
        context: context,
        builder: (c) => AlertDialog(
          title: const Text('Antes de conversar con la IA'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'El texto y parte del historial se enviarán a IdarThur y Groq para generar respuestas. La IA puede equivocarse. No compartas datos sensibles. La voz usa el texto de la respuesta.',
              ),
              TextButton(
                onPressed: () => Navigator.push(
                  c,
                  MaterialPageRoute<void>(
                    builder: (_) => const SettingsScreen(),
                  ),
                ),
                child: const Text('Leer privacidad y uso de IA'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(c, false),
              child: const Text('Cancelar'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(c, true),
              child: const Text('Continuar con IA'),
            ),
          ],
        ),
      );
      if (consent != true || !mounted) return;
      await preferences.setBool('ai:consent:v1', true);
    }
    if (!mounted) return;

    // Comando secreto de la web para desbloquear voz VIP
    if (text == '/yessel-audio') {
      setState(() {
        _messages.add(
          const ChatMessage(
            text: '✅ ¡Voz VIP de Yessel desbloqueada con éxito!',
            sender: 'ai',
          ),
        );
        _controller.clear();
      });
      _scrollToBottom();
      return;
    }

    setState(() {
      _messages.add(ChatMessage(text: text, sender: 'user'));
      _controller.clear();
      _isLoading = true;
    });
    _scrollToBottom();

    final result = await ChatService.sendMessage(
      message: text,
      agentId: widget.agentId,
      messages: List.of(_messages),
      browserLanguage: Localizations.localeOf(context).toLanguageTag(),
    );

    if (!mounted) return;

    setState(() {
      _isLoading = false;
      _messages.add(
        ChatMessage(
          text: result.isSuccess
              ? result.data!.reply
              : result.error ?? 'No pude conectar. Intenta nuevamente.',
          sender: 'ai',
          language: result.data?.language ?? 'es',
          voiceGender:
              result.data?.voiceGender ??
              (widget.agentId == 'cyberguard' ? 'female' : 'male'),
        ),
      );
    });
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Text(
            'Hablas con una IA. Puede equivocarse; no compartas contraseñas, códigos ni documentos. Las reservas se confirman con el proveedor.',
            style: TextStyle(fontSize: 11, color: AppColors.mutedText),
          ),
        ),
        _buildMessageList(),
        _buildInputBar(),
      ],
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            widget.accentColor.withValues(alpha: 0.18),
            AppColors.surface,
          ],
        ),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(
          bottom: BorderSide(color: widget.accentColor.withValues(alpha: 0.3)),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  widget.accentColor,
                  widget.accentColor.withValues(alpha: 0.6),
                ],
              ),
              border: Border.all(
                color: widget.accentColor.withValues(alpha: 0.6),
                width: 2,
              ),
            ),
            child: widget.agentId == AgentsData.yessel.id
                ? ClipOval(
                    child: Image.network(
                      AppConfig.yesselImageUrl,
                      width: 44,
                      height: 44,
                      fit: BoxFit.cover,
                      cacheWidth: 132,
                      cacheHeight: 132,
                      errorBuilder: (_, _, _) => const Icon(
                        Icons.record_voice_over_rounded,
                        color: AppColors.foreground,
                      ),
                    ),
                  )
                : Center(
                    child: Text(
                      widget.avatarEmoji,
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: const TextStyle(
                    color: AppColors.foreground,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  widget.subtitle,
                  style: TextStyle(
                    color: widget.accentColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageList() {
    return Expanded(
      child: ListView.builder(
        controller: _scroll,
        padding: const EdgeInsets.all(16),
        itemCount: _messages.length + (_isLoading ? 1 : 0),
        itemBuilder: (context, index) {
          if (index >= _messages.length) {
            return const _TypingBubble();
          }
          return _MessageBubble(
            message: _messages[index],
            isSpeaking: _speakingMessageIndex == index,
            onSpeak: () => _toggleSpeech(_messages[index], index),
          );
        },
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _send(),
                enabled: !_isLoading,
                style: const TextStyle(color: AppColors.foreground),
                decoration: InputDecoration(
                  hintText: _isLoading ? 'Pensando...' : 'Escribe a Yessel...',
                  hintStyle: const TextStyle(color: AppColors.mutedText),
                  filled: true,
                  fillColor: Colors.white.withValues(alpha: 0.05),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
            ),
            IconButton(
              tooltip: 'Dictar mensaje',
              onPressed: _isLoading ? null : _dictate,
              icon: const Icon(Icons.mic_rounded),
            ),
            const SizedBox(width: 8),
            Material(
              color: AppColors.accent,
              borderRadius: BorderRadius.circular(15),
              child: InkWell(
                onTap: _isLoading ? null : _send,
                borderRadius: BorderRadius.circular(15),
                child: SizedBox(
                  height: 48,
                  width: 52,
                  child: Icon(
                    Icons.send_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final ChatMessage message;
  final bool isSpeaking;
  final VoidCallback onSpeak;

  const _MessageBubble({
    required this.message,
    required this.isSpeaking,
    required this.onSpeak,
  });

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.only(
          bottom: 10,
          left: isUser ? 32 : 0,
          right: isUser ? 0 : 32,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isUser
              ? const Color(0xFF45F3FF)
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(isUser ? 20 : 5),
            bottomRight: Radius.circular(isUser ? 5 : 20),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Flexible(
              child: MarkdownBody(
                sizedImageBuilder: (image) =>
                    Text(image.alt ?? 'Imagen externa'),
                data: message.text,
                selectable: true,
                onTapLink: (_, href, _) => openChatLink(context, href ?? ''),
                styleSheet: MarkdownStyleSheet(
                  p: TextStyle(
                    color: isUser ? AppColors.background : AppColors.foreground,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ),
            ),
            if (!isUser) ...[
              const SizedBox(width: 4),
              IconButton(
                onPressed: onSpeak,
                tooltip: isSpeaking ? 'Detener audio' : 'Escuchar respuesta',
                visualDensity: VisualDensity.compact,
                constraints: const BoxConstraints.tightFor(
                  width: 36,
                  height: 36,
                ),
                padding: EdgeInsets.zero,
                icon: Icon(
                  isSpeaking ? Icons.stop_rounded : Icons.volume_up_rounded,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _TypingBubble extends StatelessWidget {
  const _TypingBubble();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10, right: 32),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.02),
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
            bottomRight: Radius.circular(20),
            bottomLeft: Radius.circular(5),
          ),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 12,
              height: 12,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.primary,
              ),
            ),
            SizedBox(width: 10),
            Text(
              'Escribiendo...',
              style: TextStyle(
                color: AppColors.mutedText,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Botón flotante de Yessel, omnipresente en toda la app (como en la web).
class YesselFloatingButton extends StatelessWidget {
  final VoidCallback onTap;

  const YesselFloatingButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: onTap,
      backgroundColor: const Color(0xFF45F3FF),
      shape: const CircleBorder(),
      child: ClipOval(
        child: Image.network(
          AppConfig.yesselImageUrl,
          width: 56,
          height: 56,
          fit: BoxFit.cover,
          cacheWidth: 168,
          cacheHeight: 168,
          errorBuilder: (_, _, _) => const Icon(
            Icons.record_voice_over_rounded,
            color: AppColors.background,
            size: 28,
          ),
        ),
      ),
    );
  }
}
