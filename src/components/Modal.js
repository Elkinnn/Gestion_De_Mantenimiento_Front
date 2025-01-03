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
  max-width: 800px;
  width: 90%;
  position: relative;
  overflow: hidden;
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
  margin-top: 20px;
  overflow-y: auto;
  max-height: calc(50px * 7); /* Approx height for 7 rows including padding */
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

const Modal = ({ isOpen, onClose, onAgregarActivo, activos }) => {
  console.log('Activos disponibles en el modal:', activos);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);

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
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Código</TableHeader>
                <TableHeader>Serie</TableHeader>
                <TableHeader>Tipo</TableHeader>
              </tr>
            </thead>
            <tbody>
              {activos.length > 0 ? (
                activos.map((activo, index) => (
                  <TableRow
                    key={activo.codigo}
                    $isEven={index % 2 === 0}
                    onClick={() => handleRowClick(activo)}
                    style={{
                      backgroundColor:
                        activoSeleccionado?.codigo === activo.codigo
                          ? '#cce5ff'
                          : undefined,
                    }}
                  >
                    <TableData>{activo.codigo}</TableData>
                    <TableData>{activo.nombre}</TableData>
                    <TableData>{activo.tipo}</TableData>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableData colSpan="3">No hay activos disponibles.</TableData>
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
