import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

const catalogo =
    'https://www.royalcaribbean.com/lac/es/cruises?country=COL&currency=USD&search=departurePort%3ACTG';
const viajes = [
  (
    imagen: 'assets/images/ruta-0.webp',
    alt: 'La bahía de Santa Marta desde cubierta',
    fecha: '24 de enero de 2027',
    titulo: 'Santa Marta y las islas del Caribe',
    ruta:
        'Saliendo de Cartagena, la primera escala es Santa Marta. Después de un día en alta mar, el barco visita Willemstad, Oranjestad y Colón. Regresa a Cartagena el 31 de enero.',
    noches: 7,
    fuente:
        'https://www.royalcaribbean.com/usa/es/itinerary/7-night-southern-caribbean-holiday-cruise-from-cartagena-on-grandeur-GR7IP223?sailDate=2027-01-24',
  ),
  (
    imagen: 'assets/images/ruta-1.webp',
    alt: 'Las fachadas de colores de Oranjestad junto al mar',
    fecha: '14 de febrero de 2027',
    titulo: 'Aruba y Bonaire',
    ruta:
        'Embarca en Cartagena, recorre Oranjestad y Kralendijk y visita Colón antes de regresar al puerto colombiano.',
    noches: 7,
    fuente: catalogo,
  ),
  (
    imagen: 'assets/images/ruta-2.webp',
    alt: 'Un crucero frente a la costa de Panamá al atardecer',
    fecha: '18 de abril de 2027',
    titulo: 'De Cartagena a Panamá',
    ruta:
        'El barco pasa por Aruba y Curazao y termina en Colón, Panamá. Si vuelves a Colombia, planifica el trayecto de regreso desde Panamá.',
    noches: 6,
    fuente: catalogo,
  ),
];

class CrucerosScreen extends StatelessWidget {
  const CrucerosScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Cruceros desde Colombia')),
    body: ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Salidas desde Cartagena · Grandeur of the Seas'),
        for (final viaje in viajes)
          Card(
            margin: const EdgeInsets.symmetric(vertical: 12),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Image.asset(
                  viaje.imagen,
                  semanticLabel: viaje.alt,
                  fit: BoxFit.cover,
                ),
                ListTile(
                  title: Text(viaje.titulo),
                  subtitle: Text('${viaje.fecha} · ${viaje.noches} noches'),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(viaje.ruta),
                ),
                TextButton(
                  onPressed: () async {
                    final opened = await launchUrl(
                      Uri.parse(viaje.fuente),
                      mode: LaunchMode.externalApplication,
                    );
                    if (!opened && context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'No se pudo abrir la página de la naviera.',
                          ),
                        ),
                      );
                    }
                  },
                  child: const Text('Consultar salida en Royal Caribbean'),
                ),
              ],
            ),
          ),
        const Text(
          'Imágenes ilustrativas creadas con IA. Itinerarios consultados el 20 de noviembre de 2026. Confirma disponibilidad y precio con la naviera.',
        ),
      ],
    ),
  );
}
