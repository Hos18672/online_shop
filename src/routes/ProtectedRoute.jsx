import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Navigate to="/auth" />;
  return children;
};

export default ProtectedRoute;