import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api/api';

const ModalContainer = styled.div`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 50%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  position: relative;
  padding-bottom: 20px; /* Espacio extra para el botón Guardar */
`;

const Header = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  &:hover {
    color: #e0e0e0;
  }
`;

const Section = styled.div`
  margin-bottom: 15px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
`;

const ScrollableTableContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f8f9fa;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
`;

const TableHead = styled.thead`
  background-color: #007bff;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #e9ecef;
    cursor: pointer;
  }
`;

const TableHeader = styled.th`
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const TableData = styled.td`
  padding: 8px 10px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  text-align: center;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto; /* Centrado */

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
  font-size: 14px;
  resize: none;
  height: 100px; /* Aumenta el tamaño vertical */
  width: 96.5%; /* Ajusta el tamaño horizontal */
`;

const EspecificacionesModal = ({ isOpen, onClose, activo }) => {
  const [actividades, setActividades] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState([]);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (!activo || !activo.tipo_activo_id) {
      console.error('El activo o su tipo_activo_id no están definidos.');
      return;
    }
    fetchActividadesYComponentes();
  }, [activo]);

  const fetchActividadesYComponentes = async () => {
    try {
      const actividadesResponse = await api.get(
        `/especificaciones/actividades?tipo_activo_id=${activo.tipo_activo_id}`
      );
      const componentesResponse = await api.get(
        `/especificaciones/componentes?tipo_activo_id=${activo.tipo_activo_id}`
      );
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
      await Promise.all(
        actividadesSeleccionadas.map((actividad) =>
          api.post('/api/mantenimiento_actividades', {
            mantenimiento_activo_id: activo.id,
            actividad_id: actividad.id,
            descripcion: actividad.descripcion || '',
          })
        )
      );

      await Promise.all(
        componentesSeleccionados.map((componente) =>
          api.post('/api/mantenimiento_componentes', {
            mantenimiento_activo_id: activo.id,
            componente_id: componente.id,
            cantidad: 1,
          })
        )
      );

      if (observaciones.trim()) {
        await api.post('/api/mantenimiento_observaciones', {
          mantenimiento_activo_id: activo.id,
          observacion: observaciones,
        });
      }

      onClose();
      alert('Especificaciones guardadas correctamente.');
    } catch (error) {
      console.error('Error al guardar especificaciones:', error);
    }
  };

  return (
    <ModalContainer $isOpen={isOpen}>
      <ModalContent>
        <Header>
          <span>Especificaciones para {activo?.nombre}</span>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Section>
          <SectionTitle>Actividades</SectionTitle>
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Actividad</TableHeader>
                  <TableHeader>Acción</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {actividades.map((actividad) => (
                  <TableRow key={actividad.id}>
                    <TableData>{actividad.nombre}</TableData>
                    <TableData>
                      <Button onClick={() => agregarActividad(actividad)}>Agregar</Button>
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollableTableContainer>

          <SectionTitle>Seleccionadas:</SectionTitle>
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Actividad</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {actividadesSeleccionadas.map((actividad) => (
                  <TableRow key={actividad.id}>
                    <TableData>{actividad.nombre}</TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollableTableContainer>
        </Section>

        <Section>
          <SectionTitle>Componentes</SectionTitle>
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Componente</TableHeader>
                  <TableHeader>Acción</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {componentes.map((componente) => (
                  <TableRow key={componente.id}>
                    <TableData>{componente.nombre}</TableData>
                    <TableData>
                      <Button onClick={() => agregarComponente(componente)}>Agregar</Button>
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollableTableContainer>

          <SectionTitle>Seleccionados:</SectionTitle>
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Componente</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {componentesSeleccionados.map((componente) => (
                  <TableRow key={componente.id}>
                    <TableData>{componente.nombre}</TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollableTableContainer>
        </Section>

        <Section>
          <SectionTitle>Observaciones</SectionTitle>
          <Input
            placeholder="Escriba aquí las observaciones..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Section>

        <Button onClick={handleGuardar}>Guardar</Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default EspecificacionesModal;
