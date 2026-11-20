function esTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function esFecha(valor) {
  return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

export function esDestino(destino) {
  return Boolean(destino)
    && esTexto(destino.id)
    && esTexto(destino.nombre)
    && esTexto(destino.pais)
    && esTexto(destino.region)
    && esTexto(destino.resumen)
    && Array.isArray(destino.actividades)
    && destino.actividades.length > 0
    && destino.actividades.every(esTexto);
}

export function esListadoDestinos(data) {
  return Array.isArray(data) && data.every(esDestino);
}

export function esVuelo(vuelo) {
  return Boolean(vuelo)
    && esTexto(vuelo.id)
    && esTexto(vuelo.aerolinea)
    && esTexto(vuelo.origen)
    && esTexto(vuelo.destino)
    && esFecha(vuelo.fechaSalida)
    && esFecha(vuelo.fechaRegreso)
    && Number.isFinite(vuelo.precio)
    && vuelo.precio >= 0
    && esTexto(vuelo.moneda)
    && Number.isInteger(vuelo.escalas)
    && vuelo.escalas >= 0
    && Number.isInteger(vuelo.asientos)
    && vuelo.asientos >= 0;
}

export function esHotel(hotel) {
  return Boolean(hotel)
    && esTexto(hotel.id)
    && esTexto(hotel.nombre)
    && esTexto(hotel.zona)
    && Number.isInteger(hotel.estrellas)
    && hotel.estrellas >= 1
    && hotel.estrellas <= 5
    && esFecha(hotel.fechaEntrada)
    && esFecha(hotel.fechaSalida)
    && Number.isFinite(hotel.precioNoche)
    && hotel.precioNoche >= 0
    && esTexto(hotel.moneda)
    && Number.isInteger(hotel.habitaciones)
    && hotel.habitaciones >= 0
    && esTexto(hotel.regimen);
}

export function esOfertas(ofertas) {
  return Boolean(ofertas)
    && esTexto(ofertas.destinoId)
    && Array.isArray(ofertas.vuelos)
    && Array.isArray(ofertas.hoteles)
    && ofertas.vuelos.every(esVuelo)
    && ofertas.hoteles.every(esHotel);
}

export function esRespuestaOfertas(body) {
  return Boolean(body)
    && typeof body === 'object'
    && !Array.isArray(body)
    && body.data
    && typeof body.data === 'object'
    && esOfertas(body.data.ofertas);
}

export function esVersionCatalogo(data) {
  return Boolean(data)
    && Number.isInteger(data.version)
    && data.version >= 1
    && esTexto(data.actualizadoEn);
}

export function esAvisoCambio(data) {
  return esVersionCatalogo(data) && esTexto(data.mensaje);
}
