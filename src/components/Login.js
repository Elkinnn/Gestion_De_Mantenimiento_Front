import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // Enviar credenciales al backend
      const response = await api.post('/auth/login', { username, password });
      const { token, role } = response.data;

      // Guardar token y rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirigir según el rol del usuario
      if (role === 'Admin') {
        navigate('/dashboard'); // Ruta para administradores
      } else if (role === 'Tecnico') {
        navigate('/menu'); // Ruta para técnicos (menú de activos)
      } else {
        setError('Rol desconocido. Contacta al administrador.');
      }
    } catch (err) {
      // Manejar errores según el estado de la respuesta
      if (err.response && err.response.status === 401) {
        setError('Credenciales inválidas.');
      } else {
        setError('Error al intentar iniciar sesión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Iniciar sesión</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Iniciar sesión
        </button>
      </form>
      {error && (
        <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>
      )}
    </div>
  );
};

export default Login;
