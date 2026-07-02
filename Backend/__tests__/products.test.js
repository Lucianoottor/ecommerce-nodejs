const request = require('supertest');
const { app } = require('../app');
const db = require('../models');

let adminToken;
let userToken;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // Create admin user
  const admin = await db.User.create({
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create regular user
  await db.User.create({
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
  });

  // Login as admin
  const adminRes = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'admin@test.com', password: 'admin123' });
  adminToken = adminRes.body.data.Token;

  // Login as user
  const userRes = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'user@test.com', password: 'user123' });
  userToken = userRes.body.data.Token;
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Product endpoints', () => {
  describe('GET /api/v1/products', () => {
    it('should list products without auth', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Test Product', price: 99.99, stock: 10 });

      expect(res.status).toBe(401);
    });

    it('should return 403 as regular user', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test Product', price: 99.99, stock: 10 });

      expect(res.status).toBe(403);
    });

    it('should create product as admin', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Product', price: 99.99, stock: 10, description: 'A test product' });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe('Test Product');
      expect(res.body.data.price).toBe(99.99);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should get a product by id without auth', async () => {
      const products = await request(app).get('/api/v1/products');
      const productId = products.body.data[0].productId;

      const res = await request(app).get(`/api/v1/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/v1/products/99999');

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should return 403 as regular user', async () => {
      const products = await request(app).get('/api/v1/products');
      const productId = products.body.data[0].productId;

      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
