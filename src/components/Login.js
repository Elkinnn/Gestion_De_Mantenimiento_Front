import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey } from 'react-icons/fa'; // Importar los íconos
import api from '../api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Datos de la respuesta:', response.data); // Verifica lo que el servidor te está enviando
      const { token, role, userName } = response.data;

      // Guardar token, rol y nombre en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', userName); // Guardar el nombre del usuario

      // Redirigir dependiendo del rol
      if (role === 'Admin' || role === 'Tecnico') {
        navigate('/menu'); // Redirige tanto a Admin como a Tecnico al menú
      } else {
        setError('Rol desconocido. Contacta al administrador.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Usuario o Contraseña incorrectos');
      } else {
        setError('Error al intentar iniciar sesión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Asegura que ocupe toda la altura de la pantalla
        backgroundColor: '#f4f4f4', // Color de fondo
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          backgroundColor: '#ffffff', // Fondo blanco
          border: '2px solid black', // Borde negro
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: 'bold', fontSize: '24px' }}>
          Iniciar Sesión
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUser style={{ fontSize: '20px', color: '#333' }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              required
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff', // Fondo blanco para el input
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaKey style={{ fontSize: '20px', color: '#333' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff', // Fondo blanco para el input
                fontSize: '16px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Ingresar
          </button>
        </form>
        {error && (
          <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
