// utils/yesselKnowledge.js
// Convierte la base de conocimiento de viajes en contexto compacto para Yessel.
// Fuente editable: data/intelligence/viajes.json
import viajes from '@/data/intelligence/viajes.json';

export const ENLACES = viajes.enlaces;

export const buildFlightLink = (destino) =>
  viajes.enlaces.vuelos.replace('{destino}', encodeURIComponent(destino || 'Lima'));

export const buildHotelLink = (destino) =>
  viajes.enlaces.hoteles.replace('{destino}', encodeURIComponent(destino || 'Lima'));

export const buildWayAwayLink = (consulta) =>
  viajes.enlaces.vuelosWayAway.replace('{consulta}', encodeURIComponent(consulta || 'vuelos'));

function monedasTexto() {
  const filas = Object.entries(viajes.monedas).map(
    ([pais, m]) =>
      `- ${pais}: ${m.codigo} (${m.simbolo}), referencia ${m.tasaRefUSD} por USD. ${m.pagos}`
  );
  return filas.join('\n');
}

function regionesTexto() {
  return viajes.regiones
    .map((region) => {
      const paises = region.paises
        .map((p) => {
          const destinos = p.destinos.join(', ');
          return `- ${p.pais} (capital ${p.capital}). Moneda: ${p.moneda}. Mejor época: ${p.mejorEpoca}. Destinos: ${destinos}. Requisitos: ${p.requisitos}. Presupuesto diario aprox.: USD ${p.presupuestoDiarioUSD}. Nota: ${p.notas}`;
        })
        .join('\n');
      return `${region.region}:\n${paises}`;
    })
    .join('\n\n');
}

function peruTexto() {
  const p = viajes.vuelosPeru;
  const rutas = p.rutas
    .map(
      (r) =>
        `- ${r.ruta} | ${r.tipo} | ${r.aerolineas.join(', ')} | ${r.duracion} | ${r.frecuencia} | ${r.precioReferencia}`
    )
    .join('\n');
  return `${p.resumen}\nOrigen principal: ${p.origen}\nRutas:\n${rutas}\nConsejos: ${p.consejos.join(' ')}`;
}

/**
 * Contexto de viajes que se inyecta en el prompt de Yessel.
 * Mantenerlo compacto: se envía en cada petición.
 */
export function buildTravelKnowledge() {
  return `
[CAPA 4: CATÁLOGO DE CONOCIMIENTO DE VIAJES — IDARTHUR ${viajes.version}]

[REGLAS DE USO DEL CATÁLOGO]
- Usa estos datos como base. Si el dato exacto no está, dilo con naturalidad y ofrece buscarlo.
- Los precios son RANGOS DE REFERENCIA. Nunca los presentes como precio final ni garantizado.
- Las tasas de cambio son referencias: aclara que cambian a diario.
- Cuando recomiendes vuelos u hoteles, entrega SIEMPRE el enlace de búsqueda en vivo:
  · Vuelos: ${viajes.enlaces.vuelos.replace('{destino}', 'DESTINO')}
  · Hoteles: ${viajes.enlaces.hoteles.replace('{destino}', 'DESTINO')}
  · Perú (página con rutas y enlaces): ${viajes.enlaces.peru}
- Nunca inventes aerolíneas, horarios ni disponibilidad. Si no sabes un horario, remite al buscador.
- Responde en español claro y cálido; el cliente es viajero, no técnico.

[MONEDAS, PAGOS Y PROPINAS]
${monedasTexto()}

[PAÍSES Y DESTINOS POR REGIÓN]
${regionesTexto()}

[PERÚ — INFORMACIÓN PRIORITARIA PARA COLOMBIANOS]
${peruTexto()}

[ENLACES DE AFILIADO IDARTHUR]
- Vuelos (marker 729418): ${viajes.enlaces.vuelos.replace('{destino}', 'DESTINO')}
- Vuelos WayAway: ${viajes.enlaces.vuelosWayAway.replace('{consulta}', 'CONSULTA')}
- Hoteles: ${viajes.enlaces.hoteles.replace('{destino}', 'DESTINO')}
- Tienda Amazon (tag idarthur-20): ${viajes.enlaces.tienda.replace('{producto}', 'PRODUCTO')}
`.trim();
}
