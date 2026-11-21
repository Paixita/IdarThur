import 'package:flutter/material.dart';
import 'services/content_service.dart';
import 'config/app_config.dart';
import 'screens/main_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ContentService.initialize();
  runApp(const IdarThurApp());
}

/// Aplicación IdarThur: Agencia de Viajes Inteligente.
class IdarThurApp extends StatelessWidget {
  const IdarThurApp({super.key});

  @override
  Widget build(BuildContext context) {
    final baseTheme = ThemeData.dark(useMaterial3: true);

    return MaterialApp(
      title: '${AppConfig.brandName} - ${AppConfig.tagline}',
      debugShowCheckedModeBanner: false,
      theme: baseTheme.copyWith(
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.secondary,
          surface: AppColors.surface,
          error: AppColors.accent,
        ),
        textTheme: baseTheme.textTheme.apply(
          fontFamily: 'Outfit',
          bodyColor: AppColors.foreground,
          displayColor: AppColors.foreground,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.surface,
          elevation: 0,
        ),
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: AppColors.surface,
          indicatorColor: AppColors.primary.withValues(alpha: 0.18),
          labelTextStyle: WidgetStatePropertyAll(
            TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.mutedText,
            ),
          ),
        ),
        drawerTheme: const DrawerThemeData(backgroundColor: AppColors.surface),
      ),
      home: const MainShell(),
    );
  }
}
