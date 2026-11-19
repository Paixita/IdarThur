// Contexto compacto: la investigación web amplía la cobertura a cualquier destino.
import viajes from '@/data/intelligence/viajes.json';
export const ENLACES = viajes.enlaces;
export { buildFlightLink, buildHotelLink } from './travelLinks.mjs';
export const buildWayAwayLink = () => viajes.enlaces.vuelosWayAway;
export function buildTravelKnowledge() {
  return `[CONOCIMIENTO GLOBAL DE VIAJES — IDARTHUR]
Tu cobertura incluye todos los países, regiones, estados, departamentos, ciudades y localidades. Resuelve homónimos preguntando país o región; averigua aeropuertos cercanos, transporte y conexiones cuando no haya vuelo local.
Referencias aeroportuarias verificadas: Medellín José María Córdova = MDE; Lima Jorge Chávez = LIM; Bogotá El Dorado = BOG; Cusco = CUZ. No uses otro código para estas ciudades ni agregues códigos IATA por suposición. Para otros destinos, usa el nombre de la ciudad hasta verificar el aeropuerto en las fuentes.
El catálogo editorial no certifica precios, frecuencias, visados ni tasas de cambio. Investiga los datos actuales en fuentes oficiales. Los requisitos migratorios dependen de nacionalidad, residencia, destino y escalas.
Mantén la conversación, prepara alternativas y presupuestos documentados en el chat. No exijas contactos ni prometas envío o reserva.
Enlaces opcionales: Perú ${viajes.enlaces.peru}; tienda /tienda. Las herramientas generan los enlaces de afiliado correctos. No inventes códigos IATA ni uses Hotellook.
No presentes anuncios o tarifas desde como disponibilidad revalidada. Nunca inventes aerolíneas, horarios, equipaje incluido, impuestos o totales.`;
}
