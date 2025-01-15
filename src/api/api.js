import axios from 'axios';

// Crear una instancia de axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambiar si el backend está en otro lugar
});

// Agregar token de autorización a todas las solicitudes (si está disponible)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
