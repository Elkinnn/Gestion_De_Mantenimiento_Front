import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  padding: 80px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  color: #343a40;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Label = styled.label`
  flex: 1;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  flex: 2;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Select = styled.select`
  flex: 2;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const VerMantenimiento = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const mantenimiento = location.state || {};
  const role = localStorage.getItem('role'); // Obtener el rol del usuario
  const userName = localStorage.getItem('userName');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    console.log('Datos recibidos en VerMantenimiento:', mantenimiento);
  }, [mantenimiento]);

  return (
    <>
      <Navbar title="Nuevo Mantenimiento" />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} currentMenu="mantenimientos" />
      <Container $sidebarOpen={sidebarOpen}>
        <Title>Mantenimiento</Title>
        <FormContainer>
          {/* Tipo de Mantenimiento */}
          {role === 'Admin' && (
            <Row>
              <Label>Tipo de Mantenimiento:</Label>
              <div>
                <label>
                  <input type="radio" name="tipo" value="Interno" defaultChecked /> Interno
                </label>
                <label>
                  <input type="radio" name="tipo" value="Externo" style={{ marginLeft: '20px' }} /> Externo
                </label>
              </div>
            </Row>
          )}

          {/* Campos dinámicos según tipo */}
          {role === 'Admin' && (
            <Row>
              <Label>Proveedor:</Label>
              <Input type="text" disabled={mantenimiento.tipo === 'Interno'} />
              <Label>Técnico:</Label>
              <Input type="text" disabled={mantenimiento.tipo === 'Externo'} />
            </Row>
          )}

          {role === 'Tecnico' && (
            <Row>
              <Label>Técnico:</Label>
              <Input type="text" value={userName} disabled />
            </Row>
          )}

          <Row>
            <Label>Número de Mantenimiento:</Label>
            <Input type="text" defaultValue={mantenimiento.numero_mantenimiento || ''} />
          </Row>

          <Row>
            <Label>Fecha Inicio:</Label>
            <Input type="date" defaultValue={mantenimiento.fecha_inicio?.split('T')[0] || ''} />
            <Label>Fecha Fin:</Label>
            <Input type="date" defaultValue={mantenimiento.fecha_fin?.split('T')[0] || ''} />
          </Row>

          <Row>
            <Label>Estado:</Label>
            <Select defaultValue={mantenimiento.estado || ''}>
              <option value="Activo">Activo</option>
              <option value="Terminado">Terminado</option>
            </Select>
          </Row>

          <Title>Activos en Mantenimiento:</Title>
          <Table>
            <thead>
              <tr>
                <TableHeader>Proceso de Compra</TableHeader>
                <TableHeader>Código</TableHeader>
                <TableHeader>Serie</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Ubicación</TableHeader>
                <TableHeader>Tipo</TableHeader>
                <TableHeader>Proveedor</TableHeader>
                <TableHeader>Acción</TableHeader>
              </tr>
            </thead>
            <tbody>
              {mantenimiento.activos && mantenimiento.activos.length > 0 ? (
                mantenimiento.activos.map((activo, index) => (
                  <tr key={index}>
                    <TableData>{activo.proceso_compra}</TableData>
                    <TableData>{activo.codigo}</TableData>
                    <TableData>{activo.serie}</TableData>
                    <TableData>{activo.estado}</TableData>
                    <TableData>{activo.ubicacion}</TableData>
                    <TableData>{activo.tipo}</TableData>
                    <TableData>{activo.proveedor}</TableData>
                    <TableData>
                      <button>Agregar Especificaciones</button>
                    </TableData>
                  </tr>
                ))
              ) : (
                <tr>
                  <TableData colSpan="8">No hay activos registrados.</TableData>
                </tr>
              )}
            </tbody>
          </Table>
        </FormContainer>
      </Container>
    </>
  );
};

export default VerMantenimiento;
