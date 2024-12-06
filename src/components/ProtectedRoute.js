import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente para proteger rutas con validación de roles
const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const token = localStorage.getItem('token'); // Verifica si hay un token
  const role = localStorage.getItem('role'); // Obtiene el rol del usuario

  // Si no hay token, redirige a la página de inicio de sesión
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el rol del usuario no está permitido, muestra un mensaje de acceso denegado
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <h1 style={{ textAlign: 'center', color: 'red' }}>Acceso Denegado</h1>;
  }

  // Si todo está en orden, renderiza el componente
  return <Component />;
};

export default ProtectedRoute;
