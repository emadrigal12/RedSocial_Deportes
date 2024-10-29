import { createBrowserRouter, Navigate } from 'react-router-dom';
import LayoutPrincipal from '../layout/LayoutPrincipal';
import LoginPage from '../pages/Login/LoginPage';
import RegistroPage from '../pages/Login/RegistroPage';
import Intereses from '../pages/Intereses/Intereses';
import Home from '../pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/registro',
    element: <RegistroPage />
  },
  {
    path: '/home',
    element: <LayoutPrincipal />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: '/intereses',
    element: <Intereses />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);