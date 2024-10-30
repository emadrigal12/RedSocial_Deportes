import React from 'react';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { router } from './routes/Index'; // Asegúrate de que la ruta sea correcta
import Home from './pages/Home';
import LoginPage from './pages/Login/LoginPage';
import Intereses from './pages/Intereses/Intereses';
import RegistroPage from './pages/Login/RegistroPage';
import LayoutPrincipal from './layout/LayoutPrincipal';

function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route exact path="/" element={<LoginPage/>}/>
          <Route exact path="/registro" element={<RegistroPage/>}/>
          <Route exact path="/intereses" element={<Intereses/>}/>
          <Route path="/home" element={<LayoutPrincipal />}>
            <Route index element={<Home />} /> 
          </Route>
          <Route path="*" element={<LoginPage/>}/>
        </Routes>
    </AuthProvider>
  );
}

export default App;
