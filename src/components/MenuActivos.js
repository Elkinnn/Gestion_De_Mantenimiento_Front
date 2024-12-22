import React, { useEffect, useState } from 'react';
import api from '../api/api';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { showInfoNotification } from './Notification';
import FiltroComponent from './FiltroComponent';
import LimpiarComponent from './LimpiarComponent';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  padding-right: 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  padding-top: 80px;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  min-height: 100vh;
  padding-bottom: 60px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
  white-space: nowrap;
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
  margin-bottom: 0;
`;

const TableTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 20px;
  text-align: center;
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
  text-align: center;
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
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 10px;
  width: auto;
  max-width: 250px;
  display: block;
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const MenuActivos = () => {
  const [activos, setActivos] = useState([]);
  const [filteredActivos, setFilteredActivos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role] = useState(localStorage.getItem('role'));
  const [filtros, setFiltros] = useState({
    proceso_compra: '',
    proveedor: '',
    tipo: '',
    estado: '',
  });

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const response = await api.get('/activos/menu');
        setActivos(response.data);
        setFilteredActivos(response.data);
      } catch (err) {
        setError('Error al cargar los activos');
      }
    };

    fetchActivos();
  }, []);

  useEffect(() => {
    // Filtrar activos según los filtros seleccionados
    const filtered = activos.filter((activo) => {
      return (
        (filtros.proceso_compra === '' || activo.proceso_compra.includes(filtros.proceso_compra)) &&
        (filtros.proveedor === '' || activo.proveedor === filtros.proveedor) &&
        (filtros.tipo === '' || activo.tipo === filtros.tipo) &&
        (filtros.estado === '' || activo.estado === filtros.estado)
      );
    });
    setFilteredActivos(filtered);
  }, [filtros, activos]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRowClick = (activoId) => {
    setSelectedActivo((prevSelected) => (prevSelected === activoId ? null : activoId));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFiltros({
      proceso_compra: '',
      proveedor: '',
      tipo: '',
      estado: '',
    });
  };

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} selectedActivo={selectedActivo} role={role} />
      <Navbar title="Menú de Activos" />
      <Container $sidebarOpen={sidebarOpen}>
        <TableTitle>Activos Registrados</TableTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <FilterContainer>
          <FilterLabel>Filtrar por:</FilterLabel>
          <FiltroComponent filtros={filtros} handleFilterChange={handleFilterChange} />
          <LimpiarComponent handleClear={handleClear} />
        </FilterContainer>

        <TableWrapper>
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
              </tr>
            </thead>
            <tbody>
              {filteredActivos.length > 0 ? (
                filteredActivos.map((activo, index) => (
                  <TableRow
                    key={activo.id}
                    $isEven={index % 2 === 0}
                    $selected={selectedActivo === activo.id}
                    onClick={() => handleRowClick(activo.id)}
                  >
                    <TableData>{activo.proceso_compra}</TableData>
                    <TableData>{activo.codigo}</TableData>
                    <TableData>{activo.nombre}</TableData>
                    <TableData>{activo.estado}</TableData>
                    <TableData>{activo.ubicacion}</TableData>
                    <TableData>{activo.tipo}</TableData>
                    <TableData>{activo.proveedor}</TableData>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                    No hay activos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {role !== 'Tecnico' && (
          <Button
            onClick={() => {
              if (!selectedActivo) {
                showInfoNotification('Debes seleccionar un activo para generar el reporte.');
              } else {
                window.location.href = `/reporte/${selectedActivo}`;
              }
            }}
          >
            Reporte del Activo
          </Button>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default MenuActivos;
