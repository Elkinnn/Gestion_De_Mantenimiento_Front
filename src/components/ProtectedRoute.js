import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Importación correcta

// Componente para proteger rutas con validación de roles
const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const [expired, setExpired] = useState(false); // Estado para manejar la expiración
  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token); // Decodificamos el token
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos

      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        console.log('Token expirado, redirigiendo al login...');
        localStorage.removeItem('token');  // Eliminar el token expirado
        localStorage.removeItem('role');   // Eliminar el rol también
        setExpired(true); // Cambiar el estado para indicar que el token ha expirado
      }
    }
  }, [token]);  // Dependencia del token, se ejecutará cada vez que el token cambie

  // Si el token está expirado o no hay token, redirige al login
  if (expired || !token) {
    return <Navigate to="/login" />;
  }

  try {
    // Decodificar el token para obtener el rol y otros datos
    const decoded = jwtDecode(token);  // Usamos jwtDecode correctamente
    const role = decoded.role;  // Obtener el rol del usuario desde el token decodificado

    // Si el rol del usuario no está permitido, muestra un mensaje de acceso denegado
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <h1 style={{ textAlign: 'center', color: 'red' }}>Acceso Denegado</h1>;
    }

    // Si todo está en orden, renderiza el componente
    return <Component />;
  } catch (err) {
    // Si el token es inválido o ha expirado, redirige al login
    console.error('Error en la decodificación del token', err);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
