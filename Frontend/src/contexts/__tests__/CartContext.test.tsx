import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';
import type { Product } from '../../types';

const mockProduct: Product = {
  productId: 1,
  name: 'Test Product',
  description: null,
  price: '99.99',
  stock: 10,
  imageUrl: null,
  createdAt: '',
  updatedAt: '',
};

const mockProduct2: Product = {
  productId: 2,
  name: 'Another Product',
  description: null,
  price: '50.00',
  stock: 5,
  imageUrl: null,
  createdAt: '',
  updatedAt: '',
};

const mockAuthValue = {
  user: { id: 1, email: 'test@test.com', role: 'user' as const, birthDate: null, createdAt: '', updatedAt: '' },
  token: 'fake-token',
  isAuthenticated: true,
  isAdmin: false,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

function TestConsumer() {
  return (
    <CartContext.Consumer>
      {(value) =>
        value ? (
          <div>
            <span data-testid="count">{value.itemCount}</span>
            <span data-testid="total">{value.total}</span>
            <span data-testid="items">{value.items.map((i) => i.product.name).join(',')}</span>
            <button onClick={() => value.addItem(mockProduct)}>Add</button>
            <button onClick={() => value.addItem(mockProduct2, 2)}>Add2</button>
            <button onClick={() => value.removeItem(1)}>Remove</button>
            <button onClick={() => value.updateQuantity(1, 5)}>Update</button>
            <button onClick={value.clearCart}>Clear</button>
          </div>
        ) : null
      }
    </CartContext.Consumer>
  );
}

function renderWithProviders() {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    </AuthContext.Provider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('starts with empty cart', () => {
    renderWithProviders();

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  it('adds item to cart', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('99.99');
  });

  it('increments quantity for existing item', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Add'));

    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('removes item from cart', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Remove'));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('updates item quantity', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Update'));

    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('clears all items', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Add2'));
    await userEvent.click(screen.getByText('Clear'));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('items')).toHaveTextContent('');
  });

  it('calculates total correctly with multiple items', async () => {
    renderWithProviders();

    await userEvent.click(screen.getByText('Add'));   // 1x 99.99
    await userEvent.click(screen.getByText('Add2'));  // 2x 50.00

    expect(screen.getByTestId('count')).toHaveTextContent('3');
    expect(screen.getByTestId('total')).toHaveTextContent('199.99');
  });
});
