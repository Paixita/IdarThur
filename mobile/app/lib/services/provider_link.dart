import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

Future<void> openProvider(BuildContext context, String value) async {
  final uri = Uri.tryParse(value);
  if (uri == null || uri.scheme != 'https' || uri.host.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Enlace del proveedor no válido.')),
    );
    return;
  }
  for (final mode in [
    LaunchMode.externalApplication,
    LaunchMode.inAppBrowserView,
  ]) {
    try {
      if (await launchUrl(uri, mode: mode)) return;
    } on Exception {
      continue;
    }
  }
  if (!context.mounted) return;
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text('No se pudo abrir ${uri.host} en el navegador.'),
      action: SnackBarAction(
        label: 'Copiar enlace',
        onPressed: () => Clipboard.setData(ClipboardData(text: value)),
      ),
    ),
  );
}
