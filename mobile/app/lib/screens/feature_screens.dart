import 'package:flutter/material.dart';
import '../services/provider_link.dart';
import '../config/app_config.dart';
import '../models/agent.dart';
import 'chat_screen.dart';

enum TravelFeature { flights, peru, cars, vipPrices, protection }

class FeatureDetailScreen extends StatefulWidget {
  final TravelFeature feature;
  final VoidCallback onOpenNews;
  const FeatureDetailScreen({
    super.key,
    required this.feature,
    required this.onOpenNews,
  });
  @override
  State<FeatureDetailScreen> createState() => _FeatureDetailScreenState();
}

class _FeatureDetailScreenState extends State<FeatureDetailScreen> {
  final origin = TextEditingController();
  final destination = TextEditingController();
  final location = TextEditingController();
  String peru = 'LIM';
  DateTime? departure, returnDate;
  int passengers = 1;
  @override
  void dispose() {
    origin.dispose();
    destination.dispose();
    location.dispose();
    super.dispose();
  }

  Future<void> open(String value) => openProvider(context, value);

  Future<void> date(bool back) async {
    final today = DateTime.now();
    final value = await showDatePicker(
      context: context,
      initialDate: back ? (departure ?? today) : (departure ?? today),
      firstDate: back ? (departure ?? today) : today,
      lastDate: today.add(const Duration(days: 730)),
    );
    if (value != null && mounted) {
      setState(() {
        if (back) {
          returnDate = value;
        } else {
          departure = value;
          if (returnDate != null && returnDate!.isBefore(value)) {
            returnDate = null;
          }
        }
      });
    }
  }

