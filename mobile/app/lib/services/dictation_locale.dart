String? selectDictationLocale(
  String language,
  List<String> supported,
  String deviceLocale,
) {
  String normalized(String value) => value.toLowerCase().replaceAll('_', '-');
  final base = normalized(language).split('-').first;
  final matching = supported
      .where((v) => normalized(v).split('-').first == base)
      .toList();
  if (matching.isEmpty) return null;
  return matching.firstWhere(
    (v) => normalized(v) == normalized(deviceLocale),
    orElse: () => matching.first,
  );
}
