import {
  getDestinos,
  invalidarDestinos,
  leerDestinos,
  reiniciarCache,
  revisarVersion,
} from './catalogo';

const destino = {
  id: 'paris',
  nombre: 'París',
  pais: 'Francia',
  region: 'Europa',
  resumen: 'Ciudad de museos.',
  actividades: ['Louvre'],
};

function respuesta(body, { status = 200, headers = { 'content-type': 'application/json' } } = {}) {
  const mapa = {};
  Object.entries(headers).forEach(([clave, valor]) => {
    mapa[clave.toLowerCase()] = valor;
  });
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(nombre) {
        return mapa[String(nombre).toLowerCase()] || null;
      },
    },
    json: async () => body,
  };
}

beforeEach(() => {
  reiniciarCache();
});

afterEach(() => {
  reiniciarCache();
  delete global.fetch;
});

test('guarda el listado solo cuando el JSON tiene el formato esperado', async () => {
  global.fetch = jest.fn().mockResolvedValue(respuesta([destino], {
    headers: { 'content-type': 'application/json', 'x-catalogo-version': '1' },
  }));

  const data = await getDestinos({ force: true });
  expect(data).toEqual([destino]);
  expect(leerDestinos().data).toEqual([destino]);
  expect(leerDestinos().version).toBe(1);
});

test('no guarda en caché una respuesta exitosa con formato incorrecto', async () => {
  global.fetch = jest.fn().mockResolvedValue(respuesta([{ id: 'paris' }]));
  await expect(getDestinos({ force: true })).rejects.toThrow(/formato esperado/);
  expect(leerDestinos()).toBeNull();
});

test('no guarda en caché una respuesta que no es JSON', async () => {
  global.fetch = jest.fn().mockResolvedValue(respuesta('hola', {
    headers: { 'content-type': 'text/plain' },
  }));
  await expect(getDestinos({ force: true })).rejects.toThrow(/no es JSON/);
  expect(leerDestinos()).toBeNull();
});

test('reutiliza la caché vigente y la descarta si cambia la versión', async () => {
  const fetchMock = jest.fn()
    .mockResolvedValueOnce(respuesta([destino], {
      headers: { 'content-type': 'application/json', 'x-catalogo-version': '1' },
    }))
    .mockResolvedValueOnce(respuesta({
      version: 2,
      actualizadoEn: '2026-11-20T15:00:00.000Z',
      mensaje: 'París cambió.',
    }));
  global.fetch = fetchMock;

  await getDestinos({ force: true });
  await getDestinos();
  expect(fetchMock).toHaveBeenCalledTimes(1);

  const cambio = await revisarVersion();
  expect(cambio).toEqual({ version: 2, mensaje: 'París cambió.' });
  expect(leerDestinos()).toBeNull();
});

test('invalidarDestinos obliga a consultar de nuevo', async () => {
  global.fetch = jest.fn().mockResolvedValue(respuesta([destino], {
    headers: { 'content-type': 'application/json', 'x-catalogo-version': '3' },
  }));
  await getDestinos({ force: true });
  invalidarDestinos(4);
  expect(leerDestinos()).toBeNull();
});
