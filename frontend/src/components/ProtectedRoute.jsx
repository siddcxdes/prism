import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
