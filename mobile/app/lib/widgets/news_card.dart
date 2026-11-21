import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../models/news_article.dart';
import 'glass_card.dart';

/// Tarjeta de noticia global con indicador de severidad de alerta.
class NewsCard extends StatelessWidget {
  final NewsArticle article;

  const NewsCard({super.key, required this.article});

  Future<void> _openLink() async {
    final uri = Uri.parse(article.link);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 14),
      borderRadius: 16,
      padding: const EdgeInsets.all(16),
      onTap: _openLink,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Fila superior: agente + fecha + severidad
          Row(
            children: [
              Expanded(
                child: Text(
                  article.agent,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.mutedText,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: article.severityColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: article.severityColor.withValues(alpha: 0.5),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 7,
                      height: 7,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: article.severityColor,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      article.severityLabel,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: article.severityColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Título
          Text(
            article.title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.foreground,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 8),

          // Descripción
          Text(
            article.desc,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.mutedText,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 10),

          // Fecha + leer más
          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 12,
                color: AppColors.mutedText,
              ),
              const SizedBox(width: 6),
              Text(
                article.date,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.mutedText,
                ),
              ),
              const Spacer(),
              const Text(
                'Leer más →',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
