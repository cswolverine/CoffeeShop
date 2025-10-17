# CoffeeShop — Backend addition

This adds a minimal Node/Express backend and SQLite persistence for the CoffeeShop repo.

## Original Live Demo
https://cswolverine.github.io/CoffeeShop/

## Quick start (local)
1. Copy these files into your repository root (package.json, server.js, db.js, routes/*, Dockerfile, Procfile, .gitignore).
2. Create a `.env` file (not checked in) with:
   ```
   PORT=3000
   ADMIN_PASSWORD=some-secret
   SQLITE_FILE=./data/coffee.db
   ```
3. Install:
   ```
   npm install
   ```
4. Run (dev):
   ```
   npm run dev
   ```
   or production:
   ```
   npm start
   ```
5. Open http://localhost:3000/ — it serves your /public folder. API endpoints:
   - GET /api/menu
   - POST /api/orders  (body: items, total, customer_name, customer_email)
   - GET /api/orders (admin only — provide ADMIN_PASSWORD via header x-admin-password or ?adminPassword=)

## Deploy options
- Render: Create a Web Service, point it to the repo, build command `npm ci && npm run build` (if you have frontend build) or `npm ci`, start command `npm start`. Add env vars (ADMIN_PASSWORD) via Render dashboard. SQLite will persist on the Render service disk but consider moving to Postgres for higher durability.
- Heroku: Push repo, set Procfile present (web: node server.js), set config vars (ADMIN_PASSWORD). Use Heroku Postgres for production storage if needed.

## Next improvements
- Move menu management into an admin UI (protected).
- Replace SQLite with Postgres for multi-instance production.
- Add SendGrid / Mailgun integration for order notifications.
- Add simple authentication (JWT or session).
- Add GitHub Actions to run tests/lint and optionally deploy.
