import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

function ProtectedRoute({ children, allowAdmin, adminOnly }) {
  const { user } = useContext(UserContext);

  if (user && user.userRole === 'admin') {
    // If admin at not /admin >> /admin
    if (!allowAdmin && !adminOnly) {
      return <Navigate to="/admin" replace />;
    }
    // If no for admin then no
    if (adminOnly && window.location.pathname !== "/admin") {
      return <Navigate to="/admin" replace />;
    }
  }
  return children;
}
export default ProtectedRoute;