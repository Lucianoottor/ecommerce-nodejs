# API Routes

## Design Decisions

### RESTful Resource Mapping

Routes are organized by resource: `/users`, `/products`, `/cart`, `/payment`. Each resource file is self-contained — it instantiates its own service and controller via constructor injection:

```
const productService = new ProductService(db.Product);
const productController = new ProductController(productService);
```

This pattern makes dependencies explicit. Each service receives only the models it needs, not the entire `db` object.

### Public vs Protected

Routes fall into three access levels:

| Level | Middleware | Example |
|---|---|---|
| Public | None | `GET /products`, `POST /login` |
| Authenticated | `auth.verifyToken` | `POST /payment/pix` |
| Admin | `auth.verifyToken` + `rbac.checkPermission(...)` | `POST /products`, `DELETE /products/:id` |

The middleware is applied per-route, not per-router. This gives fine-grained control — the same `/products` router has public `GET` and admin-only `POST`.

### Rate Limiting

Login and register endpoints have a dedicated rate limiter (10 requests per 15-minute window per IP). This prevents brute-force attacks without affecting the rest of the API.

### Pagination

`GET /products` supports `?page=1&limit=20`. The response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 48,
    "totalPages": 3
  }
}
```

Offset-based pagination was chosen over cursor-based because the product catalog is relatively small and doesn't change frequently during a browsing session.

### Admin Stats

The `/admin/stats` endpoint aggregates metrics using Sequelize's `count()` and `sum()` directly — no intermediate queries or application-level aggregation. This keeps the response fast and lets the database do what it's good at.
