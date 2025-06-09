import request from 'supertest';
import app from '../server.js';
import { describe, test, expect } from 'vitest';

import { searchImages } from '../controllers/imageSearchController.js';

describe('Recent Searches API', () => {
  test('should return recent searches', async () => {
    // Simuliere einen Suchaufruf (optional, aber gut für realistischeren Test)
    await request(app).get('/api/imagesearch/cats?page=1');

    // Jetzt Recent-Route testen
    const response = await request(app).get('/api/recentsearches');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);

    // Prüfe das erste Element
    const firstSearch = response.body[0];
    expect(firstSearch).toHaveProperty('term');
    expect(firstSearch).toHaveProperty('date');
    expect(new Date(firstSearch.date).toString()).not.toBe('Invalid Date');
  });
});