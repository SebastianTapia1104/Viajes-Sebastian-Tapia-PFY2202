import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { esDestino } from '../api/validacion';
import { Alerta, Esqueletos, EstadoCarga } from './Estados';

export function ListaDestinos({ destinos, cargando, actualizando, error, reintentar }) {
  const [busqueda, setBusqueda] = useState('');
  const [region, setRegion] = useState('Todas');
  const seguros = destinos.filter(esDestino);

  useEffect(() => {
    document.title = 'Viajes Machapa';
  }, []);

  const regiones = useMemo(() => {
    const unicas = new Set(destinos.filter(esDestino).map((destino) => destino.region));
    return ['Todas', ...unicas];
  }, [destinos]);

  const consulta = busqueda.trim().toLowerCase();
  const visibles = seguros.filter((destino) => {
    const coincideRegion = region === 'Todas' || destino.region === region;
    if (!coincideRegion) return false;
    if (!consulta) return true;
    const texto = `${destino.nombre} ${destino.pais} ${destino.actividades.join(' ')}`.toLowerCase();
    return texto.includes(consulta);
  });

  return (
    <section aria-busy={cargando}>
      <div className="hero">
        <p className="etiqueta">Arma tu próximo viaje</p>
        <h2>Elige un destino y revisa cómo llegar y dónde quedarte.</h2>
        <p>Vuelos y hoteles disponibles para cada ciudad.</p>
        <a className="hero-boton" href="#destinos">Ver destinos</a>
      </div>

      <h2 className="seccion" id="destinos">A dónde puedes viajar</h2>

      <div className="filtros">
        <form role="search" onSubmit={(evento) => evento.preventDefault()}>
          <label htmlFor="busqueda">Buscar destino</label>
          <input
            id="busqueda"
            type="search"
            placeholder="Ciudad, país o actividad"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </form>
        <div className="regiones" role="group" aria-label="Filtrar por región">
          {regiones.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={region === item}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {actualizando && <EstadoCarga texto="Actualizando destinos..." />}
      {error && seguros.length > 0 && (
        <div className="alerta compacta" role="alert">
          <p>{error.message}</p>
          <button type="button" onClick={reintentar}>Reintentar</button>
        </div>
      )}
      {cargando && seguros.length === 0 && (
        <>
          <EstadoCarga texto="Cargando destinos..." />
          <Esqueletos cantidad={6} />
        </>
      )}

      {!cargando && error && seguros.length === 0 && (
        <Alerta
          titulo={tituloError(error)}
          mensaje={error.message}
          onRetry={reintentar}
        />
      )}

      {!cargando && !error && visibles.length === 0 && (
        <p className="vacio">No hay destinos que coincidan con la búsqueda.</p>
      )}

      {visibles.length > 0 && (
        <div className="grilla">
          {visibles.map((destino) => (
            <Link className="tarjeta" key={destino.id} to={`/destinos/${destino.id}`}>
              <span className={`banda tono-${tonoDe(destino.id)}`} aria-hidden="true">{destino.nombre.slice(0, 1)}</span>
              <p className="pais">{destino.pais} · {destino.region}</p>
              <h3>{destino.nombre}</h3>
              <p>{destino.resumen}</p>
              <ul>
                {destino.actividades.map((actividad) => (
                  <li key={actividad}>{actividad}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function tituloError(error) {
  if (error.name === 'FormatError') return 'La respuesta no tiene el formato esperado';
  if (error.name === 'NetworkError') return 'No pudimos conectar con el catálogo';
  return 'No pudimos cargar los destinos';
}

function tonoDe(id) {
  let suma = 0;
  for (let indice = 0; indice < id.length; indice += 1) suma += id.charCodeAt(indice);
  return suma % 6;
}
