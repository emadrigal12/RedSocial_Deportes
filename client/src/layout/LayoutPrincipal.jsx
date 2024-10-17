import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { Outlet } from 'react-router-dom';

const LayoutPrincipal = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
            <Sidebar />
            <main className="md:col-span-2">
              <Outlet />
            </main>
            <NotificationPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutPrincipal;