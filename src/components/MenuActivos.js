import React, { useEffect, useState } from 'react';
import api from '../api/api';
import styled from 'styled-components';
import Sidebar from './Sidebar'; // Importamos Sidebar
import Navbar from './Navbar';  // Importamos el Navbar
import Footer from './Footer';  // Importamos el Footer
import FiltroComponent from './FiltroComponent';
import LimpiarComponent from './LimpiarComponent';
import { showInfoNotification } from './Notification';

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
  min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la pantalla */
  padding-bottom: 60px; /* Espacio para el footer */
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #ffffff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FiltersLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #343a40;
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
  text-align: center;  /* Agregar esta línea para centrar el texto */
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
  const [filters, setFilters] = useState({
    proceso_compra: '',
    proveedor: '',
    tipo: '',
    estado: ''
  });
  const [selectedActivo, setSelectedActivo] = useState(null); // Solo un activo seleccionado
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const response = await api.get('/activos/menu');
        console.log('Datos recibidos:', response.data); // Verifica la estructura de los datos
        setActivos(response.data);
        setFilteredActivos(response.data);
      } catch (err) {
        setError('Error al cargar los activos');
      }
    };

    fetchActivos();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRowClick = (activoId) => {
    // Si el mismo activo ya está seleccionado, lo deseleccionamos, de lo contrario, lo seleccionamos
    setSelectedActivo((prevSelected) => {
      const newSelected = prevSelected === activoId ? null : activoId;
      console.log(`Activo seleccionado: ${newSelected}`); // Imprime el ID del activo seleccionado
      return newSelected;
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Filtrar activos según los filtros seleccionados
    const filtered = activos.filter((activo) => {
      return (
        (newFilters.proceso_compra === '' || activo.proceso_compra.includes(newFilters.proceso_compra)) &&
        (newFilters.proveedor === '' || activo.proveedor.includes(newFilters.proveedor)) &&
        (newFilters.tipo === '' || activo.tipo.includes(newFilters.tipo)) &&
        (newFilters.estado === '' || activo.estado.includes(newFilters.estado))
      );
    });
    setFilteredActivos(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      proceso_compra: '',
      proveedor: '',
      tipo: '',
      estado: ''
    });
    setFilteredActivos(activos);
  };

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} selectedActivo={selectedActivo} role={role} />
      <Navbar title="Menú de Activos" />
      <Container $sidebarOpen={sidebarOpen}>
        <TableTitle>Activos Registrados</TableTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <FiltersContainer>
          <FiltersLabel>Filtrar por:</FiltersLabel>
          <FiltroComponent filtros={filters} handleFilterChange={handleFilterChange} />
          <LimpiarComponent handleClear={handleClearFilters} />
        </FiltersContainer>

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
              {Array.isArray(filteredActivos) && filteredActivos.length > 0 ? (
                filteredActivos.map((activo, index) => (
                  <TableRow
                    key={activo.id} // La clave debe ser única, usamos el id de cada activo
                    $isEven={index % 2 === 0}
                    $selected={selectedActivo === activo.id}
                    onClick={() => handleRowClick(activo.id)} // Solo pasamos el id
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
                console.log(`Generando reporte para el activo con ID: ${selectedActivo}`);
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
