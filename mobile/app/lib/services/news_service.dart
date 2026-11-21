import '../config/app_config.dart';
import '../models/news_article.dart';
import 'api_client.dart';

/// Servicio de noticias: consume `/api/noticias` de idarthur.com.
class NewsService {
  NewsService._();
  static bool fromCache = false;
  static String? cachedAt;

  static Future<ApiResult<List<NewsArticle>>> fetchNews() async {
    final result = await ApiClient.getJson(AppConfig.apiNoticias);

    if (!result.isSuccess) {
      return ApiResult.failure(result.error!);
    }

    final body = result.data!;
    fromCache = body['_offline'] == true;
    cachedAt = body['_cachedAt'] as String?;
    final success = body['success'] == true;
    final rawList = body['data'];

    if (!success || rawList is! List) {
      return const ApiResult.failure('No se pudieron obtener las noticias.');
    }

    final articles = rawList
        .whereType<Map<String, dynamic>>()
        .map(NewsArticle.fromJson)
        .toList();

    return ApiResult.success(articles);
  }
}
