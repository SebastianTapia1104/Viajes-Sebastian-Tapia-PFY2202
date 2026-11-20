import { esListadoDestinos, esRespuestaOfertas } from './validacion';

const destino = {
  id: 'paris',
  nombre: 'París',
  pais: 'Francia',
  region: 'Europa',
  resumen: 'Ciudad de museos.',
  actividades: ['Louvre'],
};

const vuelo = {
  id: 'par-v1',
  aerolinea: 'LATAM',
  origen: 'Santiago (SCL)',
  destino: 'París (CDG)',
  fechaSalida: '2026-12-10',
  fechaRegreso: '2026-12-20',
  escalas: 1,
  precio: 890000,
  moneda: 'CLP',
  asientos: 6,
};

const hotel = {
  id: 'par-h1',
  nombre: 'Hotel Le Marais',
  zona: 'Le Marais',
  estrellas: 4,
  fechaEntrada: '2026-12-10',
  fechaSalida: '2026-12-20',
  precioNoche: 145000,
  moneda: 'CLP',
  habitaciones: 4,
  regimen: 'Desayuno',
};

test('acepta un destino con país y actividades', () => {
  expect(esListadoDestinos([destino])).toBe(true);
});

test('rechaza un destino incompleto', () => {
  expect(esListadoDestinos([{ id: 'paris', nombre: 'París' }])).toBe(false);
});

test('acepta la respuesta GraphQL de vuelos y hoteles', () => {
  expect(esRespuestaOfertas({
    data: { ofertas: { destinoId: 'paris', vuelos: [vuelo], hoteles: [hotel] } },
  })).toBe(true);
});

test('rechaza una oferta sin fechas ni precios', () => {
  expect(esRespuestaOfertas({
    data: { ofertas: { destinoId: 'paris', vuelos: [{ id: 'x' }], hoteles: [] } },
  })).toBe(false);
});
