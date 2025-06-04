import fetch from 'node-fetch';
let recentSearches = [];



export const searchImages = async (req, res) => {
  const query = req.params.query;
  const page = parseInt(req.query.page) || 1;

  try {
    const response = await fetch(`https://image-search-abstraction-layer.freecodecamp.rocks/query/${encodeURIComponent(query)}?page=${page}`);
    if (!response.ok) {
      throw new Error(`Fehler bei der API-Anfrage: ${response.statusText}`);
    }
    const data = await response.json();

    // Suche speichern
    recentSearches.unshift({ term: query, date: new Date() });
    if (recentSearches.length > 10) recentSearches.pop();

    res.json({
      query,
      page,
      images: data.images
    });
  } catch (error) {
    console.error('Fehler bei der Bildersuche:', error);
    res.status(500).json({ error: 'Fehler bei der API-Anfrage' });
  }
};

// Getter-Funktion für die letzten Suchanfragen
export const getRecentSearches = (req, res) => {
  const formatted = recentSearches.map(entry => ({
    term: entry.term,
    date: entry.date.toISOString()
  }));
  res.json(formatted);
};
