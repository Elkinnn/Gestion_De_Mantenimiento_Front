import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importamos React Router
import Login from './components/Login';  // Importamos el componente Login
import Dashboard from './components/Dashboard';  // Componente donde el usuario será redirigido

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />  {/* Ruta para el Login */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Ruta para el Dashboard */}
        <Route path="/" element={<h2>Bienvenido a la Gestión de Activos</h2>} />  {/* Página principal */}
      </Routes>
    </Router>
  );
};

export default App;
