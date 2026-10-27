
// Plugin: Cinema+ para Kino
// Host principal: https://www.enmcine.uk

async function home() {
  try {
    const res = await kino.fetch("https://www.enmcine.uk/");
    
    if (!res.ok) {
      throw new Error("unavailable");
    }

    // Estructura principal del catálogo inicial
    return {
      rows: [
        {
          title: "Películas y Series Recientes",
          genre: "recientes",
          items: []
        }
      ]
    };
  } catch (e) {
    throw new Error("unavailable");
  }
}

async function search(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);
    
    if (!res.ok) {
      return { items: [] };
    }

    // Aquí se procesarán los resultados de búsqueda próximamente
    return { items: [] };
  } catch (e) {
    return { items: [] };
  }
}

async function resolve(ref) {
  throw new Error("not_found");
}
