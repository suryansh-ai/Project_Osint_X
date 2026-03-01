/**
 * Protected Route Component
 * Restricts access based on authentication and user roles
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { LoadingOverlay } from '../components/common/Loading';

export const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const { role } = useRole();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return <LoadingOverlay message="Verifying access..." />;
  }

  // Redirect to login if authentication required but user not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role } = useRole();

  if (loading) {
    return <LoadingOverlay message="Loading..." />;
  }

  // Redirect authenticated users to their dashboard
  if (user && role) {
    const dashboardPaths = {
      student: '/student/field-interface',
      user: '/user/investigation',
    };
    return <Navigate to={dashboardPaths[role] || '/'} replace />;
  }

  return children;
};

export const RoleRoute = ({ children, role: requiredRole }) => {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={[requiredRole]}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
