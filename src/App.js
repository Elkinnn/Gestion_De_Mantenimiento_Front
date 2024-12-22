import { jwtDecode } from 'jwt-decode';  // Cambié el nombre de la importación
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MenuActivos from './components/MenuActivos';
import Mantenimiento from './components/Mantenimiento';
import ProtectedRoute from './components/ProtectedRoute';
import GestionActivo from './components/GestionActivos';
import CrearActivos from './components/CrearActivos';
import EditarActivos from './components/EditarActivos';
import Notification from './components/Notification';

function App() {
  const token = localStorage.getItem('token'); // Obtener el token de localStorage si está presente

  // Si el token existe, decodificamos para obtener el rol y redirigir según corresponda
  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token); // Decodificamos el token
      userRole = decoded.role; // Extraemos el rol del usuario
    } catch (err) {
      console.error('Error al decodificar el token:', err);
    }
  }

  return (
    <Router>
      <Notification />
      <Routes>
        {/* Ruta inicial, redirige al componente de Mantenimiento o Login */}
        <Route
          path="/"
          element={userRole ? <Navigate to="/mantenimientos" replace /> : <Login />}
        />

        {/* Ruta para Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para el menú de activos (técnicos y administradores) */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute
              element={MenuActivos}
              allowedRoles={['Admin', 'Tecnico']}
            />
          }
        />

        {/* Ruta protegida para el componente de Mantenimientos */}
        <Route
          path="/mantenimientos"
          element={
            <ProtectedRoute
              element={Mantenimiento}
              allowedRoles={['Admin', 'Tecnico']}
            />
          }
        />

        {/* Ruta protegida para gestionar activos */}
        <Route
          path="/crear"
          element={
            <ProtectedRoute
              element={GestionActivo}
              allowedRoles={['Admin']}
            />
          }
        />
        <Route
          path="/activos/crear"
          element={
            <ProtectedRoute
              element={CrearActivos}
              allowedRoles={['Admin']}
            />
          }
        />
        <Route
          path="/editar/:id"
          element={
            <ProtectedRoute
              element={EditarActivos}
              allowedRoles={['Admin']}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
