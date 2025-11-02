import request from 'supertest';
import app from '../src/index.js';

describe('GET /', () => {
  it('responds with ok true', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
