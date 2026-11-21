import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';
import '../services/content_service.dart';
import '../services/update_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool busy = false;
  String version = '';
  @override
  void initState() {
    super.initState();
    PackageInfo.fromPlatform().then((p) {
      if (mounted) setState(() => version = '${p.version} (${p.buildNumber})');
    });
  }

  Future<void> update() async {
    setState(() => busy = true);
    final found = await UpdateService.check();
    if (!mounted) return;
    if (found == null) {
      setState(() => busy = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'No se encontró una actualización verificable. Si estás sin conexión, intenta más tarde.',
          ),
        ),
      );
      return;
    }
    final accepted = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('Nueva versión ${found.version}'),
        content: Text(
          '${found.notes}\n\nSe descargará el APK y Android pedirá confirmar su instalación.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(c, false),
            child: const Text('Ahora no'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(c, true),
            child: const Text('Actualizar'),
          ),
        ],
      ),
    );
    if (accepted == true) {
      try {
        await UpdateService.install(found);
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(e.toString())));
        }
      }
    }
    if (mounted) setState(() => busy = false);
  }

  void policy(Map<String, dynamic> doc) => Navigator.push(
    context,
    MaterialPageRoute<void>(
      builder: (_) => Scaffold(
        appBar: AppBar(title: Text(doc['title'] as String)),
        body: ListView(
          padding: const EdgeInsets.all(22),
          children: [
            const Text(
              'Web y app IdarThur · Actualizado: 20 de noviembre de 2026',
              style: TextStyle(color: AppColors.mutedText),
            ),
            for (final row in doc['sections'] as List) ...[
              const SizedBox(height: 24),
              Text(
                row[0] as String,
                style: const TextStyle(
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 10),
              SelectableText(
                row[1] as String,
                style: const TextStyle(fontSize: 15, height: 1.6),
              ),
            ],
          ],
        ),
      ),
    ),
  );
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Transparencia y ajustes')),
    body: ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 40),
      children: [
        Text(
          'IdarThur $version',
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        const Text(
          'Información, afiliados y asistencia de IA. Las reservas y compras se completan con proveedores externos.',
          style: TextStyle(color: AppColors.mutedText, height: 1.5),
        ),
        const SizedBox(height: 20),
        for (final value in ContentService.content['legal'] as List? ?? [])
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(
              Icons.policy_outlined,
              color: AppColors.primary,
            ),
            title: Text(value['title'] as String),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => policy(Map<String, dynamic>.from(value as Map)),
          ),
        ListTile(
          leading: const Icon(Icons.description_outlined),
          title: const Text('Licencias de software'),
          onTap: () =>
              showLicensePage(context: context, applicationName: 'IdarThur'),
        ),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.system_update),
          title: const Text('Buscar actualizaciones'),
          subtitle: const Text(
            'Instalación firmada con confirmación de Android',
          ),
          trailing: busy
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : null,
          onTap: busy ? null : update,
        ),
        ListTile(
          leading: const Icon(Icons.refresh),
          title: const Text('Actualizar contenido'),
          subtitle: const Text('Catálogo e historias, sin reinstalar'),
          onTap: () async {
            await ContentService.refresh();
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    ContentService.cached
                        ? 'Se muestra contenido guardado.'
                        : 'Contenido actualizado o conservado si no hubo conexión.',
                  ),
                ),
              );
            }
          },
        ),
        ListTile(
          leading: const Icon(Icons.privacy_tip_outlined),
          title: const Text('Restablecer aviso de IA'),
          subtitle: const Text(
            'Se mostrará antes de volver a enviar un mensaje',
          ),
          onTap: () async {
            final p = await SharedPreferences.getInstance();
            await p.remove('ai:consent:v1');
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Aviso de IA restablecido.')),
              );
            }
          },
        ),
        const SizedBox(height: 18),
        const Text(
          'El contenido guardado permite explorar sin la web. Para noticias nuevas, conversar, escuchar voces remotas o reservar se necesita internet. Cambiar el código nativo requiere otra versión; los permisos se solicitan cuando los necesitas.',
          style: TextStyle(
            fontSize: 12,
            height: 1.5,
            color: AppColors.mutedText,
          ),
        ),
      ],
    ),
  );
}
