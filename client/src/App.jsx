import React from 'react';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { router } from './routes/Index'; // Asegúrate de que la ruta sea correcta
import Home from './pages/Home';
import LoginPage from './pages/Login/LoginPage';
import Intereses from './pages/Intereses/Intereses';
import RegistroPage from './pages/Login/RegistroPage';
import LayoutPrincipal from './layout/LayoutPrincipal';
import Comunidad from './pages/Comunidad/Comunidad';
import Error404 from './pages/Error404';
import ComunidadDetalle from './pages/Comunidad/ComunidadDetalle';
import EventoCard from './components/Evento/EventoCard';
import CrearEvento from './components/Evento/CrearEvento';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
          <Route exact path="/" element={<LoginPage/>}/>
          <Route exact path="/registro" element={<RegistroPage/>}/>
          <Route exact path="/intereses" element={<Intereses/>}/>
          <Route exact path="/comunidades" element={<Comunidad/>}/>
          <Route path="/comunidad/:id" element={<ComunidadDetalle />} />

          <Route path="/home" element={<LayoutPrincipal />}>
            <Route index element={<Home />} /> 
          </Route>
          <Route path="*" element={<Error404/>}/>
        </Routes>
    </AuthProvider>
  );
}

export default App;
