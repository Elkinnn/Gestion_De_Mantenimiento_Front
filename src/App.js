import jwt_decode from 'jwt-decode';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MenuActivos from './components/MenuActivos';
import Mantenimiento from './components/Mantenimiento';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial redirige al Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta para Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para Dashboard (solo Administradores) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute 
              element={Dashboard} 
              allowedRoles={['Admin']} 
            />
          }
        />

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

        {/* Ruta protegida para el mantenimiento (solo técnicos) */}
        <Route
          path="/mantenimiento"
          element={
            <ProtectedRoute 
              element={Mantenimiento} 
              allowedRoles={['Tecnico']} 
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
