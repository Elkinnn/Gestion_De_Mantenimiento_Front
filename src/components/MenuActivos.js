import React, { useEffect, useState } from 'react';
import api from '../api/api';
import styled from 'styled-components';
import Sidebar from './Sidebar'; // Importamos Sidebar
import Navbar from './Navbar';  // Importamos el Navbar

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  padding-right: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  padding-top: 80px;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  max-height: 400px;  
  overflow-y: auto;
`;

const TableTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #ddd;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.$selected ? '#d6eaf8' : props.$isEven ? '#f9f9f9' : '#fff')};
  &:hover {
    background-color: ${(props) => (props.$selected ? '#d6eaf8' : '#f1f1f1')};
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 12px 20px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #555;
`;

const Button = styled.button`
  padding: 12px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px auto;
  width: auto;
  display: block;

  &:hover {
    background-color: #0056b3;
  }
`;

const MenuActivos = () => {
  const [activos, setActivos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const response = await api.get('/activos/menu');
        setActivos(response.data);
      } catch (err) {
        setError('Error al cargar los activos');
      }
    };

    fetchActivos();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRowClick = (activo) => {
    setSelectedActivo(selectedActivo === activo.id ? null : activo.id);
  };

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} selectedActivo={selectedActivo} />
      <Navbar />
      <Container $sidebarOpen={sidebarOpen}>
        <TableTitle>Activos Registrados</TableTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Proceso de Compra</TableHeader>
                <TableHeader>Código</TableHeader>
                <TableHeader>Nombre</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Ubicación</TableHeader>
                <TableHeader>Tipo</TableHeader>
                <TableHeader>Proveedor</TableHeader>
              </tr>
            </thead>
            <tbody>
              {activos.map((activo, index) => (
                <TableRow
                  key={activo.id}
                  $isEven={index % 2 === 0}
                  $selected={selectedActivo === activo.id}
                  onClick={() => handleRowClick(activo)}
                >
                  <TableData>{activo.proceso_compra}</TableData>
                  <TableData>{activo.codigo}</TableData>
                  <TableData>{activo.nombre}</TableData>
                  <TableData>{activo.estado}</TableData>
                  <TableData>{activo.ubicacion}</TableData>
                  <TableData>{activo.tipo}</TableData>
                  <TableData>{activo.proveedor}</TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <Button onClick={() => {
          if (!selectedActivo) {
            alert('Debes seleccionar un activo para generar el reporte.');
          } else {
            window.location.href = `/reporte/${selectedActivo}`;  // Navegar al reporte con el activo seleccionado
          }
        }}>
          Reporte del Activo
        </Button>
      </Container>
    </>
  );
};

export default MenuActivos;
