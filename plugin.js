
// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

export async function home() {
  const res = await kino.fetch("https://www.enmcine.uk/");
  
  if (!res.ok) {
    throw kino.error("unavailable");
  }

  const html = await res.text();
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
  const q = query.q || query;
  const encodedQuery = encodeURIComponent(q);
  const res = await kino.fetch(`https://www.enmcine.uk/?s=${encodedQuery}`);

  if (!res.ok) {
    return { items: [] };
  }

  const html = await res.text();
  const items = [];
  const regex = /<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 20) {
    const link = match[1];
    const title = match[2];

    if (link.includes("enmcine.uk") && !items.some(i => i.ref === link)) {
      items.push({
        title: title || q,
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

  const html = await res.text();

  const iframeMatch = html.match(/src=["'](https?:\/\/[^"']+embed[^"']*)["']/i);
  if (iframeMatch) {
    return { url: iframeMatch[1] };
  }

  const videoMatch = html.match(/src=["'](https?:\/\/[^"']+\.(mp4|m3u8)[^"']*)["']/i);
  if (videoMatch) {
    return { url: videoMatch[1] };
  }

  throw kino.error("not_found");
}
