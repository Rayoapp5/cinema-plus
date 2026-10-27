// Plugin: Cinema+ for Kino
// Fuente: https://www.enmcine.uk

const BASE = "https://www.enmcine.uk";

export async function home() {
  const res = await kino.fetch(BASE + "/");
  if (!res.ok) throw kino.error("unavailable");

  const html = await res.text();
  const items = [];

  const regex = /<a href="(#\/ver\/[^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 24) {
    const link = BASE + match[1];
    let poster = match[2];
    if (poster.startsWith("//")) poster = "https:" + poster;
    
    items.push({
      title: match[3].trim(),
      poster: poster,
      ref: link,
      kind: "movie"
    });
  }

  return {
    rows: [
      {
        title: "Estrenos Recientes",
        genre: "peliculas",
        items: items
      }
    ]
  };
}

export async function search(query) {
  const q = query.q || query;
  const res = await kino.fetch(`${BASE}/?s=${encodeURIComponent(q)}`);
  if (!res.ok) return { items: [] };

  const html = await res.text();
  const items = [];
  const regex = /<a href="(#\/ver\/[^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g;
  let match;

  while ((match = regex.exec(html)) !== null && items.length < 24) {
    const link = BASE + match[1];
    let poster = match[2];
    if (poster.startsWith("//")) poster = "https:" + poster;
    
    items.push({
      title: match[3].trim(),
      poster: poster,
      ref: link,
      kind: "movie"
    });
  }

  return { items };
}

export async function resolve(ref) {
  const res = await kino.fetch(ref);
  if (!res.ok) throw kino.error("not_found");

  const html = await res.text();

  const iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["']/i);
  if (iframeMatch) {
    let url = iframeMatch[1];
    if (url.startsWith("//")) url = "https:" + url;
    return { url: url };
  }

  const videoMatch = html.match(/src=["'](https?:\/\/[^"']+\.(mp4|m3u8)[^"']*)["']/i);
  if (videoMatch) {
    return { url: videoMatch[1] };
  }

  throw kino.error("not_found");
}