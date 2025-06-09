import express from 'express';
import cors from 'cors';
import { searchImages, getRecentSearches, loadSearches } from './controllers/imageSearchController.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get('/api/imagesearch/:query', searchImages);
app.get('/api/recentsearches', getRecentSearches);

loadSearches();

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

export default app;


