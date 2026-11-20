import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { urlGraphql } from '../api/base';
import { esRespuestaOfertas } from '../api/validacion';

// El enlace revisa el JSON antes de que Apollo lo escriba en su caché.
// Si el formato no corresponde a vuelos y hoteles, la consulta termina en error
// y la caché no se actualiza con datos incompletos.

function respuestaInvalida(mensaje) {
  return new Response(JSON.stringify({
    errors: [{ message: mensaje }],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function fetchGraphqlValidado(uri, options) {
  const response = await fetch(uri, { ...options, cache: 'no-store' });
  const tipo = response.headers.get('content-type') || '';
  const esJson = tipo.includes('application/json') || tipo.includes('application/graphql-response+json');

  if (!esJson) {
    return respuestaInvalida('La respuesta de GraphQL no es JSON.');
  }

  let body;
  try {
    body = await response.clone().json();
  } catch {
    return respuestaInvalida('La respuesta de GraphQL no contiene JSON válido.');
  }

  if (body && Array.isArray(body.errors) && !body.data) {
    return response;
  }

  if (!esRespuestaOfertas(body)) {
    return respuestaInvalida('La respuesta de GraphQL no tiene el formato esperado para vuelos y hoteles.');
  }

  return response;
}

export const cliente = new ApolloClient({
  link: new HttpLink({
    uri: urlGraphql(),
    fetch: fetchGraphqlValidado,
  }),
  cache: new InMemoryCache(),
});