  String get to => widget.feature == TravelFeature.peru
      ? peru
      : destination.text.trim().toUpperCase();
  String get title => switch (widget.feature) {
    TravelFeature.flights => 'Vuelos',
    TravelFeature.peru => 'Vuelos a Perú',
    TravelFeature.cars => 'Alquiler de autos',
    TravelFeature.vipPrices => 'Hoteles',
    TravelFeature.protection => 'Viaja protegido',
  };
  String get itinerary =>
      'Quiero organizar un viaje desde ${origin.text} a $to. Ida: ${departure?.toIso8601String().substring(0, 10) ?? "por definir"}, regreso: ${returnDate?.toIso8601String().substring(0, 10) ?? "por definir"}. Pasajeros: $passengers. Ayúdame a preparar un presupuesto orientativo dentro del chat y pregunta los datos que falten.';
  void chat() => Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => ChatScreen(initialMessage: itinerary),
    ),
  );
  bool get valid =>
      RegExp(r'^[A-Z]{3}$').hasMatch(origin.text.trim().toUpperCase()) &&
      RegExp(r'^[A-Z]{3}$').hasMatch(to);
  @override
  Widget build(BuildContext context) {
    final flight =
        widget.feature == TravelFeature.flights ||
        widget.feature == TravelFeature.peru;
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(22),
        children: [
          Icon(
            flight
                ? Icons.flight_takeoff
                : widget.feature == TravelFeature.cars
                ? Icons.directions_car
                : Icons.hotel,
            size: 64,
            color: AppColors.primary,
          ),
          const SizedBox(height: 18),
          Text(
            title,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          const Text(
            'Planea aquí y confirma precio, disponibilidad y condiciones con el proveedor antes de reservar. IdarThur puede recibir una comisión.',
            style: TextStyle(height: 1.5, color: AppColors.mutedText),
          ),
          const SizedBox(height: 22),
          if (flight) ...[
            TextField(
              controller: origin,
              onChanged: (_) => setState(() {}),
              textCapitalization: TextCapitalization.characters,
              maxLength: 3,
              decoration: const InputDecoration(
                labelText: 'Aeropuerto de origen (IATA)',
                hintText: 'MDE, BOG, MAD…',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            if (widget.feature == TravelFeature.peru)
              DropdownButtonFormField<String>(
                initialValue: peru,
                items: const [
                  DropdownMenuItem(value: 'LIM', child: Text('Lima · LIM')),
                  DropdownMenuItem(value: 'CUZ', child: Text('Cusco · CUZ')),
                  DropdownMenuItem(value: 'AQP', child: Text('Arequipa · AQP')),
                  DropdownMenuItem(value: 'IQT', child: Text('Iquitos · IQT')),
                ],
                onChanged: (v) => setState(() => peru = v!),
                decoration: const InputDecoration(
                  labelText: 'Destino en Perú',
                  border: OutlineInputBorder(),
                ),
              )
            else
              TextField(
                controller: destination,
                onChanged: (_) => setState(() {}),
                maxLength: 3,
                textCapitalization: TextCapitalization.characters,
                decoration: const InputDecoration(
                  labelText: 'Aeropuerto de destino (IATA)',
                  hintText: 'LIM, MIA, BCN…',
                  border: OutlineInputBorder(),
                ),
              ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              children: [
                OutlinedButton.icon(
                  onPressed: () => date(false),
                  icon: const Icon(Icons.calendar_month),
                  label: Text(
                    departure?.toIso8601String().substring(0, 10) ??
                        'Fecha de ida',
                  ),
                ),
                OutlinedButton.icon(
                  onPressed: () => date(true),
                  icon: const Icon(Icons.calendar_month),
                  label: Text(
                    returnDate?.toIso8601String().substring(0, 10) ??
                        'Regreso opcional',
                  ),
                ),
              ],
            ),
            DropdownButtonFormField<int>(
              initialValue: passengers,
              items: List.generate(
                9,
                (i) => DropdownMenuItem(
                  value: i + 1,
                  child: Text('${i + 1} pasajero(s)'),
                ),
              ),
              onChanged: (v) => setState(() => passengers = v!),
              decoration: const InputDecoration(labelText: 'Pasajeros'),
            ),
            const SizedBox(height: 22),
            FilledButton.icon(
              onPressed: chat,
              icon: const Icon(Icons.chat),
              label: const Text('Preparar viaje con Yessel'),
            ),
            OutlinedButton.icon(
              onPressed: valid
                  ? () => open(
                      Uri.https('www.aviasales.com', '/', {
                        'marker': '729418',
                        'origin_iata': origin.text.trim().toUpperCase(),
                        'destination_iata': to,
                      }).toString(),
                    )
                  : () => open(AppConfig.partnerAwayUrl),
              icon: const Icon(Icons.open_in_new),
              label: const Text('Comparar vuelos'),
            ),
            const Text(
              'Con ambos códigos se envía tu ruta. Sin ellos se abre el buscador general. Confirma allí fechas, viajeros y equipaje. Si no sabes el código de tu aeropuerto, pregúntale a Yessel.',
              style: TextStyle(
                fontSize: 12,
                color: AppColors.mutedText,
                height: 1.5,
              ),
            ),
          ] else if (widget.feature == TravelFeature.vipPrices) ...[
            TextField(
              controller: location,
              decoration: const InputDecoration(
                labelText: 'Ciudad o destino',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () => open(
                Uri.https('www.booking.com', '/searchresults.es.html', {
                  'label': 'affnetTP_399989189573503',
                  'ss': location.text,
                }).toString(),
              ),
              child: const Text('Explorar hoteles'),
            ),
          ] else if (widget.feature == TravelFeature.cars) ...[
            const Text(
              'Compara punto de recogida, fechas, edad del conductor, seguro, depósito y política de combustible con la empresa de alquiler.',
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () => open(AppConfig.partnerCarUrl),
              child: const Text('Buscar autos'),
            ),
          ] else
            FilledButton(
              onPressed: widget.onOpenNews,
              child: const Text('Ver noticias de viaje'),
            ),
          const SizedBox(height: 24),
          const Text(
            'IdarThur informa y recomienda mediante afiliación. El contrato y el pago se realizan con el vendedor o prestador externo. Las reclamaciones sobre la reserva o compra se tramitan con él, sin limitar los derechos legales aplicables.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.mutedText,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

class AgentSquadScreen extends StatelessWidget {
  const AgentSquadScreen({super.key});

  void _openAgent(BuildContext context, Agent agent) {
    if (agent.isPrivate) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Este agente es de acceso privado.')),
      );
      return;
    }

    Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => ChatScreen(agent: agent)));
  }

  @override
  Widget build(BuildContext context) {
    final agents = [AgentsData.yessel, ...AgentsData.squad];
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Escuadrón IA'),
        backgroundColor: AppColors.surface,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        itemCount: agents.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, index) {
          final agent = agents[index];
          return Material(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            child: ListTile(
              onTap: () => _openAgent(context, agent),
              contentPadding: const EdgeInsets.all(14),
              leading: CircleAvatar(
                radius: 28,
                backgroundColor: agent.color.withValues(alpha: 0.16),
                child: Text(agent.emoji, style: const TextStyle(fontSize: 27)),
              ),
              title: Text(
                agent.name,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text('${agent.role}\n${agent.desc}'),
              ),
              isThreeLine: true,
              trailing: Icon(
                agent.isPrivate
                    ? Icons.lock_outline_rounded
                    : Icons.chevron_right_rounded,
                color: agent.color,
              ),
            ),
          );
        },
      ),
    );
  }
}
