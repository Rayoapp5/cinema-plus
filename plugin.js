// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

async function home() {
  // 1. Siempre el await primero
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw new Error("unavailable");
  }

  const html = res.text;
  const items = [];

  // 2. Ejemplo de cómo extraer elementos del HTML usando una expresión regular sencilla
  // (Esto busca enlaces de películas típicos en páginas de cine)
  const regex = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    // Filtramos para asegurarnos de que sean enlaces de películas/series de la misma página
    if (link.includes("enmcine.uk") && !link.includes("#") && items.length < 20) {
      // Evitamos duplicados
      if (!items.some(i => i.ref === link)) {
        items.push({
          title: "Película / Serie", // Título por defecto si no se extrae fino
          ref: link,
          poster: "", // Aquí iría la URL de la imagen si se extrae
          kind: "movie",
          year: 2026
        });
      }
    }
  }

  return {
    rows: [
      {
        title: "Películas y Estrenos",
        genre: "peliculas",
        items: items
      }
    ]
  };
}

async function search(query) {
  // 1. Siempre el await primero
  const encodedQuery = encodeURIComponent(query);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  const html = res.text;
  const items = [];

  // Búsqueda básica de resultados
  const regex = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: query, // Título basado en la búsqueda o extraído
        ref: link,
        poster: "",
        kind: "movie"
      });
    }
  }

  return { items };
}

async function resolve(ref) {
  // 1. Siempre el await primero para entrar a la página del detalle de la película
  const res = await kino.fetch(ref);

  if (!res.ok) {
    throw new Error("not_found");
  }

  const html = res.text;

  // Aquí buscaríamos la URL directa del video (por ejemplo, un enlace .mp4 o m3u8)
  // Si la página usa reproductores externos o iframes, la lógica varía según el sitio.
  // Como ejemplo base, devolvemos el enlace o un error si no se encuentra el video directo:
  
  // Si encuentras una URL de video directa, la pones aquí:
  // return { url: "https://url-directa-del-video.mp4" };

  throw new Error("not_found");
}

