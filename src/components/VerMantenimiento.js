import React from 'react';
import { useLocation } from 'react-router-dom';

const VerMantenimiento = () => {
  const location = useLocation();
  const mantenimiento = location.state; // Recibe los datos enviados por navigate

  console.log('Datos recibidos en VerMantenimiento:', mantenimiento); // Verifica los datos

  return (
    <div>
      <h1>Detalle del Mantenimiento</h1>
      {mantenimiento ? (
        <div>
          <p><strong>ID:</strong> {mantenimiento.mantenimiento_id || 'No disponible'}</p>
          <p><strong>Número de Mantenimiento:</strong> {mantenimiento.numero_mantenimiento || 'No disponible'}</p>
          <p><strong>Técnico:</strong> {mantenimiento.tecnico || 'No disponible'}</p>
          <p><strong>Estado:</strong> {mantenimiento.estado || 'No disponible'}</p>
          <p><strong>Fecha Inicio:</strong> {mantenimiento.fecha_inicio ? new Date(mantenimiento.fecha_inicio).toLocaleString() : 'No disponible'}</p>
          <p><strong>Fecha Fin:</strong> {mantenimiento.fecha_fin ? new Date(mantenimiento.fecha_fin).toLocaleString() : 'No disponible'}</p>
          <p><strong>Proveedor:</strong> {mantenimiento.proveedor || 'No disponible'}</p>
          <p><strong>Número de Activos:</strong> {mantenimiento.numero_activos || 'No disponible'}</p>
        </div>
      ) : (
        <p>No se seleccionó ningún mantenimiento.</p>
      )}
    </div>
  );
};

export default VerMantenimiento;
