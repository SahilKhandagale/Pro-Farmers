# AgriEquip Marketplace

A Node.js + Express + MongoDB demo app for a rural farm equipment marketplace.

## Quick Start

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Open http://localhost:3000

- Demo seller login after seed: `seller@example.com` / `password` (or create your own).
- Sellers can add equipment with images and YouTube links + subsidy %.
- Farmers can browse, compare, add to cart, and place a simple order (no payment).

## Folder Structure

```
agri-equip-marketplace/
  public/           # static assets
  seeds/            # seed script
  src/
    config/         # db connection
    middleware/     # auth helpers
    models/         # Mongoose models
    routes/         # Express routes
    utils/          # utilities
    views/          # EJS templates (Bootstrap UI)
  .env.example
  package.json
  server.js
```

## Notes
- Sessions are stored in MongoDB via connect-mongo.
- File uploads (images) are saved under `public/uploads`.
- Video support uses YouTube embed links.
