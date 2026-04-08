const request = require('supertest');
const app = require('../../src/server');
const { setupTestDB, teardownTestDB } = require('../helpers/db');

let server;

beforeAll(async () => {
  await setupTestDB();
  server = app.listen(0);
});

afterAll(async () => {
  server.close();
  await teardownTestDB();
});

describe('Cart Operations E2E', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    authToken = res.body.token;
  });

  it('should add a product to the cart', async () => {
    const res = await request(server)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 'prod_001', quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.items[0].productId).toBe('prod_001');
    expect(res.body.cart.items[0].quantity).toBe(2);
  });

  it('should update item quantity in the cart', async () => {
    const res = await request(server)
      .patch('/api/cart/items/prod_001')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

  it('should remove an item from the cart', async () => {
    const res = await request(server)
      .delete('/api/cart/items/prod_001')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(0);
  });

  it('should calculate the correct cart total including tax', async () => {
    await request(server)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 'prod_002', quantity: 1 });

    const res = await request(server)
      .get('/api/cart')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.cart.subtotal).toBeGreaterThan(0);
    expect(res.body.cart.tax).toBeGreaterThan(0);
    expect(res.body.cart.total).toBe(res.body.cart.subtotal + res.body.cart.tax);
  });
});

describe('Stripe Checkout E2E', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });
    authToken = res.body.token;
  });

  it('should create a Stripe checkout session for the current cart', async () => {
    await request(server)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 'prod_003', quantity: 1 });

    const res = await request(server)
      .post('/api/checkout/session')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ successUrl: 'https://app.test/success', cancelUrl: 'https://app.test/cancel' });

    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.url).toContain('checkout.stripe.com');
  });

  it('should handle Stripe webhook for successful payment', async () => {
    const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: { id: 'cs_test_123', metadata: { userId: 'user_1' } } } });
    const res = await request(server)
      .post('/api/webhook/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'test_sig')
      .send(payload);

    expect(res.status).toBe(200);
  });
});
