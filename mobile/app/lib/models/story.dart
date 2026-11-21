class Story {
  final String id;
  final String title;
  final String author;
  final DateTime date;
  final String location;
  final String category;
  final String narration;
  final String imageUrl;
  final String? subtitle;

  const Story({
    required this.id,
    required this.title,
    required this.author,
    required this.date,
    required this.location,
    required this.category,
    required this.narration,
    required this.imageUrl,
    this.subtitle,
  });
}
