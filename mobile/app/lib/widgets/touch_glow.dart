import 'package:flutter/material.dart';
import '../config/app_config.dart';

class TouchGlow extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final Color color;
  const TouchGlow({
    super.key,
    required this.child,
    this.onTap,
    this.color = AppColors.primary,
  });
  @override
  State<TouchGlow> createState() => _TouchGlowState();
}

class _TouchGlowState extends State<TouchGlow> {
  bool active = false;
  @override
  Widget build(BuildContext context) => MouseRegion(
    onEnter: (_) => setState(() => active = true),
    onExit: (_) => setState(() => active = false),
    child: FocusableActionDetector(
      onShowFocusHighlight: (v) => setState(() => active = v),
      child: AnimatedScale(
        scale: active ? 1.025 : 1,
        duration: const Duration(milliseconds: 140),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 140),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            boxShadow: active
                ? [
                    BoxShadow(
                      color: widget.color.withValues(alpha: .32),
                      blurRadius: 22,
                    ),
                  ]
                : [],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.onTap,
              onHighlightChanged: (v) => setState(() => active = v),
              borderRadius: BorderRadius.circular(18),
              splashColor: widget.color.withValues(alpha: .22),
              child: widget.child,
            ),
          ),
        ),
      ),
    ),
  );
}
