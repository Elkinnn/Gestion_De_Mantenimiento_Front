import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute ahora simplemente redirige o permite el componente
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');  // Verificar si hay un token JWT en localStorage

  // Si el token existe, renderiza el componente, sino redirige al login
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
