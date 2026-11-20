import { useCallback, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { invalidarDestinos, leerVersionLocal, revisarVersion, simularCambioCatalogo, suscribirCatalogo } from '../api/catalogo';

function textoCambio(version, mensaje) {
  const detalle = mensaje ? `${mensaje} ` : '';
  return `El catálogo cambió (versión ${version}). ${detalle}Se actualizaron los datos guardados en caché.`;
}

export function useVigilanciaCatalogo() {
  const client = useApolloClient();
  const [aviso, setAviso] = useState(null);
  const [version, setVersion] = useState(leerVersionLocal);

  useEffect(() => suscribirCatalogo((evento) => {
    if (evento.version) setVersion(evento.version);
  }), []);

  const sincronizar = useCallback(async () => {
    const cambio = await revisarVersion();
    if (!cambio) return false;
    await client.resetStore();
    setAviso(textoCambio(cambio.version, cambio.mensaje));
    return true;
  }, [client]);

  const aplicarCambio = useCallback(async () => {
    const confirmacion = await simularCambioCatalogo();
    invalidarDestinos(confirmacion.version);
    await client.resetStore();
    setAviso(textoCambio(confirmacion.version, confirmacion.mensaje));
  }, [client]);

  useEffect(() => {
    const alVolver = () => {
      if (document.visibilityState === 'visible') {
        sincronizar().catch(() => {});
      }
    };
    const id = setInterval(() => {
      sincronizar().catch(() => {});
    }, 30000);
    window.addEventListener('focus', alVolver);
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', alVolver);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [sincronizar]);

  return {
    aviso,
    version,
    cerrarAviso: () => setAviso(null),
    aplicarCambio,
  };
}
