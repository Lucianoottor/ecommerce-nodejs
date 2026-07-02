# Frontend Architecture

## Component Hierarchy

```
App
 └─ BrowserRouter
     └─ AuthProvider
         └─ CartProvider
             └─ ToastProvider
                 ├─ ScrollToTop
                 └─ Layout (header + nav + footer)
                     └─ Routes
                         ├─ Login / Register (public)
                         ├─ Products / ProductDetail (public)
                         ├─ ProtectedRoute → Cart / Checkout
                         └─ AdminRoute → Admin / AdminProducts / AdminTransactions
```

Providers are nested intentionally: `CartProvider` depends on `AuthProvider` (cart is user-scoped), and `ToastProvider` is independent but wraps everything so any component can show feedback.

## State Management: Why Context API

Three contexts, each owning a single domain:

| Context | State | Why it's separate |
|---|---|---|
| **AuthContext** | user, token, login/logout | Auth state affects routing, header, and API calls |
| **CartContext** | items, add/remove/update/clear | Cart is user-scoped but client-side (localStorage) |
| **ToastContext** | toast queue, showToast | UI feedback — no business logic dependency |

**Why not Redux/Zustand?** These three contexts don't share state. There's no complex cross-cutting state flow that would benefit from a centralized store. Context API keeps each domain self-contained with zero additional dependencies.

## Cart Strategy: Client-Side with Server Sync

The cart lives entirely in `localStorage`, keyed per user (`cart_{userId}`). This decision has trade-offs:

**Advantages:**
- No API calls while browsing/adding items — instant UI response
- Cart survives page refreshes and browser restarts
- Works offline (items are added locally)
- No server state to manage between sessions

**Trade-off:**
- Cart must sync to the server at checkout (sequential `POST /cart/addItem` calls)
- Stock could change between adding to cart and checking out

At checkout, the frontend syncs all items to the backend cart, then calls the payment endpoint. The backend validates stock at payment time — if a product is out of stock, the transaction fails with a clear error.

## Auth Flow

```
Login form → POST /users/login → JWT + user data returned
                                      │
                    ┌─────────────────┴──────────────────┐
                    │                                    │
              localStorage                        AuthContext
           (token, user JSON)                  (isAuthenticated, isAdmin)
                    │                                    │
              On page reload                     Consumed by:
           → restores from storage              - Layout (nav items)
                                                - ProtectedRoute
                                                - AdminRoute
                                                - api.ts interceptor
```

The Axios interceptor automatically attaches the JWT to every request and handles 401 responses by clearing auth state and redirecting to `/login`.

## Route Protection

Two guard components with a clear hierarchy:

- **ProtectedRoute**: Checks `isAuthenticated`. Redirects to `/login` if not.
- **AdminRoute**: Checks `isAuthenticated` AND `isAdmin`. Redirects to `/login` if not authenticated, to `/products` if authenticated but not admin.

Both show a loading spinner while `AuthProvider` restores state from localStorage on mount — this prevents a flash redirect on page reload.

## Frontend Testing

### Unit Tests (Vitest + React Testing Library)

21 tests across 4 files:

| File | Tests | What it validates |
|---|---|---|
| `Button.test.tsx` | 6 | Render, click handler, disabled state, loading spinner |
| `Input.test.tsx` | 4 | Label rendering, input binding, error display |
| `AuthContext.test.tsx` | 4 | Initial state, login sets user, logout clears, localStorage restore |
| `CartContext.test.tsx` | 7 | Empty cart, add, increment, remove, update quantity, clear, total calculation |

### E2E (Cypress)

One complete purchase flow:

```
Login → Browse catalog → Add 2 products → Verify cart badge
     → Navigate to cart → Proceed to checkout → Select PIX
     → Place order → Verify confirmation screen
```

## Design Decisions

| Decision | Why |
|---|---|
| Tailwind CSS v4 | Utility-first, no custom CSS files to maintain. Design consistency via Tailwind's scale system. |
| Axios over fetch | Interceptors for JWT injection and 401 handling. Timeout configuration. Cleaner error handling. |
| `formatPrice` utility | Centralized R$ formatting with `Intl.NumberFormat` — consistent across all pages. |
| Skeleton loaders | Better perceived performance than spinners for list pages. Users see the layout immediately. |
| Toast notifications | Non-blocking feedback for all user actions (add to cart, errors, order confirmation). Auto-dismiss after 3s. |
