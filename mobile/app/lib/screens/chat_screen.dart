import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../models/agent.dart';
import '../widgets/yessel_chat_view.dart';

/// Pantalla de chat a pantalla completa. Se usa para hablar con
/// Yessel (botón flotante) o con un agente del escuadrón.
class ChatScreen extends StatelessWidget {
  final Agent? agent;
  final String? initialMessage;

  const ChatScreen({super.key, this.agent, this.initialMessage});

  @override
  Widget build(BuildContext context) {
    final selectedAgent = agent;
    final chatView = selectedAgent != null
        ? YesselChatView.forAgent(selectedAgent, initialPrompt: initialMessage)
        : YesselChatView.forAgent(
            AgentsData.yessel,
            initialPrompt: initialMessage,
          );

    final title = selectedAgent?.name ?? AppConfig.brandName;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(
          title,
          style: const TextStyle(
            color: AppColors.foreground,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new_rounded,
            color: AppColors.mutedText,
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        centerTitle: true,
      ),
      body: chatView,
    );
  }
}
