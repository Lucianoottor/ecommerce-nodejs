# RBAC (Role-Based Access Control)

## The Problem

Different users need different access levels. An admin can create/edit/delete products and view all transactions. A regular user can only browse products and manage their own cart. Hardcoding `if (user.role === 'admin')` in every route handler doesn't scale and mixes authorization with business logic.

## The Solution

A declarative permission system with three components:

```
roles.json (config)  →  Permissions class (lookup)  →  rbac middleware (enforcement)
```

### 1. Role Configuration (`config/roles.json`)

Roles and their permissions are defined in a JSON file, not in code:

```json
{
  "roles": [
    {
      "name": "admin",
      "permissions": [
        "create_user", "read_user", "update_user", "delete_user",
        "create_product", "read_product", "update_product", "delete_product",
        "create_cart", "read_cart", "update_cart", "delete_cart"
      ]
    },
    {
      "name": "user",
      "permissions": [
        "read_product",
        "create_cart", "read_cart", "update_cart", "delete_cart"
      ]
    }
  ]
}
```

Adding a new role (e.g., `moderator`) means adding an entry here — no code changes.

### 2. Permission Lookup (`permissions.js`)

The `Permissions` class reads `roles.json` and returns the permission list for a given role name. It's a simple lookup — no database query, no external call.

### 3. Middleware Enforcement (`middleware/rbac.js`)

The middleware is a higher-order function that takes the required permission as an argument and returns an Express middleware:

```
Route definition:
  router.post('/', auth.verifyToken, rbac.checkPermission('create_product'), controller.create)

Execution:
  1. auth.verifyToken → sets req.user = { id, email, role }
  2. rbac.checkPermission('create_product')
     → reads req.user.role ('user')
     → looks up permissions for 'user' role
     → 'create_product' not in list → 403 Access Denied
```

## Why This Approach

| Alternative | Problem |
|---|---|
| `if (req.user.role === 'admin')` in handlers | Scattered authorization checks, easy to forget one |
| Database-stored permissions | Extra query on every request, more complex |
| Third-party RBAC library | Overkill for two roles, adds dependency |

The current approach is zero-dependency, declarative, and works entirely from the JWT payload — no database query needed for authorization.

## Middleware Chain

The auth chain is always: **verify identity first, then check permissions**.

```
verifyToken (who are you?) → checkPermission (can you do this?) → handler (do it)
```

This ordering matters: `checkPermission` depends on `req.user` being set by `verifyToken`. If the token is invalid, the request never reaches the permission check.
