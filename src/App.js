import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta inicial que carga Login */}
                <Route path="/" element={<Login />} />

                {/* Ruta para Login */}
                <Route path="/login" element={<Login />} />

                {/* Ruta protegida para Dashboard */}
                <Route 
                    path="/dashboard" 
                    element={<ProtectedRoute element={Dashboard} />} 
                />
            </Routes>
        </Router>
    );
}

export default App;
