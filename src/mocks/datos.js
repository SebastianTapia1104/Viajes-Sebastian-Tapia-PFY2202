let version = 1;
let actualizadoEn = '2026-11-20T12:00:00.000Z';
let mensaje = 'Catálogo inicial de destinos, vuelos y hoteles.';

const destinos = [
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
    region: 'Europa',
    resumen: 'Museos, cafés y paseos junto al Sena.',
    actividades: ['Torre Eiffel', 'Museo del Louvre', 'Crucero por el Sena'],
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    region: 'Europa',
    resumen: 'Ruinas, plazas y trattorias en el centro histórico.',
    actividades: ['Coliseo', 'Ciudad del Vaticano', 'Barrio de Trastevere'],
  },
  {
    id: 'cancun',
    nombre: 'Cancún',
    pais: 'México',
    region: 'América',
    resumen: 'Mar Caribe, cenotes y una salida a la zona arqueológica.',
    actividades: ['Playas del Caribe', 'Cenotes', 'Chichén Itzá'],
  },
  {
    id: 'rio',
    nombre: 'Río de Janeiro',
    pais: 'Brasil',
    region: 'América',
    resumen: 'Cerros, miradores y playas urbanas.',
    actividades: ['Cristo Redentor', 'Pan de Azúcar', 'Copacabana'],
  },
  {
    id: 'tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    region: 'Asia',
    resumen: 'Templos, barrios comerciales y cocina de mercado.',
    actividades: ['Templos de Asakusa', 'Cruce de Shibuya', 'Tsukiji'],
  },
  {
    id: 'bariloche',
    nombre: 'San Carlos de Bariloche',
    pais: 'Argentina',
    region: 'América',
    resumen: 'Lagos, cerros y una pausa de chocolate caliente.',
    actividades: ['Cerro Catedral', 'Circuito Chico', 'Chocolate artesanal'],
  },
  {
    id: 'atacama',
    nombre: 'San Pedro de Atacama',
    pais: 'Chile',
    region: 'América',
    resumen: 'Desierto, géiseres y cielo despejado.',
    actividades: ['Valle de la Luna', 'Géiseres del Tatio', 'Lagunas altiplánicas'],
  },
  {
    id: 'cusco',
    nombre: 'Cusco',
    pais: 'Perú',
    region: 'América',
    resumen: 'Ciudad alta, Valle Sagrado y la puerta a Machu Picchu.',
    actividades: ['Machu Picchu', 'Valle Sagrado', 'Barrio de San Blas'],
  },
];

function vuelo(id, aerolinea, origen, destino, salida, regreso, escalas, precio, asientos) {
  return {
    id,
    aerolinea,
    origen,
    destino,
    fechaSalida: salida,
    fechaRegreso: regreso,
    escalas,
    precio,
    moneda: 'CLP',
    asientos,
  };
}

function hotel(id, nombre, zona, estrellas, entrada, salida, precioNoche, habitaciones, regimen) {
  return {
    id,
    nombre,
    zona,
    estrellas,
    fechaEntrada: entrada,
    fechaSalida: salida,
    precioNoche,
    moneda: 'CLP',
    habitaciones,
    regimen,
  };
}

