# Flutter Firebase E-Commerce API

## Authentication

### `POST /api/auth/register`
Create a new user account backed by Firebase Auth.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | yes | User email address |
| `password` | string | yes | Min 8 chars, one uppercase, one number |
| `displayName` | string | no | Display name |

**Response 201:** `{ "uid": "abc123", "token": "eyJ..." }`

### `POST /api/auth/login`
Authenticate and receive a JWT.

**Response 200:** `{ "uid": "abc123", "token": "eyJ...", "expiresIn": 3600 }`

## Products

### `GET /api/products`
List products with pagination and filtering.

**Query Parameters:** `page`, `limit`, `category`, `minPrice`, `maxPrice`, `sort` (price_asc, price_desc, newest)

**Response 200:**
```json
{ "products": [{ "id": "prod_001", "name": "Widget", "price": 19.99, "stock": 42 }], "total": 128, "page": 1 }
```

### `GET /api/products/:id`
Get a single product by ID including images, description, and reviews.

## Cart

### `GET /api/cart`
Retrieve the authenticated user's cart with computed subtotal, tax, and total.

### `POST /api/cart/items`
Add an item to the cart. Body: `{ "productId": "prod_001", "quantity": 2 }`.

### `PATCH /api/cart/items/:productId`
Update quantity of an existing cart item. Body: `{ "quantity": 5 }`.

### `DELETE /api/cart/items/:productId`
Remove an item from the cart.

## Orders

### `POST /api/checkout/session`
Create a Stripe Checkout session for the current cart. Body: `{ "successUrl": "...", "cancelUrl": "..." }`.

**Response 200:** `{ "sessionId": "cs_live_...", "url": "https://checkout.stripe.com/..." }`

### `GET /api/orders`
List the authenticated user's past orders.

### `GET /api/orders/:id`
Get details of a specific order including line items, shipping status, and payment info.

## Webhooks

### `POST /api/webhook/stripe`
Stripe webhook receiver. Handles `checkout.session.completed` and `payment_intent.payment_failed` events. Requires valid `stripe-signature` header.

## Authentication
All endpoints except `/api/auth/*` and `/api/products` (GET) require a valid Firebase JWT in the `Authorization: Bearer <token>` header.
