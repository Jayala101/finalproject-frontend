import { RouteObject } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Private Routes (admin & authenticated users)
export const privateRoutes: RouteObject = {
  path: '/admin',
  element: <PrivateRoute requireAdmin={true} />,
  children: [
    {
      index: true,
      element: <div>Admin Dashboard</div>
    },
    {
      path: 'products',
      element: <div>Product Management</div>
    }
  ],
};

// User Routes (authenticated users only, not necessarily admin)
export const userRoutes: RouteObject = {
  path: '/account',
  element: <PrivateRoute />,
  children: [
    {
      index: true,
      element: <div>User Account Dashboard</div>
    }
  ],
};
