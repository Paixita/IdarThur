import '../widgets/yessel_presentation.dart';
import 'cruceros_screen.dart';
import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../widgets/touch_glow.dart';
import 'feature_screens.dart';

class HomeScreen extends StatelessWidget {
  final void Function(int) onNavigateToTab;
  final VoidCallback onOpenYessel, onOpenSquad;
  final ValueChanged<TravelFeature> onOpenFeature;
  const HomeScreen({
    super.key,
    required this.onNavigateToTab,
    required this.onOpenYessel,
    required this.onOpenFeature,
    required this.onOpenSquad,
  });
  @override
  Widget build(BuildContext context) => SafeArea(
    child: ListView(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 95),
      children: [
        Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                'assets/brand/logo_blue.png',
                width: 46,
                height: 46,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'IdarThur',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900),
              ),
            ),
            const Icon(Icons.public, color: AppColors.primary),
          ],
        ),
        const SizedBox(height: 22),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(26),
            image: const DecorationImage(
              image: AssetImage('assets/images/portada.webp'),
              fit: BoxFit.cover,
              colorFilter: ColorFilter.mode(
                Color(0xD909161E),
                BlendMode.srcOver,
              ),
            ),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF123A4A), Color(0xFF102323), Color(0xFF121A30)],
            ),
            border: Border.all(color: AppColors.primary.withValues(alpha: .25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const CircleAvatar(
                    radius: 35,
                    backgroundImage: AssetImage(
                      'assets/brand/yessel_avatar.png',
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Bienvenidos a IdarThur',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'Soy Yessel. Te invito a descubrir nuestros vuelos, cruceros, hoteles y todo lo que encontrarás para tu viaje.',
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () => showModalBottomSheet<void>(
                  context: context,
                  builder: (_) => const YesselPresentation(
                    title: 'Bienvenida de Yessel',
                    asset: 'voz/servicios.mp3',
                  ),
                ),
                icon: const Icon(Icons.play_arrow_rounded),
                label: const Text('Escuchar mi bienvenida · 1:09'),
              ),
              FilledButton.icon(
                onPressed: onOpenYessel,
                icon: const Icon(Icons.record_voice_over_rounded),
                label: const Text(
                  'Hablar con Yessel',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 26),
        const Text(
          'Explora a tu manera',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 6),
        const Text(
          'Toca una opción para comenzar',
          style: TextStyle(color: AppColors.mutedText),
        ),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, bounds) {
            final cols = bounds.maxWidth > 700 ? 3 : 2;
            final width = (bounds.maxWidth - 12 * (cols - 1)) / cols;
            final items =
                <
                  ({
                    IconData icon,
                    String title,
                    String text,
                    VoidCallback tap,
                    Color color,
                  })
                >[
                  (
                    icon: Icons.flight_takeoff,
                    title: 'Vuelos',
                    text: 'Compara tu próxima ruta',
                    tap: () => onOpenFeature(TravelFeature.flights),
                    color: AppColors.primary,
                  ),
                  (
                    icon: Icons.landscape,
                    title: 'Vuelos a Perú',
                    text: 'Lima, Cusco y más',
                    tap: () => onOpenFeature(TravelFeature.peru),
                    color: AppColors.success,
                  ),
                  (
                    icon: Icons.hotel,
                    title: 'Hoteles',
                    text: 'Encuentra dónde descansar',
                    tap: () => onOpenFeature(TravelFeature.vipPrices),
                    color: AppColors.gold,
                  ),
                  (
                    icon: Icons.directions_boat,
                    title: 'Cruceros',
                    text: 'Salidas desde Cartagena',
                    tap: () => Navigator.push(
                      context,
                      MaterialPageRoute<void>(
                        builder: (_) => const CrucerosScreen(),
                      ),
                    ),
                    color: AppColors.primary,
                  ),
                  (
                    icon: Icons.directions_car,
                    title: 'Autos',
                    text: 'Recorre tu destino',
                    tap: () => onOpenFeature(TravelFeature.cars),
                    color: AppColors.secondary,
                  ),
                  (
                    icon: Icons.shopping_bag,
                    title: 'Tienda Amazon',
                    text: 'Equipaje y accesorios',
                    tap: () => onNavigateToTab(2),
                    color: const Color(0xFFFFAD55),
                  ),
                  (
                    icon: Icons.newspaper,
                    title: 'Noticias',
                    text: 'Fuentes y alertas de viaje',
                    tap: () => onNavigateToTab(1),
                    color: AppColors.primary,
                  ),
                  (
                    icon: Icons.menu_book,
                    title: 'Historias',
                    text: 'Relatos para escuchar',
                    tap: () => onNavigateToTab(3),
                    color: AppColors.success,
                  ),
                  (
                    icon: Icons.groups,
                    title: 'Escuadrón IA',
                    text: 'Conoce a los especialistas',
                    tap: onOpenSquad,
                    color: AppColors.accent,
                  ),
                ];
            return Wrap(
              spacing: 12,
              runSpacing: 12,
              children: items
                  .map(
                    (item) => SizedBox(
                      width: width,
                      child: TouchGlow(
                        onTap: item.tap,
                        color: item.color,
                        child: Container(
                          constraints: const BoxConstraints(minHeight: 148),
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: item.color.withValues(alpha: .25),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (item.title == 'Cruceros')
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: Image.asset(
                                    'assets/images/ruta-2.webp',
                                    width: double.infinity,
                                    height: 58,
                                    fit: BoxFit.cover,
                                  ),
                                )
                              else
                                Icon(item.icon, size: 30, color: item.color),
                              const SizedBox(height: 14),
                              Text(
                                item.title,
                                style: const TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                item.text,
                                style: const TextStyle(
                                  fontSize: 12,
                                  height: 1.4,
                                  color: AppColors.mutedText,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  )
                  .toList(),
            );
          },
        ),
        const SizedBox(height: 24),
        const Text(
          'Reservas y compras se completan con el proveedor externo. La IA orienta y puede equivocarse; confirma las condiciones antes de pagar.',
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
