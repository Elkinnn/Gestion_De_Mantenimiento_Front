import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const Mantenimiento = () => {
  const { id } = useParams();  // Obtener el id del activo desde la URL
  const [activo, setActivo] = useState(null);
  const [estadoMantenimiento, setEstadoMantenimiento] = useState('');
  const navigate = useNavigate();

  // Cargar los detalles del activo cuando se monta el componente
  useEffect(() => {
    const fetchActivoDetails = async () => {
      try {
        const response = await api.get(`/activos/${id}`);
        setActivo(response.data);
      } catch (err) {
        console.error('Error al cargar el activo:', err);
      }
    };

    fetchActivoDetails();
  }, [id]);

  const handleMantenimientoSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí podrías enviar los datos del mantenimiento al backend
      const response = await api.post(`/activos/mantenimiento`, {
        id,
        estadoMantenimiento,
      });
      console.log(response.data);
      navigate('/menu');  // Redirigir al menú de activos después de completar el mantenimiento
    } catch (err) {
      console.error('Error al registrar el mantenimiento:', err);
    }
  };

  if (!activo) {
    return <p>Cargando detalles del activo...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mantenimiento del Activo</h2>
      <h3>{activo.nombre}</h3>
      <form onSubmit={handleMantenimientoSubmit}>
        <div>
          <label>Estado del Mantenimiento</label>
          <input
            type="text"
            value={estadoMantenimiento}
            onChange={(e) => setEstadoMantenimiento(e.target.value)}
            placeholder="Escribe el estado del mantenimiento"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
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
          }}
        >
          Registrar Mantenimiento
        </button>
      </form>
    </div>
  );
};

export default Mantenimiento;
