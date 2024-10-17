import { createBrowserRouter } from 'react-router-dom';
import LayoutPrincipal from '../layout/LayoutPrincipal';
import Home from '../pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPrincipal />,
    children: [
      {
        index: true,
        element: <Home />
      },
      
    ]
  }
]);