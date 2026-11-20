# Viajes Machapa

Agencia de viajes hecha con React. Quien entra elige un destino y después revisa vuelos y hoteles para armar el viaje. No hay un backend real: Mock Service Worker intercepta las peticiones en el navegador.

Sitio publicado: https://SebastianTapia1104.github.io/Viajes-Sebastian-Tapia-PFY2202/

## Qué hace

- Lista los destinos con `GET /api/destinos`. Cada destino trae país, región, resumen y actividades. Esa parte usa REST.
- Al abrir un destino consulta vuelos y hoteles con GraphQL, en `POST /graphql`, operación `OfertasPorDestino`. La respuesta trae precios, fechas y disponibilidad.
- La navegación está en React Router: inicio, ficha del destino, vuelos, hoteles y página no encontrada.
- Muestra carga, listados vacíos y errores. Cusco responde con error para probar el reintento. Bariloche no tiene hoteles. San Pedro de Atacama no tiene vuelos. Río tiene un vuelo y un hotel sin cupos.

## Caché

Una respuesta se guarda solo si el cuerpo es JSON y trae el formato esperado. Si no, no entra a la caché ni se muestra.

La copia de los destinos vence a los 45 segundos. Además, la aplicación consulta `GET /api/catalogo/version` al volver a la pestaña y cada 30 segundos. Si la versión cambió, descarta la caché REST y limpia la caché de Apollo para volver a pedir vuelos y hoteles. El botón «Simular cambio del catálogo» modifica París (una actividad, la tarifa del Hotel Le Marais y los asientos del primer vuelo) para ver ese recorrido durante la sesión.

## Si el mock no inicia

Si el service worker no alcanza a partir, la pantalla explica el problema y ofrece reintentar. La aplicación no queda en blanco.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Destinos, búsqueda y filtro por región |
| `/destinos/paris` | Resumen de vuelos y hoteles |
| `/destinos/paris/vuelos` | Solo vuelos |
| `/destinos/paris/hoteles` | Solo hoteles |
| `/destinos/bariloche` | Vuelos, sin hoteles |
| `/destinos/atacama` | Hoteles, sin vuelos |
| `/destinos/cusco` | Error del servicio GraphQL |
| `/otra` | Página no encontrada |

## Cómo verlo en local

```bash
npm install
npm start
```

Con el `homepage` del proyecto, la aplicación queda en http://localhost:3000/Viajes-Sebastian-Tapia-PFY2202/

El código fuente está en `main`. La rama `gh-pages` contiene la compilación que sirve GitHub Pages. `npm run deploy` vuelve a generar esa compilación, copia `index.html` como `404.html` para que las rutas sigan funcionando al recargar, y la publica.
