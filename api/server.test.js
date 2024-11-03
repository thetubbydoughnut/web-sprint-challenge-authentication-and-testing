const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('auth endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });

    test('responds with 400 if username or password missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'test' });
      expect(res.body).toBe("username and password required");
    });
  });
});    