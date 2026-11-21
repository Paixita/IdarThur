import 'package:idarthur_app/widgets/content_image.dart';
import 'dart:async';

import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../data/stories/stories_data.dart';
import '../models/story.dart';
import '../services/speech_service.dart';

class HistoriasScreen extends StatelessWidget {
  const HistoriasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '📖 Historias de viaje',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppColors.foreground,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.success,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Relatos curados por Yessel y la IA del equipo',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: AppColors.mutedText,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
              itemCount: travelStories.length,
              itemBuilder: (context, index) {
                final story = travelStories[index];

                return Padding(
                  padding: const EdgeInsets.only(bottom: 18),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(22),
                    onTap: () => _showStory(context, story),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.08),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(22),
                            ),
                            child: ContentImage(
                              story.imageUrl,
                              height: 210,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (_, _, _) => Container(
                                height: 210,
                                color: AppColors.primary.withValues(
                                  alpha: 0.12,
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.image_not_supported_rounded,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.primary.withValues(
                                          alpha: 0.12,
                                        ),
                                        borderRadius: BorderRadius.circular(
                                          999,
                                        ),
                                      ),
                                      child: Text(
                                        story.category,
                                        style: const TextStyle(
                                          color: AppColors.primary,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      story.date.year.toString(),
                                      style: const TextStyle(
                                        color: AppColors.mutedText,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  story.title,
                                  style: const TextStyle(
                                    fontSize: 21,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.foreground,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  story.subtitle ?? story.location,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: AppColors.mutedText,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  story.narration,
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    height: 1.5,
                                    color: AppColors.foreground.withValues(
                                      alpha: 0.8,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    'Leer historia →',
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showStory(BuildContext context, Story story) {
    showDialog(
      context: context,
      builder: (_) => _StoryDialog(story: story),
    );
  }
}

class _StoryDialog extends StatefulWidget {
  final Story story;

  const _StoryDialog({required this.story});

  @override
  State<_StoryDialog> createState() => _StoryDialogState();
}

class _StoryDialogState extends State<_StoryDialog> {
  final SpeechService _speech = SpeechService.instance;
  bool _isSpeaking = false;

  Future<void> _toggleSpeech() async {
    if (_isSpeaking) {
      setState(() => _isSpeaking = false);
      await _speech.stop();
      return;
    }

    setState(() => _isSpeaking = true);
    try {
      await _speech.speak(widget.story.narration);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No fue posible reproducir la voz.')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSpeaking = false);
    }
  }

  @override
  void dispose() {
    unawaited(_speech.stop());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final story = widget.story;
    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.sizeOf(context).height * 0.86,
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: ContentImage(
                  story.imageUrl,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => Container(
                    height: 200,
                    color: AppColors.primary.withValues(alpha: 0.12),
                    child: const Center(
                      child: Icon(Icons.landscape_rounded, size: 42),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                story.title,
                style: const TextStyle(
                  color: AppColors.foreground,
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${story.author} · ${story.location}',
                style: const TextStyle(
                  color: AppColors.mutedText,
                  fontSize: 12.5,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _toggleSpeech,
                  icon: Icon(
                    _isSpeaking ? Icons.stop_rounded : Icons.play_arrow_rounded,
                  ),
                  label: Text(
                    _isSpeaking ? 'Detener relato' : 'Escuchar relato',
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                story.narration,
                style: const TextStyle(
                  height: 1.7,
                  color: AppColors.foreground,
                ),
              ),
              const SizedBox(height: 18),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cerrar'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
