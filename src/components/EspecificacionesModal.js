import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api/api';

const ModalContainer = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
`;

const Title = styled.h2`
  text-align: center;
`;

const ListContainer = styled.div`
  margin: 20px 0;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 10px;
`;

const EspecificacionesModal = ({ isOpen, onClose, activo }) => {
  const [actividades, setActividades] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState([]);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (activo) {
      fetchActividadesYComponentes();
    }
  }, [activo]);

  const fetchActividadesYComponentes = async () => {
    try {
      const actividadesResponse = await api.get(`/actividades?tipo_activo_id=${activo.tipo_activo_id}`);
      const componentesResponse = await api.get(`/componentes?tipo_activo_id=${activo.tipo_activo_id}`);
      setActividades(actividadesResponse.data);
      setComponentes(componentesResponse.data);
    } catch (error) {
      console.error('Error al cargar actividades o componentes:', error);
    }
  };

  const agregarActividad = (actividad) => {
    if (!actividadesSeleccionadas.find((a) => a.id === actividad.id)) {
      setActividadesSeleccionadas([...actividadesSeleccionadas, actividad]);
    }
  };

  const agregarComponente = (componente) => {
    if (!componentesSeleccionados.find((c) => c.id === componente.id)) {
      setComponentesSeleccionados([...componentesSeleccionados, componente]);
    }
  };

  const handleGuardar = async () => {
    try {
      // Guardar las actividades seleccionadas
      await Promise.all(
        actividadesSeleccionadas.map((actividad) =>
          api.post('/mantenimiento_actividades', {
            mantenimiento_activo_id: activo.id,
            actividad_id: actividad.id,
            descripcion: actividad.descripcion || '',
          })
        )
      );

      // Guardar los componentes seleccionados
      await Promise.all(
        componentesSeleccionados.map((componente) =>
          api.post('/mantenimiento_componentes', {
            mantenimiento_activo_id: activo.id,
            componente_id: componente.id,
            cantidad: 1, // Por defecto, cantidad es 1
          })
        )
      );

      // Guardar las observaciones
      if (observaciones.trim()) {
        await api.post('/mantenimiento_observaciones', {
          mantenimiento_activo_id: activo.id,
          observacion: observaciones,
        });
      }

      onClose(); // Cerrar el modal
      alert('Especificaciones guardadas correctamente.');
    } catch (error) {
      console.error('Error al guardar especificaciones:', error);
    }
  };

  return (
    <ModalContainer isOpen={isOpen}>
      <ModalContent>
        <Title>Especificaciones para {activo?.nombre}</Title>
        <ListContainer>
          <h3>Actividades</h3>
          {actividades.map((actividad) => (
            <ListItem key={actividad.id}>
              <span>{actividad.nombre}</span>
              <Button onClick={() => agregarActividad(actividad)}>Agregar</Button>
            </ListItem>
          ))}
        </ListContainer>
        <ListContainer>
          <h3>Componentes</h3>
          {componentes.map((componente) => (
            <ListItem key={componente.id}>
              <span>{componente.nombre}</span>
              <Button onClick={() => agregarComponente(componente)}>Agregar</Button>
            </ListItem>
          ))}
        </ListContainer>
        <h3>Observaciones</h3>
        <Input
          placeholder="Escriba aquí las observaciones..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleGuardar}>Guardar</Button>
        </div>
      </ModalContent>
    </ModalContainer>
  );
};

export default EspecificacionesModal;
