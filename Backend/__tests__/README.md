# Testing Strategy

## Architecture Decision: app.js / server.js Split

The Express app is defined in `app.js` and exported without calling `listen()`. The `server.js` file imports the app and starts the server. This split exists because supertest needs the Express app object to make requests — it creates its own ephemeral server internally.

```
app.js    → exports { app, syncDatabase }  → used by tests via supertest
server.js → imports app, calls listen()    → used in production
```

## SQLite In-Memory for Test Isolation

Tests use SQLite in-memory instead of PostgreSQL:

```javascript
// config.js
"test": {
    "dialect": "sqlite",
    "storage": ":memory:",
    "logging": false
}
```

**Why not PostgreSQL for tests?**

- No database server required — tests run anywhere (CI, local, Docker)
- Each test file calls `sync({ force: true })` — drops and recreates all tables
- Complete isolation between test files — no test pollution
- Fast: in-memory means no disk I/O

**Trade-off**: SQLite doesn't support all PostgreSQL features (e.g., some data types, transactions behave differently). For this project, the models and queries are simple enough that both dialects behave identically.

## Test Structure

Each test file is self-contained: it syncs the database, creates any prerequisite data (users, products), and cleans up implicitly via `force: true`.

| File | Tests | What it validates |
|---|---|---|
| `users.test.js` | 6 | Register (201, missing email 400, missing password 400), Login (200+token, invalid credentials 401, missing fields 400) |
| `products.test.js` | 8 | List without auth (200), create without auth (401), create as user (403), create as admin (201), get by ID (200), get non-existent (404), list with pagination, delete as user (403) |
| `cart.test.js` | 5 | Add without auth (401), add item (200), add without productId (400), get without auth (401), get items (200) |
| `payment.test.js` | 4 | PIX without auth (401), PIX empty cart (400), PIX with items (200), credit-card without auth (401) |

## What the Tests Prove

- **Auth boundary**: Every protected endpoint returns 401 without a token
- **RBAC boundary**: User role can't create/delete products (403)
- **Happy paths**: Core flows (register → login → add to cart → pay) work end-to-end
- **Validation**: Missing/invalid input returns appropriate errors

## Coverage

```
22 tests | 67% statement coverage
```

Coverage is concentrated in the layers that tests exercise: routes, middleware, controllers. Services that require more complex scenarios (concurrent stock, transaction rollback) have lower coverage — a deliberate trade-off for the project's scope.
