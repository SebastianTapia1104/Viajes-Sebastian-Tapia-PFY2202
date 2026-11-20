import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import './index.css';
import App from './App';
import { basePublica } from './api/base';
import { cliente } from './apollo/cliente';
import { FalloMock } from './components/FalloMock';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function mostrar(contenido) {
  root.render(<StrictMode>{contenido}</StrictMode>);
}

function asegurarBarraFinal() {
  const base = basePublica();
  if (!base || window.location.pathname !== base) return false;
  // Sin la barra final la página queda fuera del alcance del service worker
  // y el mock no puede interceptar las consultas.
  window.location.replace(`${base}/${window.location.search}${window.location.hash}`);
  return true;
}

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${basePublica()}/mockServiceWorker.js`,
    },
  });
}

function conTiempo(promesa, ms, mensaje) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(mensaje)), ms);
    promesa.then(
      (valor) => {
        clearTimeout(id);
        resolve(valor);
      },
      (error) => {
        clearTimeout(id);
        reject(error);
      },
    );
  });
}

async function arrancar() {
  if (asegurarBarraFinal()) return;
  try {
    await conTiempo(
      enableMocking(),
      8000,
      'El servicio mock no respondió al abrir la aplicación.',
    );
    mostrar(
      <ApolloProvider client={cliente}>
        <App />
      </ApolloProvider>,
    );
  } catch (error) {
    mostrar(
      <FalloMock
        detalle={error && error.message}
        onReintentar={() => window.location.reload()}
      />,
    );
  }
}

arrancar();
reportWebVitals();
