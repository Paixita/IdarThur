import 'dart:async';
import '../services/content_service.dart';
import '../services/update_service.dart';
import 'settings_screen.dart';
import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../widgets/yessel_chat_view.dart';
import 'feature_screens.dart';
import 'historias_screen.dart';
import 'home_screen.dart';
import 'noticias_screen.dart';
import 'tienda_screen.dart';

/// Cáscara principal de la app: barra inferior de pestañas
/// y acceso rápido a Yessel, el agente principal.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 0;
  final Set<int> _loaded = {0};
  AppUpdate? _update;
  @override
  void initState() {
    super.initState();
    ContentService.revision.addListener(_contentChanged);
    unawaited(ContentService.refresh());
    UpdateService.check().then((value) {
      if (mounted) setState(() => _update = value);
    });
  }

  void _contentChanged() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    ContentService.revision.removeListener(_contentChanged);
    super.dispose();
  }

  void _select(int index) => setState(() {
    _selectedIndex = index;
    _loaded.add(index);
  });

  void _openYesselPanel() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.82,
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 12),
            child: YesselChatView.defaultYessel(),
          ),
        );
      },
    );
  }

  void _openFeature(TravelFeature feature) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => FeatureDetailScreen(
          feature: feature,
          onOpenNews: () {
            Navigator.of(context).pop();
            _select(1);
          },
        ),
      ),
    );
  }

  void _openSquad() {
    Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => const AgentSquadScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        onNavigateToTab: _select,
        onOpenYessel: _openYesselPanel,
        onOpenFeature: _openFeature,
        onOpenSquad: _openSquad,
      ),
      _loaded.contains(1) ? const NoticiasScreen() : const SizedBox.shrink(),
      _loaded.contains(2) ? TiendaScreen() : const SizedBox.shrink(),
      _loaded.contains(3) ? HistoriasScreen() : const SizedBox.shrink(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Tu viaje, a tu manera',
          style: TextStyle(fontSize: 15),
        ),
        actions: [
          TextButton.icon(
            label: const Text('Privacidad'),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute<void>(builder: (_) => const SettingsScreen()),
            ),
            icon: const Icon(Icons.tune_rounded),
          ),
        ],
        bottom: _update == null
            ? null
            : PreferredSize(
                preferredSize: const Size.fromHeight(56),
                child: MaterialBanner(
                  content: Text(
                    'Hay una nueva actualización: ${_update!.version}',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute<void>(
                          builder: (_) => const SettingsScreen(),
                        ),
                      ),
                      child: const Text('Actualizar'),
                    ),
                  ],
                ),
              ),
      ),
      body: IndexedStack(index: _selectedIndex, children: screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _select,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_rounded),
            label: 'Inicio',
          ),
          NavigationDestination(
            icon: Icon(Icons.newspaper_rounded),
            label: 'Noticias',
          ),
          NavigationDestination(
            icon: Icon(Icons.storefront_rounded),
            label: 'Tienda',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_rounded),
            label: 'Historias',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openYesselPanel,
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.background,
        icon: const Icon(Icons.smart_toy_rounded),
        label: const Text('Yessel'),
      ),
    );
  }
}
