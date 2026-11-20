// Create React App rellena esta ruta con la carpeta del sitio cuando
// package.json tiene homepage. En local y en GitHub Pages es la misma carpeta.

export function basePublica() {
  const publico = process.env.PUBLIC_URL || '';
  return publico.endsWith('/') ? publico.slice(0, -1) : publico;
}

export function urlDestinos() {
  return `${basePublica()}/api/destinos`;
}

export function urlVersionCatalogo() {
  return `${basePublica()}/api/catalogo/version`;
}

export function urlSimularCambio() {
  return `${basePublica()}/api/catalogo/simular-cambio`;
}

export function urlGraphql() {
  return `${basePublica()}/graphql`;
}
