import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

let recentSearches = [];

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

        recentSearches.unshift({ term: query, date: new Date() });
        if (recentSearches.length > 10) recentSearches.pop();

        return res.status(200).json({
          query,
          page,
          images: fallbackData.images,
          fallbackActive: true
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
