import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';

class YesselPresentation extends StatefulWidget {
  final String title, asset;
  const YesselPresentation({
    super.key,
    required this.title,
    required this.asset,
  });

  @override
  State<YesselPresentation> createState() => _YesselPresentationState();
}

class _YesselPresentationState extends State<YesselPresentation> {
  final player = AudioPlayer();
  String status = 'Preparando audio…';
  @override
  void initState() {
    super.initState();
    player.onPlayerComplete.listen((_) {
      if (mounted) setState(() => status = 'Reproducción finalizada');
    });
    play();
  }

  Future<void> play() async {
    try {
      await player.play(AssetSource(widget.asset));
      if (mounted) setState(() => status = 'Yessel está hablando');
    } catch (_) {
      if (mounted) setState(() => status = 'No se pudo iniciar el audio');
    }
  }

  @override
  void dispose() {
    player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SafeArea(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(widget.title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Semantics(liveRegion: true, child: Text(status)),
          if (status == 'Reproducción finalizada' ||
              status == 'No se pudo iniciar el audio')
            TextButton(onPressed: play, child: const Text('Volver a escuchar')),
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    ),
  );
}
