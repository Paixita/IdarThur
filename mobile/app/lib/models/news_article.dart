import 'package:flutter/material.dart';
import '../config/app_config.dart';

/// Artículo de noticias tal como lo devuelve la API de IdarThur
/// en `/api/noticias` (agregada desde Google News RSS).
class NewsArticle {
  final String id;
  final String category; // 'clima' | 'eventos'
  final String agent;
  final String title;
  final String desc;
  final String date;
  final String severity; // 'alta' | 'media' | 'baja'
  final String link;

  const NewsArticle({
    required this.id,
    required this.category,
    required this.agent,
    required this.title,
    required this.desc,
    required this.date,
    required this.severity,
    required this.link,
  });

  factory NewsArticle.fromJson(Map<String, dynamic> json) {
    return NewsArticle(
      id: (json['id'] ?? json['link'] ?? '').toString(),
      category: (json['category'] as String?) ?? 'clima',
      agent: (json['agent'] as String?) ?? 'Yessel 🌤️',
      title: (json['title'] as String?) ?? 'Sin título',
      desc: (json['desc'] as String?) ?? '',
      date:
          (json['publishedAt'] as String?)?.split('T').first ??
          json['date'] as String? ??
          '',
      severity: (json['severity'] as String?) ?? 'baja',
      link: (json['link'] as String?) ?? '',
    );
  }

  bool get isHighSeverity => severity == 'alta';
  bool get isMediumSeverity => severity == 'media';

  /// Color según la severidad (mismo criterio visual que la web).
  Color get severityColor {
    switch (severity) {
      case 'alta':
        return AppColors.accent;
      case 'media':
        return AppColors.gold;
      default:
        return AppColors.primary;
    }
  }

  String get severityLabel {
    switch (severity) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      default:
        return 'Baja';
    }
  }
}
