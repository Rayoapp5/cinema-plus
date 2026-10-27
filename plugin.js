// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

export async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw kino.error("unavailable", "No se pudo cargar la página");
  }

  const html = res.text();   // ← IMPORTANTE: es una función, no una propiedad
  const items = [];

// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

export async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw kino.error("unavailable", "No se pudo cargar la página");
  }

  const html = res.text();   // ← IMPORTANTE: es una función, no una propiedad
  const items = [];

  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || "Película",
        ref: link,
        kind: "movie"
        // quitamos year: 2026 porque es incorrecto
      });
    }
  }

  return {
    rows: [
// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

export async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw kino.error("unavailable", "No se pudo cargar la página");
  }

  const html = res.text();   // ← IMPORTANTE: es una función, no una propiedad
  const items = [];

  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || "Película",
        ref: link,
        kind: "movie"
        // quitamos year: 2026 porque es incorrecto
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

export async function search(query) {
  // query es un objeto → se usa query.q
  const encodedQuery = encodeURIComponent(query.q || query);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  const html = res.text();
  const items = [];
  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];
in.js
Aquí tienes el código corregido:

js
// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

export async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw kino.error("unavailable", "No se pudo cargar la página");
  }

  const html = res.text();   // ← IMPORTANTE: es una función, no una propiedad
  const items = [];

  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || "Película",
        ref: link,
        kind: "movie"
        // quitamos year: 2026 porque es incorrecto
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

export async function search(query) {
  // query es un objeto → se usa query.q
  const encodedQuery = encodeURIComponent(query.q || query);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  const html = res.text();
  const items = [];
  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || query.q,
        ref: link,
        kind: "movie"
      });
    }
  }

  return { items };
}

export async function resolve(ref) {
  const res = await kino.fetch(ref);

  if (!res.ok) {
    throw kino.error("not_found");
  }

  const html = res.text();  // Buscamos iframe de embed
  const iframeMatch = html.match(/src="(https?:\/\/[^"]+embed[^"]*)"/i);
  if (iframeMatch) {
    return { url: iframeMatch[1] };
  }

  // También puedes buscar otros patrones comunes de video
  const videoMatch = html.match(/src="(https?:\/\/[^"]+\.(mp4|m3u8)[^"]*)"/i);
  if (videoMatch) {
    return { url: videoMatch[1] };
  }

  throw kino.error("not_found", "No se encontró el video");
}
