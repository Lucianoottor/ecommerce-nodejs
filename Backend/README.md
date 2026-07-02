# Backend Architecture

## Layered Architecture

```
Request → Route → Middleware(s) → Controller → Service → Model → Database
```

Each layer has a strict responsibility boundary:

- **Routes** define HTTP verbs, paths, and which middleware/controller handles them. No business logic lives here. [Details →](routes/v1/README.md)
- **Middleware** intercepts requests before they reach controllers. Two key middlewares form the auth chain: JWT verification (`auth.js`) and permission check (`rbac.js`). [Details →](lib/rbac/README.md)
- **Controllers** translate HTTP (req/res) into service calls. They parse request params, call the appropriate service method, and format the HTTP response. They don't know about the database.
- **Services** hold all business logic. They receive plain JavaScript arguments (not `req`/`res`) and interact with models. This makes them testable without HTTP context.
- **Models** define the database schema and relationships via Sequelize. They are auto-loaded from the `models/` directory.

## Why This Separation

A controller like `productController.createProduct` doesn't query the database — it calls `productService.createProduct`. This means:

1. **Testing**: Services can be unit tested by injecting mock models (constructor injection pattern used across all services)
2. **Reuse**: `paymentService.getCart()` is called by both payment methods without duplicating logic
3. **Single Responsibility**: If the response format changes (e.g., adding pagination metadata), only the controller changes. If the business rule changes (e.g., stock validation), only the service changes.

## Auth Flow

```
Request
  │
  ├─ Public routes (GET /products, POST /login)
  │   → Controller directly
  │
  └─ Protected routes
      │
      ├─ auth.verifyToken
      │   → Extracts JWT from Authorization header
      │   → Decodes { id, email, role } into req.user
      │   → 401 if missing or invalid
      │
      └─ rbac.checkPermission('create_product')
          → Looks up req.user.role in roles.json
          → Checks if role has the required permission
          → 403 if denied
          → next() if allowed
```

The JWT payload includes the user's role, so RBAC checks don't require a database query. The trade-off: role changes take effect only after the user re-authenticates (token expires in 1h).

## Security Measures

| Measure | Implementation |
|---|---|
| Password hashing | bcryptjs (salt rounds in model hook) |
| Helmet | Sets security headers (X-Frame-Options, CSP, etc.) |
| CORS | Whitelist of allowed origins |
| Rate limiting | 10 requests/15min on login/register endpoints |
| Body size limit | 10kb max on JSON/URL-encoded payloads |
| Role enforcement | Registration always sets `role: 'user'` regardless of request body |
| Input validation | Email regex, integer checks, ID parsing on controllers |

## Error Handling

All errors follow a consistent format:

```json
{ "error": "Human-readable message", "statusCode": 400 }
```

The global error handler in `app.js` catches unhandled exceptions and returns a 500 with the same format, preventing stack traces from leaking to clients.

## Database

Sequelize ORM with auto-discovery: `models/index.js` scans the `models/` directory, imports each model, and calls `associate()` to set up relationships:

```
User ──┬── Cart ──── CartItem ──── Product
       └── Transaction
```

- **User → Cart**: one-to-one (a user has one active cart)
- **Cart → CartItem**: one-to-many (a cart has many items)
- **CartItem → Product**: many-to-one (each item references a product)
- **User → Transaction**: one-to-many (payment history)
