import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Asegúrate de que la URL de tu backend sea correcta
});

export default api;
