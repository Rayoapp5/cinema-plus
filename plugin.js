// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

async function home() {
  // Filas que aparecen en la pantalla de inicio de Kino
  return {
    rows: [
      {
        title: "Películas Recientes",
        genre: "peliculas",
        items: []
      }
    ]
  };
}

async function search(query) {
  // Búsqueda de títulos
  return { items: [] };
}

async function resolve(ref) {
  // Resolución del enlace de video reproducible
  throw new Error("not_found");
}

