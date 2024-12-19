import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes/Index'; 
import Home from './pages/Home';
import LoginPage from './pages/Login/LoginPage';
import Intereses from './pages/Intereses/Intereses';
import RegistroPage from './pages/Login/RegistroPage';
import RecuperarContrasena from './pages/Login/RecuperarContrasena';
import LayoutPrincipal from './layout/LayoutPrincipal';
import Comunidad from './pages/Comunidad/Comunidad';
import Error404 from './pages/Error404';
import ComunidadDetalle from './pages/Comunidad/ComunidadDetalle';
import PanelAdministrativo from './pages/PanelAdmin/PanelAdministrativo';
import { Toaster } from "@/components/ui/toaster"
import UserProfile from './pages/Usuario/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
          <Route exact path="/" element={<LoginPage/>}/>
          <Route exact path="/registro" element={<RegistroPage/>}/>
          <Route exact path="/recuperar" element={<RecuperarContrasena/>}/>
          <Route exact path="/intereses" element={<Intereses/>}/>
          <Route exact path="/comunidades" element={<Comunidad/>}/>
          <Route path="/comunidad/:id" element={<ComunidadDetalle />} />
          <Route path="/panelAdmin" element={<PanelAdministrativo />} />
          <Route path="/perfil/usuario/:userId" element={<UserProfile />} />
          <Route path="/home" element={<LayoutPrincipal />}>
            <Route index element={<Home />} /> 
          </Route>
          <Route path="*" element={<Error404/>}/>
        </Routes>
    </AuthProvider>
  );
}

export default App;
