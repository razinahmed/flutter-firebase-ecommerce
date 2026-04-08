const { CartService } = require('../../src/services/cart');
const { PriceCalculator } = require('../../src/services/pricing');
const { OrderBuilder } = require('../../src/services/order');
const { ProductValidator } = require('../../src/validators/product');

describe('CartService', () => {
  let cart;

  beforeEach(() => {
    cart = new CartService();
  });

  it('should start with an empty cart', () => {
    expect(cart.getItems()).toEqual([]);
    expect(cart.getTotal()).toBe(0);
  });

  it('should add a product with quantity', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', price: 19.99, quantity: 2 });
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].quantity).toBe(2);
  });

  it('should increment quantity when adding the same product again', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', price: 19.99, quantity: 1 });
    cart.addItem({ productId: 'p1', name: 'Widget', price: 19.99, quantity: 3 });
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].quantity).toBe(4);
  });

  it('should remove a product by id', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', price: 10, quantity: 1 });
    cart.removeItem('p1');
    expect(cart.getItems()).toHaveLength(0);
  });

  it('should throw when removing a non-existent product', () => {
    expect(() => cart.removeItem('missing')).toThrow('Item not found in cart');
  });

  it('should clear all items', () => {
    cart.addItem({ productId: 'p1', name: 'A', price: 10, quantity: 1 });
    cart.addItem({ productId: 'p2', name: 'B', price: 20, quantity: 2 });
    cart.clear();
    expect(cart.getItems()).toEqual([]);
  });
});

describe('PriceCalculator', () => {
  const calc = new PriceCalculator({ taxRate: 0.08 });

  it('should calculate subtotal from line items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 25, quantity: 1 },
    ];
    expect(calc.subtotal(items)).toBe(45);
  });

  it('should calculate tax correctly', () => {
    expect(calc.tax(100)).toBeCloseTo(8.0);
  });

  it('should calculate total as subtotal plus tax', () => {
    const items = [{ price: 50, quantity: 2 }];
    const sub = calc.subtotal(items);
    expect(calc.total(items)).toBeCloseTo(sub + calc.tax(sub));
  });

  it('should apply a percentage discount', () => {
    const items = [{ price: 100, quantity: 1 }];
    expect(calc.total(items, { discountPercent: 10 })).toBeCloseTo(97.2);
  });
});

describe('OrderBuilder', () => {
  it('should create an order from cart items and user info', () => {
    const order = OrderBuilder.build({
      userId: 'u1',
      items: [{ productId: 'p1', name: 'Widget', price: 20, quantity: 1 }],
      shippingAddress: { city: 'Portland', zip: '97201' },
    });
    expect(order.id).toBeDefined();
    expect(order.status).toBe('pending');
    expect(order.items).toHaveLength(1);
    expect(order.shippingAddress.city).toBe('Portland');
  });

  it('should reject an order with no items', () => {
    expect(() => OrderBuilder.build({ userId: 'u1', items: [] })).toThrow('Cart is empty');
  });
});

describe('ProductValidator', () => {
  it('should accept a valid product', () => {
    const result = ProductValidator.validate({ name: 'Gadget', price: 49.99, stock: 10 });
    expect(result.valid).toBe(true);
  });

  it('should reject a product with negative price', () => {
    const result = ProductValidator.validate({ name: 'Gadget', price: -5, stock: 10 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Price must be positive');
  });

  it('should reject a product with missing name', () => {
    const result = ProductValidator.validate({ name: '', price: 10, stock: 1 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });
});
