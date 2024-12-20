import React, { useState } from 'react';
import { useFollow } from './context/FollowContext'; // Importar el contexto de "Follow"
import { Navbar } from './components/Navegacion/Navbar';

const FollowersAndFollowing = () => {
    const { following, followers, unfollowUser } = useFollow(); // Añadir `unfollowUser` al contexto
    const [activeTab, setActiveTab] = useState('following'); // Estado para controlar la tab activa
  
    return (
      <div>
        {/* Header / Navbar */}
        <Navbar />
  
        {/* Contenedor principal */}
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <button
              className={`px-4 py-2 text-lg font-semibold ${
                activeTab === 'following' ? 'text-white bg-orange-500' : 'text-orange-500 bg-white'
              } border border-orange-500 rounded-l-lg`}
              onClick={() => setActiveTab('following')}
            >
              Seguidos
            </button>
            <button
              className={`px-4 py-2 text-lg font-semibold ${
                activeTab === 'followers' ? 'text-white bg-orange-500' : 'text-orange-500 bg-white'
              } border border-orange-500 rounded-r-lg`}
              onClick={() => setActiveTab('followers')}
            >
              Seguidores
            </button>
          </div>
  
          {/* Contenido de la lista */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'following' && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usuarios que sigues</h2>
                {following.length > 0 ? (
                  <ul className="space-y-4">
                    {following.map((user) => (
                      <li
                        key={user.id}
                        className="flex justify-between items-center border rounded-lg py-2 px-4 shadow-md"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{user.nombre}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <button
                          onClick={() => unfollowUser(user)} // Llama a la función para eliminar
                          className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aún no sigues a nadie.</p>
                )}
              </div>
            )}
  
            {activeTab === 'followers' && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tus seguidores</h2>
                {followers.length > 0 ? (
                  <ul className="space-y-4">
                    {followers.map((user) => (
                      <li
                        key={user.id}
                        className="border rounded-lg py-2 px-4 text-left shadow-md"
                      >
                        <p className="font-medium text-gray-800">{user.nombre}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aún no tienes seguidores.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default FollowersAndFollowing;