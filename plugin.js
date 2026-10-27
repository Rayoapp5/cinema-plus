// Lo más visto — plugin de Kino
// Lista las series más populares del momento (TVmaze, sin clave).
// Cada vez que Kino pide el inicio se consulta la programación de HOY,
// así que los datos salen frescos en cada actualización.

const API = "https://api.tvmaze.com";

// Sitio desde el que se reproduce el video. Aún no está conectado.
// Cuando tengas la fuente, se implementa en resolve() y se agrega su host
// a "hosts" en kino-plugin.json.
const FUENTE_VIDEO = null;

async function getJson(path) {
  const r = await kino.fetch(API + path, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("TVmaze respondió " + r.status);
  return r.json();
}

function limpiar(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function aItem(show) {
  if (!show || !show.id || !show.name) return null;
  const img = show.image && (show.image.original || show.image.medium);
  const overview = limpiar(show.summary).slice(0, 2000);
  return {
    id: "tvmaze-" + show.id,
    ref: String(show.id),
    title: String(show.name),
    kind: "series",
    year: show.premiered ? String(show.premiered).slice(0, 4) : undefined,
    poster: img ? String(img).replace("http://", "https://") : undefined,
    overview: overview || undefined,
  };
}

function showDe(episodio) {
  return episodio.show || (episodio._embedded && episodio._embedded.show) || null;
}

// Junta los shows de una o varias programaciones, sin repetir, del más popular al menos.
function rankear(listas) {
  const vistos = new Map();
  for (const lista of listas) {
    for (const ep of lista) {
      const s = showDe(ep);
      if (s && s.id && !vistos.has(s.id)) vistos.set(s.id, s);
    }
  }
  return Array.from(vistos.values())
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .map(aItem)
    .filter(Boolean)
    .slice(0, 40);
}

export async function home() {
  const fecha = hoy();
  let streaming = [];
  let tv = [];

  try {
    streaming = await getJson("/schedule/web?date=" + fecha);
  } catch (e) {
    kino.log("streaming falló: " + e.message);
  }
  try {
    tv = await getJson("/schedule?country=US&date=" + fecha);
  } catch (e) {
    kino.log("tv falló: " + e.message);
  }

  const rows = [
    { id: "mas-visto-hoy", title: "Lo más visto hoy", items: rankear([streaming, tv]) },
    { id: "mas-visto-streaming", title: "Lo más visto en streaming", items: rankear([streaming]) },
    { id: "mas-visto-tv", title: "Lo más visto en TV", items: rankear([tv]) },
  ];
  return rows.filter((r) => r.items.length > 0);
}

export async function search(query) {
  const q = String((query && query.q) || "").trim();
  if (!q) return [];
  const data = await getJson("/search/shows?q=" + encodeURIComponent(q));
  return data
    .map((d) => aItem(d.show))
    .filter(Boolean)
    .slice(0, 50);
}

export async function episodes(ref) {
  const r = await getJson("/shows/" + encodeURIComponent(String(ref).split("|")[0]) + "?embed=episodes");
  const eps = ((r._embedded && r._embedded.episodes) || [])
    .filter((e) => e.number && e.number >= 1 && e.season && e.season >= 1)
    .slice(0, 2000)
    .map((e) => {
      const still = e.image && (e.image.original || e.image.medium);
      return {
        season: e.season,
        number: e.number,
        ref: r.id + "|" + e.season + "|" + e.number,
        title: e.name ? String(e.name) : undefined,
        still: still ? String(still).replace("http://", "https://") : undefined,
        overview: limpiar(e.summary).slice(0, 2000) || undefined,
      };
    });
  const base = aItem(r) || {};
  return {
    series: {
      title: base.title,
      poster: base.poster,
      overview: base.overview,
      imdbId: r.externals && r.externals.imdb ? r.externals.imdb : undefined,
    },
    episodes: eps,
  };
}

export async function resolve(ref) {
  await null;
  if (!FUENTE_VIDEO) {
    throw new Error("Todavía no hay una fuente de video conectada a este plugin.");
  }
  throw new Error("Fuente de video sin implementar.");
}
