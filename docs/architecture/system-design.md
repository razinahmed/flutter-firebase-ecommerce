# System Architecture -- Flutter Firebase E-Commerce

## Overview
A cross-platform e-commerce application built with Flutter on the frontend and Firebase services on the backend. A lightweight Node.js API server handles Stripe payment processing and order management, while Firestore serves as the primary data store.

## Frontend (Flutter)
- Built with Flutter 3.x targeting iOS, Android, and web.
- State management via Riverpod providers for cart, auth, and product catalog.
- Uses `firebase_auth` package for authentication and `cloud_firestore` for real-time data sync.
- Product listing, search, and filtering happen client-side against a Firestore collection with composite indexes.

## Backend Components

### 1. Firebase Auth
- Handles user registration, login, and token issuance.
- Supports email/password and Google OAuth providers.
- JWTs are verified server-side on every protected API call.

### 2. Cloud Firestore
- Collections: `users`, `products`, `carts`, `orders`.
- Cart documents are keyed by `userId` and contain an `items` array.
- Orders are created atomically using Firestore transactions to decrement product stock and move cart items into an order document.
- Security rules enforce that users can only read/write their own cart and orders.

### 3. API Server (Node.js / Express)
- Runs on Cloud Run behind Firebase Hosting rewrites.
- Exposes REST endpoints for cart operations, checkout, and order queries.
- Integrates with Stripe SDK for creating Checkout Sessions and processing webhooks.

### 4. Stripe Integration
- Checkout sessions are created server-side with line items derived from the user's cart.
- On successful payment, a Stripe webhook triggers order fulfillment: the order status is set to `paid`, stock is decremented, and the cart is cleared.
- Failed payments leave the order in `pending` and notify the user via a Firestore listener.

## Data Flow
```
Flutter App --> [Firebase Auth] --> JWT
     |
     +--> [Firestore] <--> Products / Cart (real-time sync)
     |
     +--> [API Server (Cloud Run)]
               |
          [Stripe API] --> Checkout Session
               |
          [Webhook] --> Order Fulfillment --> [Firestore]
```

## Deployment
- Flutter web is hosted on Firebase Hosting.
- Mobile builds are distributed via Firebase App Distribution for testing and App Store / Play Store for production.
- The API server is containerized and deployed to Cloud Run with automatic scaling (min 0, max 10 instances).
- Environment secrets (Stripe keys, Firebase admin credentials) are stored in Google Secret Manager.

## Scaling Considerations
- Firestore auto-scales reads/writes but requires careful index design for product queries.
- Cloud Run scales to zero when idle, keeping costs low for small shops.
- Cart operations use optimistic concurrency via Firestore document versioning to handle race conditions.
