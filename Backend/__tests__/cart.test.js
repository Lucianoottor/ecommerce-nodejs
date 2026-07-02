const request = require('supertest');
const { app } = require('../app');
const db = require('../models');

let userToken;
let productId;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // Create admin for product creation
  await db.User.create({
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

  // Login as admin and create a product
  const adminRes = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'admin@test.com', password: 'admin123' });
  const adminToken = adminRes.body.data.Token;

  const productRes = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Cart Test Product', price: 50.00, stock: 20 });
  productId = productRes.body.data.productId;

  // Login as user
  const userRes = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'user@test.com', password: 'user123' });
  userToken = userRes.body.data.Token;
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Cart endpoints', () => {
  describe('POST /api/v1/cart/addItem', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/v1/cart/addItem')
        .send({ productId, quantity: 1 });

      expect(res.status).toBe(401);
    });

    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/addItem')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it('should return 400 without productId', async () => {
      const res = await request(app)
        .post('/api/v1/cart/addItem')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/cart/getItems', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/v1/cart/getItems');

      expect(res.status).toBe(401);
    });

    it('should list cart items', async () => {
      const res = await request(app)
        .get('/api/v1/cart/getItems')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
