import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const RECENT_SEARCHES_FILE = path.resolve('./recentSearches.json');
let recentSearches = [];



// Lade gespeicherte Suchanfragen beim Start
export async function loadSearches() {
  try {
    const data = await fs.readFile(RECENT_SEARCHES_FILE, 'utf-8');
    let allSearches = JSON.parse(data).map(entry => ({
      term: entry.term,
      date: new Date(entry.date)
    }));

    // Nur die letzten 10 Einträge behalten (neueste zuerst)
    recentSearches = allSearches.slice(0, 10);
    console.log('Recent searches geladen:', recentSearches.length);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Recent searches Datei existiert noch nicht. Starte leer.');
      recentSearches = [];
    } else {
      console.error('Fehler beim Laden der Recent Searches:', err);
    }
  }
}

// Speichere aktuelle Suchanfragen in die Datei
async function saveSearches() {
  try {
    // JSON.stringify mit 2 Leerzeichen für bessere Lesbarkeit
    await fs.writeFile(RECENT_SEARCHES_FILE, JSON.stringify(recentSearches, null, 2));
    console.log('Recent searches gespeichert.');
  } catch (err) {
    console.error('Fehler beim Speichern der Recent Searches:', err);
  }
}

// Neue Suche hinzufügen, dann speichern
function addSearch(term) {
  const now = new Date();
  // Neueste Suchanfragen zuerst
  recentSearches.unshift({ term, date: now });
  if (recentSearches.length > 100) {
    recentSearches.pop();
  }
  saveSearches();
}

export const searchImages = async (req, res) => {
  console.log("searchImages wurde aufgerufen mit:", req.params.query);
  const query = req.params.query;
  const page = parseInt(req.query.page) || 1;

  try {
    const response = await fetch(
      `https://image-search-abstraction-layer.freecodecamp.rocks/query/${encodeURIComponent(query)}?page=${page}`
    );

    if (response.status === 502) {
      console.error(`API-Fehler 502 - Bad Gateway`);
      // console.log(`Request-URL: https://image-search-abstraction-layer.freecodecamp.rocks/query/${encodeURIComponent(query)}?page=${page}`);

      try {
        const filePath = path.join(process.cwd(), 'src', 'apiteil.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const fallbackData = JSON.parse(fileData);
          console.log('Fallback URLs:', fallbackData.images.map(i => i.url));

        // recentSearches.unshift({ term: query, date: new Date() });
        // if (recentSearches.length > 10) recentSearches.pop();
        addSearch(query)

        return res.status(200).json({
          query,
          page,
          images: fallbackData.images,
          fallbackActive: fallbackData.fallbackActive ?? true
        });
      } catch (fileErr) {
        console.error('Fehler beim Lesen oder Parsen der Fallback-JSON:', fileErr);
        return res.status(500).json({ error: 'Fehler beim Laden der Fallback-Daten' });
      }
    }

    if (!response.ok) {
      console.error(`API-Fehler: ${response.status} - ${response.statusText}`);
      return res.status(response.status).json({ error: `API-Fehler: ${response.statusText}` });
    }

    const data = await response.json();

    recentSearches.unshift({ term: query, date: new Date() });
    if (recentSearches.length > 10) recentSearches.pop();

    res.json({
      query,
      page,
      images: data.images
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

export const getRecentSearches = (req, res) => {
  console.log("getRecentSearches wurde aufgerufen");
  console.log(recentSearches)
  console.log('Aktuelle recentSearches:', recentSearches);
  const formatted = recentSearches.map(entry => ({
    term: entry.term,
    date: entry.date.toISOString()
  }));
  res.json(formatted);
};
