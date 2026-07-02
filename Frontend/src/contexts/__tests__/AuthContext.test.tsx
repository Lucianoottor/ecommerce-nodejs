import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, AuthContext } from '../AuthContext';
import { vi } from 'vitest';

// Mock the api module
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import api from '../../services/api';

function TestConsumer() {
  return (
    <AuthContext.Consumer>
      {(value) =>
        value ? (
          <div>
            <span data-testid="authenticated">{String(value.isAuthenticated)}</span>
            <span data-testid="admin">{String(value.isAdmin)}</span>
            <span data-testid="email">{value.user?.email || 'none'}</span>
            <button onClick={() => value.login('test@test.com', 'pass')}>Login</button>
            <button onClick={value.logout}>Logout</button>
          </div>
        ) : null
      }
    </AuthContext.Consumer>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('AuthContext', () => {
  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('email')).toHaveTextContent('none');
  });

  it('logs in and sets user data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      role: 'user',
      Token: 'fake-token-123',
    };

    vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockUser } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('email')).toHaveTextContent('test@test.com');
    expect(localStorage.getItem('token')).toBe('fake-token-123');
  });

  it('logs out and clears data', async () => {
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'a@b.com', role: 'user' }));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores user from localStorage', () => {
    const user = { id: 1, email: 'saved@test.com', role: 'admin' };
    localStorage.setItem('token', 'saved-token');
    localStorage.setItem('user', JSON.stringify(user));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('admin')).toHaveTextContent('true');
    expect(screen.getByTestId('email')).toHaveTextContent('saved@test.com');
  });
});
