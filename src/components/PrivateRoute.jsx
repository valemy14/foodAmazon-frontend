// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode token to get user roles
  try {
    const decoded = jwtDecode(token);
    
    // Check role if required
    if (requiredRole) {
      if (requiredRole === 'admin' && !decoded.isAdmin) {
        return <Navigate to="/" />;
      }
      if (requiredRole === 'distributor' && !decoded.isDistributor) {
        return <Navigate to="/" />;
      }
      if (requiredRole === 'superAdmin' && !decoded.isSuperAdmin) {
        return <Navigate to="/" />;
      }
    }
    
    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;