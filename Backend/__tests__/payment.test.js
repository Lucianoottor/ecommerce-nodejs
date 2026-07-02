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
    .send({ name: 'Payment Test Product', price: 100.00, stock: 10 });
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

describe('Payment endpoints', () => {
  describe('POST /api/v1/payment/pix', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/v1/payment/pix');

      expect(res.status).toBe(401);
    });

    it('should return 400 if cart is empty', async () => {
      const res = await request(app)
        .post('/api/v1/payment/pix')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should process pix payment with items in cart', async () => {
      // Add item to cart first
      await request(app)
        .post('/api/v1/cart/addItem')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 1 });

      const res = await request(app)
        .post('/api/v1/payment/pix')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.paymentMethod).toBe('pix');
      expect(res.body.data.status).toBe('completed');
      expect(res.body.data.totalAmount).toBe(100);
    });
  });

  describe('POST /api/v1/payment/credit-card', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/v1/payment/credit-card');

      expect(res.status).toBe(401);
    });
  });
});
