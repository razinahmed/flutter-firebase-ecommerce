<div align="center">

<img src="https://placehold.co/900x250/0d1117/02d2b8?text=Flutter+Firebase+E-Commerce&font=montserrat" alt="Flutter Firebase E-Commerce Banner" width="100%" />

# Flutter Firebase E-Commerce

**A complete cross-platform mobile shopping app powered by Flutter and Firebase — product catalog, cart management, Stripe payments, push notifications, and real-time order tracking**

[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Screens](#-screens) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## Overview

A feature-rich, production-ready e-commerce mobile application built with Flutter and backed by Firebase. The app delivers a seamless shopping experience with real-time data synchronization, secure payment processing, and native push notifications across iOS and Android.

## Features

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browsable product grid with categories, sorting, and pagination |
| **Shopping Cart** | Persistent cart with quantity management and price calculation |
| **Stripe Checkout** | Secure payment processing with Stripe integration |
| **Push Notifications** | Firebase Cloud Messaging for order updates and promotions |
| **Real-time Order Tracking** | Live order status updates powered by Firestore streams |
| **User Auth** | Email/password and social login via Firebase Authentication |
| **Wishlist** | Save favorite products with sync across devices |
| **Search & Filters** | Full-text search with category, price, and rating filters |

## Tech Stack

<div align="center">

| Technology | Purpose |
|:----------:|:-------:|
| ![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white) | UI Framework |
| ![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white) | Language |
| ![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Authentication |
| ![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Database |
| ![Cloud Functions](https://img.shields.io/badge/Cloud_Functions-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Backend Logic |
| ![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white) | Payments |

</div>

## Getting Started

### Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install) >= 3.16
- [Dart](https://dart.dev/get-dart) >= 3.2
- [Firebase CLI](https://firebase.google.com/docs/cli) >= 12.0
- [Stripe Account](https://dashboard.stripe.com/register) (for payments)
- Android Studio / Xcode for platform-specific builds

### Installation

```bash
# Clone the repository
git clone https://github.com/razinahmed/flutter-firebase-ecommerce.git
cd flutter-firebase-ecommerce

# Install Flutter dependencies
flutter pub get

# Configure Firebase
flutterfire configure

# Set up environment variables
cp .env.example .env
# Edit .env with your Stripe keys and Firebase config
```

### Quickstart

```bash
# Run on connected device or emulator
flutter run

# Run in release mode
flutter run --release

# Run tests
flutter test

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

## Project Structure

```
flutter-firebase-ecommerce/
├── lib/
│   ├── models/
│   │   ├── product.dart          # Product data model
│   │   ├── cart_item.dart        # Cart item model
│   │   ├── order.dart            # Order model
│   │   └── user.dart             # User profile model
│   ├── screens/
│   │   ├── home/                 # Home & product catalog
│   │   ├── product_detail/       # Product detail view
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout & payment
│   │   ├── orders/               # Order history & tracking
│   │   ├── wishlist/             # Wishlist screen
│   │   ├── search/               # Search & filters
│   │   └── auth/                 # Login & registration
│   ├── services/
│   │   ├── auth_service.dart     # Firebase Auth wrapper
│   │   ├── product_service.dart  # Product CRUD operations
│   │   ├── cart_service.dart     # Cart management
│   │   ├── order_service.dart    # Order processing
│   │   ├── payment_service.dart  # Stripe integration
│   │   └── notification_service.dart  # Push notifications
│   ├── providers/                # State management (Riverpod)
│   ├── widgets/                  # Reusable UI components
│   ├── utils/                    # Helpers and constants
│   └── main.dart                 # App entry point
├── functions/
│   ├── src/
│   │   ├── payments.ts           # Stripe webhook handlers
│   │   └── notifications.ts      # Push notification triggers
│   └── index.ts                  # Cloud Functions entry
├── test/                         # Unit and widget tests
├── assets/                       # Images, fonts, icons
├── pubspec.yaml                  # Flutter dependencies
└── README.md
```

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Featured products, categories, promotional banners |
| **Product Detail** | Image gallery, description, reviews, add-to-cart |
| **Cart** | Item list, quantity controls, subtotal calculation |
| **Checkout** | Address form, payment method, order summary |
| **Order Tracking** | Real-time status updates with timeline view |
| **Profile** | User settings, order history, saved addresses |

## Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password and Google providers)
3. Create a **Firestore** database with the following collections: `products`, `users`, `orders`, `carts`
4. Deploy **Cloud Functions** for Stripe webhook handling:

```bash
cd functions
npm install
firebase deploy --only functions
```

5. Set Stripe secret key in Firebase config:

```bash
firebase functions:config:set stripe.secret_key="sk_live_..."
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-screen`)
3. Commit your changes (`git commit -m 'feat: add new screen'`)
4. Push to the branch (`git push origin feature/new-screen`)
5. Open a Pull Request

Please ensure your code passes `flutter analyze` and includes widget tests for new screens.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with passion by [Razin Ahmed](https://github.com/razinahmed)**

`Flutter` · `Firebase` · `E-Commerce` · `Mobile App` · `Dart` · `Shopping App` · `Cross-Platform`

</div>
