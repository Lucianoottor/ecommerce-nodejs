import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
