import 'package:flutter/material.dart';
import '../config/app_config.dart';

/// Agente de Inteligencia Artificial del Escuadrón IdarThur.
/// Mismo conjunto de datos que `app/agentes/AgentesClient.js` de la web.
class Agent {
  final String id;
  final String name;
  final String role;
  final Color color;
  final String emoji;
  final List<String> skills;
  final String desc;
  final bool isPrivate;
  final bool isTrusted;
  final String trustNote;
  final String greeting;

  const Agent({
    required this.id,
    required this.name,
    required this.role,
    required this.color,
    required this.emoji,
    required this.skills,
    required this.desc,
    required this.isPrivate,
    required this.isTrusted,
    required this.trustNote,
    required this.greeting,
  });
}

/// Catálogo oficial de agentes de IdarThur (Yessel principal + escuadrón).
class AgentsData {
  AgentsData._();

  /// Yessel: el conserje principal y Director de Operaciones.
  static const Agent yessel = Agent(
    id: 'yessel',
    name: 'Yessel',
    role: 'Conserje Principal y Director de Operaciones',
    color: AppColors.primary,
    emoji: '🤖',
    skills: ['Vuelos', 'Hoteles', 'Reservas', 'Confianza del usuario'],
    desc:
        'Soy Yessel, el conserje principal. Estoy aquí para garantizar que tu viaje sea seguro, claro y confiable.',
    isPrivate: false,
    isTrusted: true,
    trustNote:
        'Verificado para ayudarte con viajes seguros y decisiones transparentes.',
    greeting:
        '¡Hola! Soy Yessel, el conserje principal y Director de Operaciones. Estoy aquí para ayudarte de forma segura, honesta y útil. ¿En qué te puedo apoyar hoy?',
  );

  static const List<Agent> squad = [
    Agent(
      id: 'vitalis',
      name: 'Dr. Yessel (Salud)',
      role: 'Agente Médico de Viajes',
      color: Color(0xFF00D4FF),
      emoji: '🩺',
      skills: ['Vacunación Global', 'Emergencias', 'Seguros Médicos'],
      desc:
          'Especialista en salud internacional. Analiza tu destino para recomendarte las vacunas obligatorias, restricciones locales y hospitales cercanos.',
      isPrivate: false,
      isTrusted: true,
      trustNote: 'Recomendaciones con foco en seguridad y prevención.',
      greeting:
          '¡Hola! Soy el Dr. Yessel. ¿A dónde planeas viajar? Cuéntame y te ayudo a revisar qué precauciones médicas necesitas.',
    ),
    Agent(
      id: 'nicolas',
      name: 'Yessel Ventas',
      role: 'Asistente de Compras',
      color: Color(0xFFFF9900),
      emoji: '🛒',
      skills: [
        'Comparación de Precios',
        'Gadgets de Viaje',
        'Equipaje Inteligente',
      ],
      desc:
          'Tu personal shopper. Te ayuda a elegir equipamiento del catálogo para tu clima y destino; los precios se confirman con el vendedor.',
      isPrivate: false,
      isTrusted: true,
      trustNote: 'Comparativa transparente y orientada a tu presupuesto.',
      greeting:
          '¡Hola! Soy Yessel. ¿Buscando maletas o ropa para tu viaje? Dime a dónde vas y te busco las mejores opciones.',
    ),
    Agent(
      id: 'altamar',
      name: 'Capitán Yessel',
      role: 'Especialista en Cruceros',
      color: AppColors.gold,
      emoji: '🚢',
      skills: ['Rutas del Caribe', 'Camarotes de Lujo', 'Todo Incluido'],
      desc:
          'Te orienta sobre rutas, camarotes y condiciones de cruceros, sin prometer reservas ni mejoras no confirmadas.',
      isPrivate: false,
      isTrusted: true,
      trustNote: 'Ajustado a tus preferencias reales y a la mejor experiencia.',
      greeting:
          '¡Ahoy, marinero! Soy el Capitán Yessel. ¿Listo para surcar los mares? Dime qué ruta te interesa.',
    ),
    Agent(
      id: 'cronista',
      name: 'Yessel Cronista',
      role: 'Cronista y Creador de Historias',
      color: AppColors.success,
      emoji: '📖',
      skills: [
        'Escritura Creativa',
        'Ilustración Generativa',
        'Curación de Relatos',
      ],
      desc:
          'Especialista en recopilar y redactar las mejores anécdotas de viajes. Diseña ilustraciones hiperrealistas para cada relato y actualiza la bitácora de la comunidad.',
      isPrivate: false,
      isTrusted: true,
      trustNote:
          'Relatos con foco en autenticidad, respeto y contenido inspirador.',
      greeting:
          '¡Hola! Soy Yessel Cronista. ¿Tienes alguna aventura o anécdota increíble que quieras que redacte y publique en nuestra bitácora?',
    ),
    Agent(
      id: 'cyberguard',
      name: 'Natalia CyberGuard',
      role: 'Oficial de Ciberseguridad',
      color: AppColors.accent,
      emoji: '🛡️',
      skills: ['Anti-Phishing', 'Pagos Encriptados', 'Auditoría de Enlaces'],
      desc:
          'Guía en cuentas, phishing, privacidad, seguridad web e incidentes; consulta documentación oficial cuando necesita verificar información.',
      isPrivate: false,
      isTrusted: true,
      trustNote:
          'Protección orientada a la seguridad y la privacidad del usuario.',
      greeting:
          'Soy Natalia CyberGuard. Cuéntame qué ocurrió y qué cuenta o dispositivo está afectado. No compartas contraseñas ni códigos.',
    ),
  ];
}
