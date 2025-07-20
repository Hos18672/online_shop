import { Navigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const AdminRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) return <Navigate to="/auth" />;
  if (!user?.publicMetadata?.role || user.publicMetadata.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

export default AdminRoute;