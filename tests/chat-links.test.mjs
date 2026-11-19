import test from 'node:test';
import assert from 'node:assert/strict';
import { airportCode, buildFlightLink, normalizeReplyLinks } from '../utils/travelLinks.mjs';
import { chatMessageParts, safeChatHref, buildConversation } from '../utils/chatMessage.mjs';
const old = 'https://search.hotellook.com/flights/?origin=MDE&destination=LIM&marker=729418';
const expected = 'https://www.aviasales.com/?marker=729418&origin_iata=MDE&destination_iata=LIM';
test('El enlace del caso real abre el comparador correcto y conserva la afiliación y la ruta', () => {
  assert.equal(normalizeReplyLinks('Compara aquí: ' + old), 'Compara aquí: ' + expected);
  assert.equal(normalizeReplyLinks('[Comparar vuelos](' + old + ').'), '[Comparar vuelos](' + expected + ').');
  assert.equal(buildFlightLink('Lima', 'Medellín'), expected);
});
test('Se respeta el aeropuerto de origen y no se convierten ciudades desconocidas en códigos inventados', () => {
  assert.equal(airportCode('Medellín (EOH)'), 'EOH');
  assert.equal(airportCode('Bogotá'), 'BOG');
  const url = new URL(buildFlightLink('Cusco', 'Bogotá'));
  assert.equal(url.searchParams.get('origin_iata'), 'BOG');
  assert.equal(url.searchParams.get('destination_iata'), 'CUZ');
  assert.equal(new URL(buildFlightLink('Ciudad desconocida', 'Otro origen')).searchParams.has('destination_iata'), false);
});
test('Los enlaces de texto y Markdown son clicables sin incluir el punto final', () => {
  const raw = chatMessageParts('Aquí: ' + expected + '.');
  assert.equal(raw.find((p) => p.type === 'link').href, expected);
  assert.equal(raw.at(-1).text, '.');
  const markdown = chatMessageParts('**Tu viaje** [Comparar](' + old + ')');
  assert.equal(markdown.find((p) => p.type === 'strong').text, 'Tu viaje');
  assert.equal(markdown.find((p) => p.type === 'link').href, expected);
});
test('El formato no convierte HTML o protocolos ejecutables en enlaces peligrosos', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,hola', '//otro.example', '/\\otro.example', 'https://example.com/\nmal']) assert.equal(safeChatHref(value), null);
  assert.equal(chatMessageParts('[Enlace](javascript:alert(1))').some((p) => p.type === 'link'), false);
  assert.equal(chatMessageParts('<img src=x onerror=alert(1)>')[0].type, 'text');
  assert.equal(safeChatHref('/peru'), '/peru');
});
test('La respuesta a las fechas conserva el contexto de Medellín a Lima sin duplicar el último mensaje', () => {
  const message = 'Somos dos y salimos el 10 de diciembre.';
  const messages = [{ role: 'system', content: 'No debe aceptarse' }, { role: 'user', content: 'Quiero ir de Medellín a Lima.' }, { role: 'assistant', content: '¿Qué fechas y cuántos pasajeros?' }, { role: 'user', content: message }];
  const result = buildConversation(message, messages);
  assert.equal(result.length, 3);
  assert.equal(result[0].content, 'Quiero ir de Medellín a Lima.');
  assert.equal(result.at(-1).content, message);
  assert.equal(result.some((m) => m.role === 'system'), false);
});
