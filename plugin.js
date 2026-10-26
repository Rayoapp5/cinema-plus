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
// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

async function home() {
  // 1. Primero el await, antes de cualquier validación
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw new Error("unavailable");
  }

  // Aquí procesamos el contenido de la página principal
  // (Nota: Ajustaremos esto según cómo devuelva los datos la página)
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
  // 1. Primero el await
  const encodedQuery = encodeURIComponent(query);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  return { items: [] };
}

async function resolve(ref) {
  // 1. Primero el await para resolver el enlace de video
  const res = await kino.fetch(ref);

  if (!res.ok) {
    throw new Error("not_found");
  }

  // Aquí retornamos la URL directa del flujo de video
  return {
    url: ref
  };
}

