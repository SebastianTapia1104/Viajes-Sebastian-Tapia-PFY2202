import { useRef, useState } from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router-dom';
import { basePublica } from './api/base';
import { useDestinos } from './hooks/useDestinos';
import { useVigilanciaCatalogo } from './hooks/useVigilanciaCatalogo';
import { ListaDestinos } from './components/ListaDestinos';
import { NoEncontrada, ResumenDestino, RutaDestino, VistaHoteles, VistaVuelos } from './components/DetalleDestino';
import './App.css';

function App() {
  const catalogo = useDestinos();
  const vigilancia = useVigilanciaCatalogo();
  const [simulando, setSimulando] = useState(false);
  const [fallaSimulacion, setFallaSimulacion] = useState(null);
  const ocupado = useRef(false);

  async function simularCambio() {
    if (ocupado.current) return;
    ocupado.current = true;
    setSimulando(true);
    setFallaSimulacion(null);
    try {
      await vigilancia.aplicarCambio();
    } catch (error) {
      setFallaSimulacion(error.message);
    } finally {
      ocupado.current = false;
      setSimulando(false);
    }
  }

  return (
    <Router basename={basePublica() || undefined}>
      <div className="App">
        <a className="saltar" href="#contenido">Saltar al contenido</a>
        <header className="barra">
          <div className="cabecera">
            <Link to="/" className="marca">
              <img className="logo" src={`${basePublica()}/logo-machapa.jpg`} alt="" />
              <h1>Viajes Machapa</h1>
            </Link>
            <nav className="menu" aria-label="Principal">
              <NavLink to="/" end>Destinos</NavLink>
            </nav>
          </div>
        </header>

        {vigilancia.aviso && (
          <div className="banner" role="status">
            <p>{vigilancia.aviso}</p>
            <button type="button" onClick={vigilancia.cerrarAviso}>Cerrar</button>
          </div>
        )}

        <main id="contenido">
          <Routes>
            <Route path="/" element={<ListaDestinos {...catalogo} />} />
            <Route path="/destinos/:destinoId" element={<RutaDestino destinos={catalogo.destinos} />}>
              <Route index element={<ResumenDestino />} />
              <Route path="vuelos" element={<VistaVuelos />} />
              <Route path="hoteles" element={<VistaHoteles />} />
            </Route>
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>

        <footer className="pie">
          <div className="pie-interno">
            <div>
            <strong>Viajes Machapa</strong>
            <p>
              Los destinos se consultan por REST y quedan en caché solo si la respuesta es JSON con el formato esperado.
              Esa copia se renueva si cambia la versión del catálogo, al volver a la pestaña, cada 30 segundos o con el botón.
            </p>
            {vigilancia.version && <p className="version">Catálogo versión {vigilancia.version}</p>}
          </div>
          <div className="simulacion">
            <button type="button" onClick={simularCambio} disabled={simulando || !vigilancia.version}>
              {simulando ? 'Actualizando catálogo...' : 'Simular cambio del catálogo'}
            </button>
            {fallaSimulacion && <p role="alert">{fallaSimulacion}</p>}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
