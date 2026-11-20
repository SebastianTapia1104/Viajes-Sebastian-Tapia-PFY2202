import { delay, graphql, http, HttpResponse } from 'msw';
import { urlDestinos, urlSimularCambio, urlVersionCatalogo } from '../api/base';
import { leerVersion, listarDestinos, ofertasDe, simularCambio } from './datos';

function versionActual() {
  return leerVersion();
}

export const handlers = [
  http.get(urlDestinos(), async () => {
    await delay(700);
    const { version } = versionActual();
    return HttpResponse.json(listarDestinos(), {
      headers: { 'X-Catalogo-Version': String(version) },
    });
  }),

  http.get(urlVersionCatalogo(), async () => {
    await delay(200);
    return HttpResponse.json(versionActual());
  }),

  http.post(urlSimularCambio(), async () => {
    await delay(300);
    return HttpResponse.json(simularCambio());
  }),

  graphql.query('OfertasPorDestino', async ({ variables }) => {
    await delay(900);
    const destinoId = variables.destinoId;

    if (!destinoId) {
      return HttpResponse.json({
        errors: [{ message: 'Debes indicar un destino para consultar vuelos y hoteles.' }],
      });
    }

    if (destinoId === 'cusco') {
      return HttpResponse.json({
        errors: [{ message: 'No pudimos consultar vuelos y hoteles para Cusco. El servicio respondió con un error.' }],
      });
    }

    const ofertas = ofertasDe(destinoId);
    if (!ofertas) {
      return HttpResponse.json({
        errors: [{ message: `No existe el destino "${destinoId}".` }],
      });
    }

    return HttpResponse.json({
      data: {
        ofertas: {
          __typename: 'Ofertas',
          destinoId: ofertas.destinoId,
          vuelos: ofertas.vuelos.map((vuelo) => ({ __typename: 'Vuelo', ...vuelo })),
          hoteles: ofertas.hoteles.map((hotel) => ({ __typename: 'Hotel', ...hotel })),
        },
      },
    });
  }),
];
