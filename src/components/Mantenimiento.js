import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  flex-direction: column;
  padding: 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #003366;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
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
  background-color: ${(props) => (props.$isEven ? '#f9f9f9' : '#fff')};
  &:hover {
    background-color: #e0f7ff;
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

const Mantenimientos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    status: '',
    provider: '',
  });

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await api.get('/mantenimientos'); // Asegúrate de que la URL sea correcta
        setMantenimientos(response.data);
      } catch (err) {
        console.error('Error al cargar mantenimientos:', err);
      }
    };

    fetchMantenimientos();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Navbar title="Menú de Mantenimientos" />
      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        currentMenu="mantenimientos"
      />
      <Container $sidebarOpen={sidebarOpen}>
        <Title>Mantenimientos Registrados</Title>
        <FilterContainer>
          <FilterSelect name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Año</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </FilterSelect>
          <FilterSelect name="month" value={filters.month} onChange={handleFilterChange}>
            <option value="">Mes</option>
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
          </FilterSelect>
          <FilterSelect name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Terminado">Terminado</option>
          </FilterSelect>
          <FilterSelect name="provider" value={filters.provider} onChange={handleFilterChange}>
            <option value="">Proveedor</option>
          </FilterSelect>
        </FilterContainer>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Número de Mantenimiento</TableHeader>
                <TableHeader>Proveedor</TableHeader>
                <TableHeader>Técnico</TableHeader>
                <TableHeader>Fecha Inicio</TableHeader>
                <TableHeader>Fecha Fin</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Número de Activos</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(mantenimientos) && mantenimientos.length > 0 ? (
                mantenimientos.map((mantenimiento) => (
                  <TableRow
                    key={mantenimiento.mantenimiento_id}
                    $isEven={mantenimiento.mantenimiento_id % 2 === 0}
                  >
                    <TableData>{mantenimiento.numero_mantenimiento}</TableData><TableData>{mantenimiento.proveedor || 'N/A'}</TableData><TableData>{mantenimiento.tecnico || 'N/A'}</TableData><TableData>{new Date(mantenimiento.fecha_inicio).toLocaleString()}</TableData><TableData>{new Date(mantenimiento.fecha_fin).toLocaleString()}</TableData><TableData>{mantenimiento.estado}</TableData><TableData>{mantenimiento.numero_activos}</TableData>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                    No hay mantenimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>


          </Table>
        </TableWrapper>

        <Button>Ver Mantenimiento</Button>
      </Container>
    </>
  );
};

export default Mantenimientos;
