import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { esOfertas } from '../api/validacion';
import { OFERTAS_POR_DESTINO } from '../graphql/ofertas';
import { Alerta, Esqueletos, EstadoCarga } from './Estados';
import { PanelHoteles, PanelVuelos } from './Paneles';

export function RutaDestino({ destinos }) {
  const { destinoId } = useParams();
  return <DetalleDestino key={destinoId} destinos={destinos} destinoId={destinoId} />;
}

function DetalleDestino({ destinos, destinoId }) {
  const destino = destinos.find((item) => item.id === destinoId);
  const titulo = destino ? destino.nombre : 'Destino';
  const ubicacion = useLocation();
  const consulta = useQuery(OFERTAS_POR_DESTINO, {
    variables: { destinoId },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    document.title = `${titulo} · Viajes Machapa`;
  }, [titulo]);

  const crudas = consulta.data && consulta.data.ofertas;
  const ofertas = crudas && crudas.destinoId === destinoId && esOfertas(crudas) ? crudas : null;
  const formatoInvalido = Boolean(consulta.data && !ofertas);
  const seccion = nombreSeccion(ubicacion.pathname);

  return (
    <section aria-busy={consulta.loading}>
      <p className="miga">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true"> / </span>
        <span>{titulo}</span>
        {seccion && (
          <>
            <span aria-hidden="true"> / </span>
            <span>{seccion}</span>
          </>
        )}
      </p>

      <header className="cabecera-destino">
        <div>
          <p className="etiqueta">{destino ? `${destino.pais} · ${destino.region}` : 'Plan de viaje'}</p>
          <h2>{titulo}</h2>
          {destino && <p>{destino.resumen}</p>}
        </div>
        {destino && (
          <ul className="chips">
            {destino.actividades.map((actividad) => <li key={actividad}>{actividad}</li>)}
          </ul>
        )}
      </header>

      <nav className="subnav" aria-label="Opciones del destino">
        <NavLink to="." end>Resumen</NavLink>
        <NavLink to="vuelos">Vuelos{ofertas ? ` (${ofertas.vuelos.length})` : ''}</NavLink>
        <NavLink to="hoteles">Hoteles{ofertas ? ` (${ofertas.hoteles.length})` : ''}</NavLink>
      </nav>

      {consulta.loading && ofertas && <EstadoCarga texto="Actualizando vuelos y hoteles..." />}
      {consulta.loading && !ofertas && (
        <>
          <EstadoCarga texto="Cargando vuelos y hoteles..." />
          <Esqueletos cantidad={2} />
        </>
      )}

      {!consulta.loading && !ofertas && consulta.error && (
        <Alerta
          titulo="No pudimos consultar este destino"
          mensaje={consulta.error.message}
          onRetry={() => consulta.refetch()}
        />
      )}

      {!consulta.loading && formatoInvalido && (
        <Alerta
          titulo="La respuesta no tiene el formato esperado"
          mensaje="Llegaron datos de vuelos u hoteles incompletos, así que no se muestran."
          onRetry={() => consulta.refetch()}
        />
      )}

      {ofertas && <Outlet context={{ ofertas, destinos, destinoId }} />}

      {!consulta.loading && !ofertas && consulta.error && (
        <OtrasOpciones destinos={destinos} actual={destinoId} />
      )}
    </section>
  );
}

export function ResumenDestino() {
  const { ofertas } = useOutletContext();
  return (
    <div className="columnas">
      <section>
        <h3 className="bloque">Vuelos</h3>
        <PanelVuelos vuelos={ofertas.vuelos} />
      </section>
      <section>
        <h3 className="bloque">Hoteles</h3>
        <PanelHoteles hoteles={ofertas.hoteles} />
      </section>
    </div>
  );
}

export function VistaVuelos() {
  const { ofertas } = useOutletContext();
  return (
    <section>
      <h3 className="bloque">Vuelos</h3>
      <PanelVuelos vuelos={ofertas.vuelos} />
    </section>
  );
}

export function VistaHoteles() {
  const { ofertas } = useOutletContext();
  return (
    <section>
      <h3 className="bloque">Hoteles</h3>
      <PanelHoteles hoteles={ofertas.hoteles} />
    </section>
  );
}

function OtrasOpciones({ destinos, actual }) {
  const otras = destinos.filter((destino) => destino.id !== actual).slice(0, 4);
  if (otras.length === 0) return null;
  return (
    <div className="alternativas">
      <p>Puedes continuar con otro destino:</p>
      <ul>
        {otras.map((destino) => (
          <li key={destino.id}>
            <Link to={`/destinos/${destino.id}`}>{destino.nombre}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function nombreSeccion(ruta) {
  if (ruta.endsWith('/vuelos')) return 'Vuelos';
  if (ruta.endsWith('/hoteles')) return 'Hoteles';
  return '';
}

export function NoEncontrada() {
  return (
    <section className="vacio">
      <h2>Esta página no existe</h2>
      <p>La dirección no corresponde a una sección de la agencia.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
