import { Link } from 'react-router-dom';

export function Alerta({ titulo, mensaje, onRetry }) {
  return (
    <div className="alerta" role="alert">
      <h3>{titulo}</h3>
      <p>{mensaje}</p>
      <div className="acciones">
        {onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
        <Link to="/">Volver al inicio</Link>
      </div>
    </div>
  );
}

export function Esqueletos({ cantidad }) {
  return (
    <div className="grilla" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, indice) => (
        <div className="esqueleto" key={indice} />
      ))}
    </div>
  );
}

export function EstadoCarga({ texto }) {
  return <p className="estado" role="status">{texto}</p>;
}
