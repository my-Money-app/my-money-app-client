import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import RegisterView from 'src/sections/login/register-view';

export const IndexPage = lazy(() => import('src/pages/app'));
export const OutcomeDetails = lazy(() => import('src/sections/user/outcomeDetails'));

export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const isAuthenticated = () => {
    // Check if token exists in local storage synchronously
    const token = localStorage.getItem('token');
    // Return true if token exists, indicating the user is logged in
    return token !== null;
  };
  const routes = useRoutes([
    {
      element: isAuthenticated() ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <LoginPage />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'outcomes', element: <UserPage /> },
        { path: 'outcome-details/*', element: <OutcomeDetails /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'Register',
      element: <RegisterView />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
