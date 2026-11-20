import { fecha, pesos } from '../formato';

export function PanelVuelos({ vuelos }) {
  if (vuelos.length === 0) {
    return <p className="vacio">No hay vuelos disponibles para este destino.</p>;
  }

  return (
    <div className="lista-ofertas">
      {vuelos.map((vuelo) => (
        <article className="oferta" key={vuelo.id}>
          <header>
            <h3>{vuelo.aerolinea}</h3>
            <Cupo cantidad={vuelo.asientos} singular="asiento" plural="asientos" />
          </header>
          <p className="trayecto">{vuelo.origen} → {vuelo.destino}</p>
          <dl>
            <div>
              <dt>Salida</dt>
              <dd>{fecha(vuelo.fechaSalida)}</dd>
            </div>
            <div>
              <dt>Regreso</dt>
              <dd>{fecha(vuelo.fechaRegreso)}</dd>
            </div>
            <div>
              <dt>Escalas</dt>
              <dd>{vuelo.escalas === 0 ? 'Directo' : vuelo.escalas}</dd>
            </div>
          </dl>
          <p className="precio">{pesos(vuelo.precio)} <span>por persona</span></p>
        </article>
      ))}
    </div>
  );
}

export function PanelHoteles({ hoteles }) {
  if (hoteles.length === 0) {
    return <p className="vacio">No hay hoteles disponibles para este destino.</p>;
  }

  return (
    <div className="lista-ofertas">
      {hoteles.map((hotel) => (
        <article className="oferta" key={hotel.id}>
          <header>
            <h3>{hotel.nombre}</h3>
            <Cupo cantidad={hotel.habitaciones} singular="habitación" plural="habitaciones" />
          </header>
          <p className="trayecto">{hotel.zona} · {hotel.estrellas} estrellas · {hotel.regimen}</p>
          <dl>
            <div>
              <dt>Entrada</dt>
              <dd>{fecha(hotel.fechaEntrada)}</dd>
            </div>
            <div>
              <dt>Salida</dt>
              <dd>{fecha(hotel.fechaSalida)}</dd>
            </div>
          </dl>
          <p className="precio">{pesos(hotel.precioNoche)} <span>por noche</span></p>
        </article>
      ))}
    </div>
  );
}

function Cupo({ cantidad, singular, plural }) {
  if (cantidad === 0) {
    return <span className="cupo agotado">Sin cupos</span>;
  }
  const texto = cantidad === 1 ? `1 ${singular}` : `${cantidad} ${plural}`;
  return <span className="cupo">Disponible · {texto}</span>;
}
