import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Rutas({ children }) {
  const { user, loading, needsRegistration } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('si esta pasando por aca xddddddd');
    
    return <Navigate to="/registro" state={{ from: location }} replace />;
  }

  if (needsRegistration) {
    return <Navigate to="/registro" state={{ from: location }} replace />;
  }

  return children;
}