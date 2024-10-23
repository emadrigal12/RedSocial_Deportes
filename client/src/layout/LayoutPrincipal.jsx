import {Navbar} from '../components/Navegacion/Navbar';
import {Sidebar} from '../components/Navegacion/SideBar';
import { Noticias } from '../components/Noticias/Noticias';
import {PanelNotificacion}  from '../components/Notificacion/PanelNotificacion';
import { Outlet } from 'react-router-dom';

const LayoutPrincipal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fijo con sombra sutil */}
      <Navbar className="shadow-sm" />
      
      {/* Contenedor principal con padding responsivo */}
      <div className="w-full pt-16">
        {/* Sección de noticias con fondo blanco y sombra sutil */}
        <div className="bg-white shadow-sm mb-4">
          <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
            <Noticias />
          </div>
        </div>

        {/* Grid principal con padding horizontal responsivo */}
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Sidebar con scroll independiente en desktop */}
            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
              <div className="lg:sticky lg:top-20">
                <Sidebar />
              </div>
            </div>

            {/* Contenido principal */}
            <main className="col-span-12 lg:col-span-6 xl:col-span-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <Outlet />
              </div>
            </main>

            {/* Panel de notificaciones con scroll independiente */}
            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
              <div className="lg:sticky lg:top-20">
                <PanelNotificacion />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default LayoutPrincipal;