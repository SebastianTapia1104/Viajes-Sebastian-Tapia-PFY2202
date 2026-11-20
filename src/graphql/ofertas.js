import { gql } from '@apollo/client';

export const OFERTAS_POR_DESTINO = gql`
  query OfertasPorDestino($destinoId: ID!) {
    ofertas(destinoId: $destinoId) {
      destinoId
      vuelos {
        id
        aerolinea
        origen
        destino
        fechaSalida
        fechaRegreso
        escalas
        precio
        moneda
        asientos
      }
      hoteles {
        id
        nombre
        zona
        estrellas
        fechaEntrada
        fechaSalida
        precioNoche
        moneda
        habitaciones
        regimen
      }
    }
  }
`;
