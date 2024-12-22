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
    const decoded = jwtDecode(token); // Decodificamos el token
    userRole = decoded.role; // Extraemos el rol del usuario
  }

  return (
    <Router>
      <Notification />
      <Routes>
        {/* Ruta inicial, redirige al Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta para Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirigir automáticamente a /menu si el token es válido (Admin o Tecnico) */}
        {userRole && (
          <Route
            path="/"
            element={<Navigate to="/menu" replace />}
          />
        )}

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

        <Route
          path="/mantenimientos"
          element={
            <ProtectedRoute
              element={Mantenimiento}
              allowedRoles={['Admin', 'Tecnico']} // Permitir acceso a Admin y Técnico
            />
          }
        />

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
