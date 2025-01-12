import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90vw; /* 🔹 Ajuste dinámico del ancho */
  width: 800px;
  max-height: 80vh; /* 🔹 Evita que el modal sea más grande que la pantalla */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 80px; /* 🔹 Baja un poco más el modal */
`;


const ModalHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;

  &:hover {
    color: #ddd;
  }
`;

const TableWrapper = styled.div`
  flex-grow: 1; /* 🔹 Permite que la tabla ocupe el espacio restante */
  overflow-y: auto;
  max-height: 50vh; /* 🔹 Evita que la tabla sea demasiado grande */
  padding: 0 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  text-transform: uppercase;
  border: 1px solid #ddd;
  text-align: center;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.$isEven ? '#f9f9f9' : '#fff')};
  &:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  text-align: center;
`;

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: nowrap; /* 🔹 Evita que los filtros y el botón bajen */
  align-items: center; /* 🔹 Alinea los elementos en una sola línea */
  justify-content: flex-start; /* 🔹 Asegura que todos estén alineados a la izquierda */
  gap: 12px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputFilter = styled.input`
  flex: 1; /* 🔹 Distribuye el espacio equitativamente */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  transition: 0.3s ease-in-out;
  background-color: #fff;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const SelectFilter = styled.select`
  flex: 1; /* 🔹 Hace que los select ocupen el mismo ancho */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  background-color: #fff;

  &:hover {
    border-color: #007bff;
  }
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const ClearButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-left: auto; /* 🔹 Mueve el botón a la derecha */

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const Modal = ({ isOpen, onClose, onAgregarActivo, activos }) => {
  console.log('Activos disponibles en el modal:', activos);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const handleClearFilters = () => {
    setFiltroNombre('');
    setFiltroTipo('');
    setFiltroEstado('');
  };

  if (!isOpen) return null;

  const handleRowClick = (activo) => {
    console.log('Activo seleccionado en el modal:', activo);
    setActivoSeleccionado(activo);
  };

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalHeader>
          Lista de Activos
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {/* 🔹 Filtros agregados antes de la tabla */}
        <FilterContainer>
          <InputFilter
            type="text"
            placeholder="Buscar por Serie"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <SelectFilter
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Filtrar por Tipo</option>
            {Array.from(new Set(activos.map((activo) => activo.tipo))).map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </SelectFilter>
          <SelectFilter
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Filtrar por Estado</option>
            {Array.from(new Set(activos.map((activo) => activo.estado))).map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </SelectFilter>

          <ClearButton onClick={handleClearFilters}>Limpiar</ClearButton>


        </FilterContainer>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Código</TableHeader>
                <TableHeader>Serie</TableHeader>
                <TableHeader>Tipo</TableHeader>
                <TableHeader>Estado</TableHeader> {/* 🔹 Nueva columna Estado */}
              </tr>
            </thead>
            <tbody>
              {activos.length > 0 ? (
                activos
                  .filter((activo) =>          
                    (filtroNombre === '' || activo.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) &&
                    (filtroTipo === '' || activo.tipo === filtroTipo) &&
                    (filtroEstado === '' || activo.estado === filtroEstado)
                  )
                  .map((activo, index, filtrados) =>
                    filtrados.length > 0 ? (
                      <TableRow
                        key={activo.codigo}
                        $isEven={index % 2 === 0}
                        onClick={() => handleRowClick(activo)}
                        style={{
                          backgroundColor:
                            activoSeleccionado?.codigo === activo.codigo ? '#cce5ff' : undefined,
                        }}
                      >
                        <TableData>{activo.codigo}</TableData>
                        <TableData>{activo.nombre}</TableData>
                        <TableData>{activo.tipo}</TableData>
                        <TableData>{activo.estado || 'Desconocido'}</TableData>
                      </TableRow>
                    ) : null
                  )
              ) : (
                <tr>
                  <TableData colSpan="4">No hay activos disponibles.</TableData>
                </tr>
              )}

              {/* 🔹 Si la búsqueda con filtros no encuentra resultados */}
              {activos.length > 0 &&
                activos.filter((activo) =>
                  (filtroNombre === '' || activo.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) &&
                  (filtroTipo === '' || activo.tipo === filtroTipo) &&
                  (filtroEstado === '' || activo.estado === filtroEstado)
                ).length === 0 && (
                  <tr>
                    <TableData colSpan="4" style={{ textAlign: 'center', color: '#555', fontSize: '15px' }}>
                      No se encontraron resultados con los filtros aplicados.
                    </TableData>
                  </tr>
                )}
            </tbody>

          </Table>
        </TableWrapper>

        <AddButtonWrapper>
          <Button
            onClick={() => {
              console.log('Activo seleccionado para agregar:', activoSeleccionado);
              if (activoSeleccionado) onAgregarActivo(activoSeleccionado);
            }}
            disabled={!activoSeleccionado}
          >
            Agregar Activo
          </Button>
        </AddButtonWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;