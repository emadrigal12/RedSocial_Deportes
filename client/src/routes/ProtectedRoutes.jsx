import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente para rutas protegidas
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Mientras está cargando, puedes mostrar un spinner o loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, permite acceder a la ruta
  return <Outlet />;
};

// Componente para rutas públicas (solo accesibles si NO estás autenticado)
export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Si hay usuario, redirige al dashboard o home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};