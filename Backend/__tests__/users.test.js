const request = require('supertest');
const { app } = require('../app');
const db = require('../models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('User endpoints', () => {
  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe('test@test.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'test2@test.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login with valid credentials and return token', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.Token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 if email and password are missing', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
