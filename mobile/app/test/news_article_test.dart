import 'package:flutter_test/flutter_test.dart';
import 'package:idarthur_app/models/news_article.dart';

void main() {
  test('Lee los identificadores RSS y las fechas actuales y anteriores', () {
    const url = 'https://news.google.com/rss/articles/abc';
    final article = NewsArticle.fromJson({
      'id': url,
      'link': url,
      'publishedAt': '2026-11-21T16:20:58.000Z',
    });
    expect(article.id, url);
    expect(article.date, '2026-11-21');
    final cached = NewsArticle.fromJson({'id': 42, 'date': 'ayer'});
    expect(cached.id, '42');
    expect(cached.date, 'ayer');
  });
}
