
// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw new Error("unavailable");
  }

  const html = res.text;
  const items = [];

  // Expresión regular para capturar enlaces y títulos de películas
  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || "Película",
        ref: link,
        kind: "movie",
        year: 2026
      });
    }
  }

  return {
    rows: [
      {
        title: "Películas Recientes",
        genre: "peliculas",
        items: items
      }
    ]
  };
}

async function search(query) {
  const encodedQuery = encodeURIComponent(query);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  const html = res.text;
  const items = [];
  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || query,
        ref: link,
        kind: "movie"
      });
    }
  }

  return { items };
}

async function resolve(ref) {
  const res = await kino.fetch(ref);

  if (!res.ok) {
    throw new Error("not_found");
  }

  const html = res.text;

  // Buscamos si hay un enlace de video directo o un iframe incrustado
  const iframeMatch = html.match(/src="(https?:\/\/[^"]+embed[^"]*)"/);
  if (iframeMatch) {
    return { url: iframeMatch[1] };
  }

  // Si no se encuentra un flujo directo, indicamos que no se pudo resolver
  throw new Error("not_found");
}
