import 'package:flutter/material.dart';

class ContentImage extends StatelessWidget {
  final String source;
  final double? width, height;
  final BoxFit fit;
  final int? cacheWidth, cacheHeight;
  final ImageErrorWidgetBuilder? errorBuilder;
  final ImageLoadingBuilder? loadingBuilder;
  const ContentImage(
    this.source, {
    super.key,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.cacheWidth,
    this.cacheHeight,
    this.errorBuilder,
    this.loadingBuilder,
  });
  @override
  Widget build(BuildContext context) {
    final path = Uri.parse(source).path;
    final asset = path.endsWith('/logo_blue.png')
        ? 'assets/brand/logo_blue.png'
        : path.endsWith('/yessel_avatar.png')
        ? 'assets/brand/yessel_avatar.png'
        : 'assets/images/${path.replaceAll('/', '__')}';
    return Image.asset(
      asset,
      width: width,
      height: height,
      fit: fit,
      cacheWidth: cacheWidth,
      cacheHeight: cacheHeight,
      errorBuilder: (_, _, _) => Image.network(
        source,
        width: width,
        height: height,
        fit: fit,
        cacheWidth: cacheWidth,
        cacheHeight: cacheHeight,
        errorBuilder: errorBuilder,
        loadingBuilder: loadingBuilder,
      ),
    );
  }
}
