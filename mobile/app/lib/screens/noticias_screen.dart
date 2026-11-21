import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../models/news_article.dart';
import '../services/news_service.dart';
import '../widgets/module_card.dart';
import '../widgets/news_card.dart';

/// Noticias globales de viajes, climatología y eventos.
/// Consume la API de idarthur.com (`/api/noticias`).
class NoticiasScreen extends StatefulWidget {
  const NoticiasScreen({super.key});

  @override
  State<NoticiasScreen> createState() => _NoticiasScreenState();
}

class _NoticiasScreenState extends State<NoticiasScreen> {
  List<NewsArticle>? _articles;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final result = await NewsService.fetchNews();

      if (!mounted) return;

      setState(() {
        _loading = false;
        if (result.isSuccess) {
          _articles = result.data;
        } else {
          _error = result.error;
        }
      });
    } catch (_) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = 'No pudimos cargar las noticias. Vuelve a intentarlo.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          if (NewsService.fromCache)
            Padding(
              padding: const EdgeInsets.all(14),
              child: Text(
                'Noticias guardadas: ${NewsService.cachedAt ?? ""}. No se han actualizado ahora.',
                style: const TextStyle(color: AppColors.gold, fontSize: 12),
              ),
            ),

          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '🌍 Noticias Globales de Viajes',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 6),
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
              const SizedBox(width: 6),
              const Text(
                'Actualidad de viajes · Google Noticias',
                style: TextStyle(fontSize: 12.5, color: AppColors.mutedText),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const LoadingIndicator(
        message: 'Consultando los últimos reportes del mundo...',
      );
    }

    if (_error != null) {
      return ErrorState(message: _error!, onRetry: _load);
    }

    final articles = _articles ?? const [];
    if (articles.isEmpty) {
      return ErrorState(
        message: 'No hay noticias disponibles en este momento.',
        onRetry: _load,
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      backgroundColor: AppColors.surface,
      onRefresh: _load,
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        itemCount: articles.length,
        itemBuilder: (context, index) => NewsCard(article: articles[index]),
      ),
    );
  }
}
