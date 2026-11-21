import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../models/product.dart';
import '../widgets/product_card.dart';

/// La Gran Tienda del Viajero. Catálogo de Amazon con enlaces de
/// afiliado IdarThur y filtros por categoría.
class TiendaScreen extends StatefulWidget {
  const TiendaScreen({super.key});

  @override
  State<TiendaScreen> createState() => _TiendaScreenState();
}

class _TiendaScreenState extends State<TiendaScreen> {
  String _activeCategory = 'todos';

  List<Product> get _filteredProducts {
    if (_activeCategory == 'todos') return StoreData.products;
    return StoreData.products
        .where((p) => p.categoryId == _activeCategory)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _buildHeader()),
          SliverToBoxAdapter(child: _buildCategoryChips()),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 40),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) =>
                    ProductCard(product: _filteredProducts[index]),
                childCount: _filteredProducts.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return const Padding(
      padding: EdgeInsets.fromLTRB(20, 20, 20, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'La Gran Tienda',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFFFFFFFF),
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Todo lo que necesitas para viajar mejor, seleccionado por nuestra IA.',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.mutedText,
              height: 1.5,
            ),
          ),
          SizedBox(height: 12),
          Text(
            '🛒 Al comprar a través de la app, apoyas a IdarThur (programa de afiliados de Amazon).',
            style: TextStyle(
              fontSize: 11.5,
              color: AppColors.mutedText,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChips() {
    final chips = <String>['todos', ...StoreData.categories.map((c) => c.id)];

    return SizedBox(
      height: 46,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: chips.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final id = chips[index];
          final isActive = id == _activeCategory;
          final label = id == 'todos' ? '✨ Todos' : StoreData.categoryName(id);

          return ChoiceChip(
            label: Text(label, style: const TextStyle(fontSize: 12.5)),
            selected: isActive,
            onSelected: (_) => setState(() => _activeCategory = id),
            selectedColor: const Color(0xFF45F3FF),
            backgroundColor: const Color(0x1AFFFFFF),
            labelStyle: TextStyle(
              color: isActive
                  ? const Color(0xFF0B0C10)
                  : const Color(0xFFA0AAB5),
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
            ),
            side: BorderSide(
              color: isActive
                  ? const Color(0xFF45F3FF)
                  : Colors.white.withValues(alpha: 0.1),
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            showCheckmark: false,
          );
        },
      ),
    );
  }
}