const ofertas = {
  paris: {
    vuelos: [
      vuelo('par-v1', 'LATAM', 'Santiago (SCL)', 'París (CDG)', '2026-12-10', '2026-12-20', 1, 890000, 6),
      vuelo('par-v2', 'Air France', 'Santiago (SCL)', 'París (CDG)', '2027-01-08', '2027-01-18', 0, 1120000, 3),
    ],
    hoteles: [
      hotel('par-h1', 'Hotel Le Marais', 'Le Marais', 4, '2026-12-10', '2026-12-20', 145000, 4, 'Desayuno'),
      hotel('par-h2', 'Maison Saint-Germain', 'Saint-Germain', 3, '2026-12-10', '2026-12-20', 98000, 2, 'Solo alojamiento'),
    ],
  },
  roma: {
    vuelos: [
      vuelo('rom-v1', 'LATAM', 'Santiago (SCL)', 'Roma (FCO)', '2026-12-05', '2026-12-14', 1, 860000, 5),
      vuelo('rom-v2', 'ITA Airways', 'Santiago (SCL)', 'Roma (FCO)', '2027-02-02', '2027-02-11', 1, 940000, 2),
    ],
    hoteles: [
      hotel('rom-h1', 'Palazzo Navona', 'Centro histórico', 4, '2026-12-05', '2026-12-14', 132000, 3, 'Desayuno'),
      hotel('rom-h2', 'Trastevere Suites', 'Trastevere', 3, '2026-12-05', '2026-12-14', 101000, 5, 'Media pensión'),
    ],
  },
  cancun: {
    vuelos: [
      vuelo('can-v1', 'LATAM', 'Santiago (SCL)', 'Cancún (CUN)', '2026-12-18', '2026-12-27', 0, 720000, 8),
      vuelo('can-v2', 'Copa Airlines', 'Santiago (SCL)', 'Cancún (CUN)', '2027-01-15', '2027-01-23', 1, 690000, 4),
    ],
    hoteles: [
      hotel('can-h1', 'Bahía Azul Resort', 'Zona hotelera', 5, '2026-12-18', '2026-12-27', 168000, 6, 'Todo incluido'),
      hotel('can-h2', 'Costa Coral', 'Puerto Juárez', 3, '2026-12-18', '2026-12-27', 89000, 1, 'Desayuno'),
    ],
  },
  rio: {
    vuelos: [
      vuelo('rio-v1', 'LATAM', 'Santiago (SCL)', 'Río de Janeiro (GIG)', '2026-12-12', '2026-12-19', 0, 410000, 7),
      vuelo('rio-v2', 'Gol', 'Santiago (SCL)', 'Río de Janeiro (GIG)', '2027-01-20', '2027-01-28', 1, 380000, 0),
    ],
    hoteles: [
      hotel('rio-h1', 'Atlántica Palace', 'Copacabana', 4, '2026-12-12', '2026-12-19', 110000, 0, 'Desayuno'),
      hotel('rio-h2', 'Santa Teresa House', 'Santa Teresa', 3, '2026-12-12', '2026-12-19', 86000, 3, 'Solo alojamiento'),
    ],
  },
  tokio: {
    vuelos: [
      vuelo('tok-v1', 'LATAM', 'Santiago (SCL)', 'Tokio (NRT)', '2027-03-04', '2027-03-16', 1, 1250000, 4),
      vuelo('tok-v2', 'ANA', 'Santiago (SCL)', 'Tokio (HND)', '2027-04-01', '2027-04-12', 1, 1380000, 2),
    ],
    hoteles: [
      hotel('tok-h1', 'Asakusa Ryokan', 'Asakusa', 3, '2027-03-04', '2027-03-16', 120000, 5, 'Desayuno'),
      hotel('tok-h2', 'Shibuya Crossing Hotel', 'Shibuya', 4, '2027-03-04', '2027-03-16', 176000, 2, 'Solo alojamiento'),
    ],
  },
  bariloche: {
    vuelos: [
      vuelo('bar-v1', 'LATAM', 'Santiago (SCL)', 'Bariloche (BRC)', '2026-12-22', '2026-12-29', 0, 240000, 9),
      vuelo('bar-v2', 'Jetsmart', 'Santiago (SCL)', 'Bariloche (BRC)', '2027-01-11', '2027-01-17', 0, 210000, 5),
    ],
    hoteles: [],
  },
  atacama: {
    vuelos: [],
    hoteles: [
      hotel('ata-h1', 'Desierto Lodge', 'Ayllu de Tulor', 4, '2026-12-08', '2026-12-13', 154000, 3, 'Media pensión'),
      hotel('ata-h2', 'Cielo Alto', 'Centro de San Pedro', 3, '2026-12-08', '2026-12-13', 97000, 4, 'Desayuno'),
    ],
  },
};

export function leerVersion() {
  return { version, actualizadoEn, mensaje };
}

export function listarDestinos() {
  return destinos.map((destino) => ({
    ...destino,
    actividades: [...destino.actividades],
  }));
}

export function ofertasDe(destinoId) {
  const oferta = ofertas[destinoId];
  if (!oferta) return null;
  return {
    destinoId,
    vuelos: oferta.vuelos.map((vueloItem) => ({ ...vueloItem })),
    hoteles: oferta.hoteles.map((hotelItem) => ({ ...hotelItem })),
  };
}

export function simularCambio() {
  version += 1;
  actualizadoEn = new Date().toISOString();
  const paris = destinos.find((destino) => destino.id === 'paris');
  const actividad = 'Espectáculo en el Moulin Rouge';
  if (paris && !paris.actividades.includes(actividad)) {
    paris.actividades.push(actividad);
  }
  ofertas.paris.hoteles[0].precioNoche += 12000;
  if (ofertas.paris.vuelos[0].asientos > 0) {
    ofertas.paris.vuelos[0].asientos -= 1;
  }
  mensaje = 'París sumó una actividad, el Hotel Le Marais subió de tarifa y el primer vuelo tiene menos asientos.';
  return { version, actualizadoEn, mensaje };
}
