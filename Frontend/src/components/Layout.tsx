import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/products" className="text-xl font-semibold text-gray-900 tracking-tight">
              Store
            </Link>

            <nav className="flex items-center gap-6">
              <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart" data-testid="cart-link" className="relative text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Cart
                    {itemCount > 0 && (
                      <span data-testid="cart-badge" className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Admin
                    </Link>
                  )}

                  <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          Store — E-commerce Demo
        </div>
      </footer>
    </div>
  );
}
