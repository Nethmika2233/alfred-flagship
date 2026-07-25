# Alfred Clothing

A full-stack e-commerce platform built for a real small fashion brand — complete shopping experience, seller inventory management with image uploads, and an admin dashboard for order fulfillment.

**[Live Demo](https://alfred-flagship.vercel.app)** &nbsp;·&nbsp; Built with Next.js 16, React 19, TypeScript, Prisma, and PostgreSQL

<!--
  Add a few screenshots here before sharing this repo, e.g.:
  ![Homepage](docs/screenshots/homepage.png)
  ![Product page](docs/screenshots/product.png)
  ![Seller dashboard](docs/screenshots/seller-dashboard.png)
  ![Admin dashboard](docs/screenshots/admin-dashboard.png)
-->

## Overview

Alfred Clothing is a complete, three-role e-commerce system: shoppers can browse a real catalog, build a cart, and check out; the brand owner (seller) manages products, stock, and photos directly from a dashboard; and an admin oversees every order and its fulfillment status. It's a from-scratch rebuild of a scaffolded storefront — every data flow is backed by a real Postgres database, not mock arrays.

## Features

**Storefront**
- Product catalog with category filtering and live search
- Product detail pages with per-size/color stock awareness
- Persistent cart (survives page reloads) with quantity controls
- Multi-step animated checkout with transactional order creation (no overselling, even under concurrent checkouts)
- Order history and confirmation pages
- Animated, brand-consistent UI throughout (Framer Motion + GSAP — drifting ambient backgrounds, cursor-reactive product tilt, animated cart drawer)

**Seller dashboard**
- Full product CRUD — create, edit, archive/restore, and permanently delete products
- Dynamic size/color/stock variant management per product
- Real photo uploads via Cloudinary
- Dashboard with stock levels, low-stock alerts, and recent orders

**Admin dashboard**
- Store-wide stats: revenue, order count, customers, active products
- Full order list with inline fulfillment-status updates
- Order detail view with payment-status control and shipping info

**Auth & access control**
- Credentials-based authentication (email + password, bcrypt-hashed)
- Three roles (Customer / Seller / Admin) enforced at the routing layer

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Framer Motion, GSAP |
| Database | PostgreSQL (Neon) via Prisma 7 |
| Auth | NextAuth v5 (Credentials provider, JWT sessions) |
| Image storage | Cloudinary |
| Password hashing | bcryptjs |

## A few interesting engineering decisions

- **Soft-delete instead of hard-delete.** A product variant that's ever been ordered can't be deleted without breaking historical order records (the `OrderItem` foreign key would break). Removing such a variant sets `isDiscontinued: true` and zeroes its stock instead of destroying the row — order history stays intact no matter what a seller removes later. A genuine permanent delete is only offered when a product has zero order history.
- **Transactional checkout with race-safe stock decrements.** Placing an order runs inside a single Prisma transaction that conditionally decrements stock (`WHERE stockQuantity >= quantity`), so two customers checking out the last unit at the same time can't both succeed.
- **Role-based routing at the edge.** `proxy.ts` (Next.js 16's renamed middleware) redirects unauthenticated and wrong-role users before a protected page ever renders, with a defense-in-depth session check repeated in each protected layout/page in case a route is hit directly.
- **ISR on the homepage.** Featured products revalidate every 60 seconds rather than freezing at build time, so a seller's changes show up without a full redeploy.

## Getting started

```bash
git clone https://github.com/Nethmika2233/alfred-flagship.git
cd alfred-flagship
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

You'll need:
- A PostgreSQL connection string (e.g. a free [Neon](https://neon.tech) database)
- A Cloudinary account (free tier) for image uploads — see `.env.example` for what to grab from your dashboard
- An `AUTH_SECRET` — generate one with `openssl rand -base64 32`

Then set up the database and seed it with sample data:

```bash
npx prisma migrate dev
npx prisma db seed
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Test accounts

The seed script creates one login for each role (password for all three: `ChangeMe123!`):

| Role | Email |
|---|---|
| Customer | `customer@example.com` |
| Seller | `seller@alfredclothing.com` |
| Admin | `admin@alfredclothing.com` |

## Known limitations

This is an active portfolio project, not a production business — a few things are intentionally simplified:

- Checkout is a mock payment flow (no real card processing yet)
- No transactional email (order confirmations, password reset)
- No automated test suite yet

## License

MIT
