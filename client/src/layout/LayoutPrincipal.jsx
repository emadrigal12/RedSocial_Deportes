import { useState } from 'react';
import { ListaMensajes } from '../components/Mensajes/ListaMensajes';
import { Navbar } from '../components/Navegacion/Navbar';
import { Sidebar } from '../components/Navegacion/SideBar';
import { Noticias } from '../components/Noticias/Noticias';
import { Outlet } from 'react-router-dom';

const LayoutPrincipal = () => {
  const [followers, setFollowers] = useState([]);

  // Función para agregar seguidores
  const handleFollow = (newFollower) => {
    if (!followers.some((follower) => follower.id === newFollower.id)) {
      setFollowers((prev) => [...prev, newFollower]);
    }
  };

  // Función para eliminar seguidores
  const handleUnfollow = (followerToRemove) => {
    setFollowers((prev) =>
      prev.filter((follower) => follower.id !== followerToRemove.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="shadow-sm" onFollow={handleFollow} />

      <div className="w-full pt-16">
        <div className="bg-white shadow-sm mb-4">
          <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
            <Noticias />
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
              <div className="lg:sticky lg:top-20">
                <Sidebar followers={followers} onUnfollow={handleUnfollow} />
              </div>
            </div>

            <main className="col-span-12 lg:col-span-6 xl:col-span-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <Outlet />
              </div>
            </main>

            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
              <div className="lg:sticky lg:top-20">
                <ListaMensajes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutPrincipal;
