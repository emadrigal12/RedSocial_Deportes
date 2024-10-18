import {Navbar} from '../components/Navegacion/Navbar';
import {Sidebar} from '../components/Navegacion/SideBar';
import {PanelNotificacion}  from '../components/Notificacion/PanelNotificacion';
import { Outlet } from 'react-router-dom';

const LayoutPrincipal = () => {
  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Navbar />
      <div className="pt-20 pb-6 sm:pb-8">
        <div className="max-w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mt-2">
            <div className="md:col-span-3">
              <Sidebar />
            </div>
            <main className="md:col-span-6">
              <Outlet />
            </main>
            <div className="md:col-span-3">
              <PanelNotificacion />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LayoutPrincipal;