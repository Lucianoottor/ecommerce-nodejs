describe('Purchase Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('completes a full purchase: login → browse → add to cart → checkout', () => {
    // Step 1: Login
    cy.visit('/login');
    cy.get('input[type="email"]').type('user@store.com');
    cy.get('input[type="password"]').type('user123');
    cy.get('button[type="submit"]').click();

    // Should redirect to products
    cy.url().should('include', '/products');

    // Step 2: Browse catalog and add first product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });

    // Should show success toast
    cy.contains('added to cart').should('be.visible');

    // Step 3: Add a second product
    cy.get('[data-testid="product-card"]').eq(1).within(() => {
      cy.contains('Add to Cart').click();
    });

    // Cart badge should show 2
    cy.get('[data-testid="cart-badge"]').should('contain', '2');

    // Step 4: Go to cart
    cy.get('[data-testid="cart-link"]').click();
    cy.url().should('include', '/cart');

    // Should show 2 items
    cy.get('[data-testid="cart-item"]').should('have.length', 2);

    // Step 5: Proceed to checkout
    cy.contains('Proceed to Checkout').click();
    cy.url().should('include', '/checkout');

    // Step 6: Select payment method and place order
    cy.get('input[value="pix"]').check();
    cy.contains('Place Order').click();

    // Step 7: Should see confirmation
    cy.contains('Order confirmed!', { timeout: 10000 }).should('be.visible');
  });
});
