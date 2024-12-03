import React, { useState } from 'react';
import api from '../api/api';  // Correcta desde components/Login.js
 // Asegúrate de que api.js esté correctamente importado
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Para redirigir después de login exitoso

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Limpiar errores previos

    try {
      // Hacer la solicitud POST al backend para obtener el token
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Redirigir al Dashboard
      navigate('/dashboard');  // Redirige a la página /dashboard
    } catch (err) {
      setError('Credenciales inválidas');  // Mostrar error si no es exitoso
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado de email
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Actualizar el estado de contraseña
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      {error && <p>{error}</p>}  {/* Mostrar mensaje de error si existe */}
    </div>
  );
};

export default Login;
