import 'package:flutter/material.dart';
import '../config/app_config.dart';

/// Tarjeta con estilo "Glassmorphism" de IdarThur:
/// fondo translúcido, blur y borde sutil (igual que la web).
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final Color? borderColor;
  final VoidCallback? onTap;
  final BoxShadow? shadow;

  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.margin,
    this.borderRadius = 20,
    this.borderColor,
    this.onTap,
    this.shadow,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: const Color(0x0DFFFFFF), // rgba(255,255,255,0.05)
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor ?? const Color(0x14FFFFFF)),
        boxShadow: [
          shadow ??
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.25),
                blurRadius: 30,
                offset: const Offset(0, 8),
              ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: onTap,
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}

/// Encabezado de sección con título, subtítulo y línea de neón.
class SectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final TextAlign align;

  const SectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.align = TextAlign.center,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: align == TextAlign.center
          ? CrossAxisAlignment.center
          : CrossAxisAlignment.start,
      children: [
        Text(
          title,
          textAlign: align,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.foreground,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 60,
          height: 3,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.secondary],
            ),
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 10),
          Text(
            subtitle!,
            textAlign: align,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.mutedText,
              height: 1.5,
            ),
          ),
        ],
      ],
    );
  }
}

/// Botón con gradiente neón primario (cian → azul).
class NeonButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback onPressed;
  final bool fullWidth;

  const NeonButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.fullWidth = true,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF45F3FF),
          foregroundColor: const Color(0xFF0B0C10),
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 28),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          elevation: 0,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 18),
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
            ),
          ],
        ),
      ),
    );
  }
}
