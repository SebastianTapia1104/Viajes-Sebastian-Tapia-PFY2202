import './recuperacion.css';

export function FalloMock({ detalle, onReintentar }) {
  return (
    <main className="recuperacion">
      <div className="recuperacion-caja" role="alert">
        <p className="etiqueta">Servicio simulado</p>
        <h1>No pudimos iniciar la aplicación</h1>
        <p>
          El servicio mock no logró iniciarse al abrir la aplicación.
          Sin ese servicio no hay destinos, vuelos ni hoteles para mostrar.
        </p>
        <p>Recarga la página o pulsa reintentar. Si sigue igual, revisa que <code>mockServiceWorker.js</code> esté en la carpeta public.</p>
        {detalle && <p className="detalle">{detalle}</p>}
        <button type="button" onClick={onReintentar}>Reintentar</button>
      </div>
    </main>
  );
}
