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
    setError('');

    try {
      // Enviar credenciales al backend
      const response = await api.post('/auth/login', { username, password });
      const { token, role } = response.data;

      // Guardar token y rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirigir según el rol
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Tecnico') {
        navigate('/activos');
      }
    } catch (err) {
      // Manejar errores
      if (err.response && err.response.status === 401) {
        setError('Credenciales inválidas.');
      } else {
        setError('Error al intentar iniciar sesión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Iniciar sesión
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Login;
