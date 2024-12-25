import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  text-align: center;
`;

const TableWrapper = styled.div`
  margin-top: 20px;
  overflow-x: auto;
  max-height: 400px;
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
  margin-top: 20px;
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
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);

  if (!isOpen) return null;

  const handleRowClick = (activo) => {
    setActivoSeleccionado(activo);
  };

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalHeader>Lista de Activos</ModalHeader>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Código</TableHeader>
                <TableHeader>Nombre</TableHeader>
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
              if (activoSeleccionado) onAgregarActivo(activoSeleccionado);
            }}
            disabled={!activoSeleccionado}
          >
            Agregar Activo Seleccionado
          </Button>
        </AddButtonWrapper>
        <AddButtonWrapper>
          <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>
            Cancelar
          </Button>
        </AddButtonWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;
