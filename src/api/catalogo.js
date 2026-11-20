// Caché del catálogo REST.
// Una respuesta solo se guarda si es JSON y trae el formato esperado.
// La interfaz lee esa copia ya validada; no pinta el cuerpo crudo.
//
// Si el catálogo cambia durante la sesión, la versión guardada deja de coincidir
// con la del servicio. En ese caso se descarta la caché y se vuelve a consultar.
// También se revalida al volver a la pestaña y cuando la copia supera el tiempo de vigencia.

import { urlDestinos, urlSimularCambio, urlVersionCatalogo } from './base';
import { esAvisoCambio, esListadoDestinos, esVersionCatalogo } from './validacion';

export const TIEMPO_CACHE_MS = 45000;

const oyentes = new Set();

let cacheDestinos = null;
let versionConocida = null;
let solicitud = 0;
let revision = 0;
let enCurso = null;
let revisando = null;

function emitir(evento) {
  oyentes.forEach((oyente) => oyente(evento));
}

export function suscribirCatalogo(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function leerDestinos() {
  return cacheDestinos;
}

export function leerVersionLocal() {
  return versionConocida;
}

export function reiniciarCache() {
  cacheDestinos = null;
  versionConocida = null;
  solicitud += 1;
  revision += 1;
  enCurso = null;
  revisando = null;
}

function errorCon(nombre, mensaje, status) {
  const error = new Error(mensaje);
  error.name = nombre;
  error.status = status;
  return error;
}

function errorHttp(response, body) {
  const mensaje = (body && body.message) || mensajePorEstado(response.status);
  return errorCon('HttpError', mensaje, response.status);
}

function errorDeRed() {
  return errorCon('NetworkError', 'No hay conexión con el catálogo. Revisa tu red e inténtalo otra vez.', 0);
}

function errorFormato(mensaje) {
  return errorCon('FormatError', mensaje, 422);
}

function abortado() {
  return errorCon('AbortError', 'Petición reemplazada', 0);
}

function mensajePorEstado(status) {
  if (status === 404) return 'No encontramos la información solicitada.';
  if (status === 500) return 'El servicio tuvo un problema al responder.';
  if (status === 400) return 'La consulta no es válida.';
  return `El servicio respondió con un error (${status}).`;
}

function esJson(response) {
  const tipo = response.headers.get('content-type') || '';
  return tipo.includes('application/json');
}

async function leerCuerpo(response) {
  if (!esJson(response)) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function exigirJson(response) {
  if (!esJson(response)) {
    throw errorFormato('La respuesta no es JSON.');
  }
  try {
    return await response.json();
  } catch {
    throw errorFormato('La respuesta no contiene JSON válido.');
  }
}

async function consultar(url, opciones) {
  try {
    return await fetch(url, { cache: 'no-store', ...opciones });
  } catch {
    throw errorDeRed();
  }
}

export function getDestinos({ force = false } = {}) {
  const fresco = cacheDestinos && Date.now() - cacheDestinos.savedAt < TIEMPO_CACHE_MS;
  if (!force && fresco) return Promise.resolve(cacheDestinos.data);
  if (!force && enCurso) return enCurso;

  const id = ++solicitud;
  const promesa = obtenerDestinos(id).finally(() => {
    if (enCurso === promesa) enCurso = null;
  });
  enCurso = promesa;
  return promesa;
}

async function obtenerDestinos(id) {
  const response = await consultar(urlDestinos());
  if (id !== solicitud) throw abortado();

  if (!response.ok) {
    throw errorHttp(response, await leerCuerpo(response));
  }

  const body = await exigirJson(response);
  if (id !== solicitud) throw abortado();

  if (!esListadoDestinos(body)) {
    throw errorFormato('El listado de destinos no tiene el formato esperado.');
  }

  const headerVersion = Number(response.headers.get('X-Catalogo-Version'));
  const version = Number.isInteger(headerVersion) && headerVersion >= 1 ? headerVersion : null;

  cacheDestinos = { data: body, version, savedAt: Date.now() };
  if (version != null) versionConocida = version;
  emitir({ tipo: 'carga', version });
  return body;
}

export function revisarVersion() {
  if (revisando) return revisando;
  const id = ++revision;
  revisando = aplicarRevision(id).finally(() => {
    revisando = null;
  });
  return revisando;
}

async function aplicarRevision(id) {
  const response = await consultar(urlVersionCatalogo());
  if (id !== revision) return null;
  if (!response.ok) throw errorHttp(response, await leerCuerpo(response));

  const body = await exigirJson(response);
  if (id !== revision) return null;
  if (!esVersionCatalogo(body)) {
    throw errorFormato('La versión del catálogo no tiene el formato esperado.');
  }

  if (versionConocida == null) {
    versionConocida = body.version;
    emitir({ tipo: 'carga', version: body.version });
    return null;
  }

  if (body.version === versionConocida) return null;

  versionConocida = body.version;
  cacheDestinos = null;
  solicitud += 1;
  emitir({ tipo: 'cambio', version: body.version, mensaje: body.mensaje });
  return { version: body.version, mensaje: body.mensaje || '' };
}

export function invalidarDestinos(version) {
  revision += 1;
  solicitud += 1;
  cacheDestinos = null;
  if (Number.isInteger(version)) versionConocida = version;
  emitir({ tipo: 'cambio', version: versionConocida, mensaje: '' });
}

export async function simularCambioCatalogo() {
  const response = await consultar(urlSimularCambio(), { method: 'POST' });
  if (!response.ok) throw errorHttp(response, await leerCuerpo(response));

  const body = await exigirJson(response);
  if (!esAvisoCambio(body)) {
    throw errorFormato('La confirmación del cambio no tiene el formato esperado.');
  }
  return body;
}
