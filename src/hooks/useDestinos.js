import { useEffect, useRef, useState } from 'react';
import { getDestinos, leerDestinos, suscribirCatalogo, TIEMPO_CACHE_MS } from '../api/catalogo';

export function useDestinos() {
  const cacheInicial = leerDestinos();
  const [destinos, setDestinos] = useState(() => (cacheInicial ? cacheInicial.data : []));
  const [cargando, setCargando] = useState(!cacheInicial);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);
  const forzar = useRef(false);

  useEffect(() => {
    let activo = true;
    const force = forzar.current;
    forzar.current = false;
    const cache = force ? null : leerDestinos();
    const fresco = cache && Date.now() - cache.savedAt < TIEMPO_CACHE_MS;

    if (fresco) {
      setDestinos(cache.data);
      setError(null);
      setCargando(false);
      setActualizando(false);
      return undefined;
    }

    if (cache) {
      setDestinos(cache.data);
      setCargando(false);
      setActualizando(true);
    } else {
      setCargando(true);
      setActualizando(false);
    }

    getDestinos({ force: force || !fresco })
      .then((data) => {
        if (!activo) return;
        setDestinos(data);
        setError(null);
      })
      .catch((err) => {
        if (!activo || err.name === 'AbortError') return;
        if (!cache) setDestinos([]);
        setError(err);
      })
      .finally(() => {
        if (!activo) return;
        setCargando(false);
        setActualizando(false);
      });

    return () => {
      activo = false;
    };
  }, [intento]);

  useEffect(() => suscribirCatalogo((evento) => {
    if (evento.tipo !== 'cambio') return;
    forzar.current = true;
    setIntento((valor) => valor + 1);
  }), []);

  function reintentar() {
    forzar.current = true;
    setIntento((valor) => valor + 1);
  }

  return { destinos, cargando, actualizando, error, reintentar };
}
