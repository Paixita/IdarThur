import 'package:idarthur_app/services/link_service.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:idarthur_app/services/api_client.dart';
import 'package:idarthur_app/services/chat_service.dart';
import 'package:idarthur_app/services/content_service.dart';
import 'package:idarthur_app/services/update_service.dart';
import 'package:idarthur_app/models/chat_message.dart';
import 'package:idarthur_app/models/product.dart';
import 'package:idarthur_app/screens/home_screen.dart';
import 'package:idarthur_app/screens/feature_screens.dart';
import 'package:idarthur_app/data/stories/stories_data.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    final loader = FontLoader('Outfit')
      ..addFont(rootBundle.load('assets/fonts/Outfit.ttf'));
    await loader.load();
    final icons = FontLoader('MaterialIcons')
      ..addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'));
    await icons.load();
  });
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await ContentService.initialize();
  });
  test(
    'Los enlaces internos del chat abren módulos nativos sin depender de la web',
    () {
      expect(nativeRoute('/peru'), '/peru');
      expect(nativeRoute('/tienda'), '/tienda');
      expect(nativeRoute('#buscador-ventas'), '/tienda');
      expect(nativeRoute('https://www.idarthur.com/autos'), '/autos');
      expect(nativeRoute('https://attacker.test/tienda'), null);
      expect(nativeRoute('javascript:alert(1)'), null);
    },
  );
  test('El catálogo y las historias actuales están disponibles sin red', () {
    expect(StoreData.products.length, 18);
    expect(
      travelStories.any(
        (s) => s.title == 'La noche en que el cielo guardó silencio',
      ),
      true,
    );
    expect(
      travelStories.any((s) => s.title == 'El Viaje que No Estaba en el Mapa'),
      false,
    );
    for (final p in StoreData.products) {
      expect(Uri.parse(p.purchaseUrl).host, 'www.amazon.com');
      expect(
        File(
          'assets/images/${p.imageFileName.replaceAll('/', '__')}',
        ).existsSync(),
        true,
        reason: p.name,
      );
    }
    expect((ContentService.content['legal'] as List).length, 5);
  });
  test('Solo se aceptan servidores HTTPS de la aplicación', () {
    expect(ContentService.allowedOrigin('http://www.idarthur.com'), false);
    expect(
      ContentService.allowedOrigin('https://www.idarthur.com.attacker.test'),
      false,
    );
    expect(
      ContentService.allowedOrigin('https://user:secret@www.idarthur.com'),
      false,
    );
    expect(ContentService.allowedOrigin('https://www.idarthur.com'), true);
  });
  test(
    'Las actualizaciones requieren versión superior, hash y origen válido',
    () {
      final m = {
        'versionCode': 3,
        'versionName': '1.2.0',
        'apkUrl': 'https://www.idarthur.com/downloads/idarthur.apk',
        'sha256': 'a' * 64,
        'sizeBytes': 30000000,
      };
      expect(AppUpdate.parse(m, 2)?.code, 3);
      expect(AppUpdate.parse(m, 3), null);
      expect(AppUpdate.parse({...m, 'sha256': 'invalid'}, 2), null);
      expect(
        AppUpdate.parse({...m, 'apkUrl': 'https://attacker.test/app.apk'}, 2),
        null,
      );
      expect(AppUpdate.parse({...m, 'sizeBytes': 200000000}, 2), null);
    },
  );
  test(
    'El chat envía contexto y conserva idioma y género de la respuesta',
    () async {
      late Map<String, dynamic> body;
      ApiClient.client = MockClient((request) async {
        body = jsonDecode(request.body);
        return http.Response(
          jsonEncode({
            'reply': 'Bonjour, je suis Natalia.',
            'language': 'fr',
            'voiceGender': 'female',
          }),
          200,
        );
      });
      final result = await ChatService.sendMessage(
        message: 'Continúa',
        agentId: 'cyberguard',
        messages: const [
          ChatMessage(text: 'Necesito ayuda con mi cuenta', sender: 'user'),
          ChatMessage(text: '¿Qué cuenta?', sender: 'ai'),
        ],
      );
      expect(result.isSuccess, true);
      expect(result.data!.language, 'fr');
      expect(result.data!.voiceGender, 'female');
      expect((body['messages'] as List).length, 2);
      expect(body['agentId'], 'cyberguard');
      ApiClient.client = MockClient(
        (_) async =>
            http.Response('{"reply":"No confíes en esta respuesta"}', 503),
      );
      expect(
        (await ChatService.sendMessage(
          message: 'Hola',
          agentId: 'yessel',
        )).isSuccess,
        false,
      );
    },
  );
  testWidgets(
    'Inicio permite abrir Perú y conserva legibilidad en pantalla pequeña',
    (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      TravelFeature? selected;
      final key = GlobalKey();
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.dark().copyWith(
            textTheme: ThemeData.dark().textTheme.apply(fontFamily: 'Outfit'),
          ),
          home: Scaffold(
            body: RepaintBoundary(
              key: key,
              child: HomeScreen(
                onNavigateToTab: (_) {},
                onOpenYessel: () {},
                onOpenFeature: (v) => selected = v,
                onOpenSquad: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final boundary =
          key.currentContext!.findRenderObject() as RenderRepaintBoundary;
      await tester.runAsync(() async {
        final image = await boundary.toImage(pixelRatio: 2);
        final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
        final out = File('/tmp/idarthur-app-home.png');
        await out.writeAsBytes(bytes!.buffer.asUint8List());
      });
      expect(find.text('IdarThur'), findsOneWidget);
      await tester.scrollUntilVisible(find.text('Vuelos a Perú'), 300);
      await tester.tap(find.text('Vuelos a Perú'));
      await tester.pumpAndSettle();
      expect(selected, TravelFeature.peru);
      expect(tester.takeException(), null);
    },
  );
  testWidgets(
    'Perú permite elegir ciudades y abrir planificación sin tarifas inventadas',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.dark().copyWith(
            textTheme: ThemeData.dark().textTheme.apply(fontFamily: 'Outfit'),
          ),
          home: FeatureDetailScreen(
            feature: TravelFeature.peru,
            onOpenNews: () {},
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Vuelos a Perú'), findsWidgets);
      expect(find.text('Lima · LIM'), findsOneWidget);
      expect(find.text('Preparar viaje con Yessel'), findsOneWidget);
      expect(tester.takeException(), null);
    },
  );
}
