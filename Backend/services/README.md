# Services — Business Logic Layer

## Why Services Exist

Controllers handle HTTP. Services handle business rules. This separation means:

- A service method can be called from a controller, a test, or a seed script — it doesn't care about `req`/`res`
- Business logic changes don't touch the HTTP layer
- Services are testable by injecting mock models

## Constructor Injection

Every service receives its dependencies through the constructor:

```javascript
class PaymentService {
    constructor(TransactionModel, CartModel, CartItemModel, ProductModel) {
        this.TransactionModel = TransactionModel;
        // ...
    }
}
```

This makes testing straightforward — pass mock models in tests, real models in production. No global imports to mock.

## Payment Processing — Transactional Integrity

The payment flow is the most critical operation. It involves multiple writes that must succeed or fail together:

```
1. Calculate total from cart items
2. Validate stock for each product
3. Decrement stock for each product
4. Create transaction record
5. Delete cart items
6. Delete cart
```

If step 4 fails after step 3, the stock would be decremented without a transaction record. To prevent this, the entire flow is wrapped in a Sequelize database transaction:

```javascript
return await sequelize.transaction(async (t) => {
    // All operations receive { transaction: t }
    // If any throws, all changes are rolled back
});
```

### N+1 Prevention

The cart is loaded with eager loading (`include` with nested associations):

```javascript
Cart.findOne({
    where: { userId },
    include: [{
        model: CartItem, as: 'items',
        include: [{ model: Product, as: 'product' }]
    }]
});
```

This generates a single SQL query with JOINs instead of:
- 1 query for the cart
- N queries for each cart item's product

During payment, `item.product` is already available — no re-fetching with `findByPk`.

## Cart Service — Stock Validation

Stock is validated at two points:

1. **When adding to cart**: `product.stock < quantity` prevents adding more than available
2. **When adding more**: `product.stock < (existing + new)` prevents cumulative over-ordering

This double-check is intentional — stock can change between adding to cart and checking out (another user might buy the last unit).

## User Service — Role Enforcement

Registration always sets `role: 'user'` regardless of the request body:

```javascript
const newUser = await this.User.create({ email, birthDate, password, role: 'user' });
```

This prevents privilege escalation via API manipulation — even if someone sends `{ role: 'admin' }` in the request, it's overridden.
