import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { showInfoNotification } from './Notification';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  flex-direction: column;
  padding: 80px 20px 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
  margin-top: 20px; /* Espaciado adicional para que no quede tapado */
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-size: 14px;
  flex: 1;
`;

const FilterInput = styled.input`
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-size: 14px;
  flex: 1;
`;

const ClearButton = styled.button`
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  flex: none;

  &:hover {
    background-color: #0056b3;
  }
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
  background-color: ${(props) =>
    props.$selected ? '#d6eaf8' : props.$isEven ? '#f9f9f9' : '#fff'};
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

const Mantenimientos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    status: '',
    provider: '',
    date: '',
    technician: '',
  });


  const [filterOptions, setFilterOptions] = useState({
    years: [],
    months: [],
    states: [],
    providers: [],
    technicians: [],
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 + 2 }, (_, i) => 2020 + i);
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      name: new Date(0, i).toLocaleString('es-ES', { month: 'long' }),
    }));

    setFilterOptions((prev) => ({
      ...prev,
      years,
      months,
    }));

    const fetchFilterOptions = async () => {
      try {
        const response = await api.get('/mantenimientos/filtros');
        setFilterOptions((prev) => ({
          ...prev,
          states: response.data.states ? response.data.states.map((item) => item.estado) : [],
          providers: response.data.providers
            ? response.data.providers.map((item) => ({ id: item.id, name: item.name }))
            : [],
          technicians: response.data.technicians
            ? response.data.technicians.map((item) => ({ id: item.id, name: item.name }))
            : [],
        }));
      } catch (error) {
        console.error('Error al cargar los filtros:', error);
      }
    };

    fetchFilterOptions();
    fetchMantenimientos();
  }, []);

  const fetchMantenimientos = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await api.get(`/mantenimientos?${query}`);
      console.log('Datos de la API:', response.data); // Inspecciona los datos devueltos por la API
      setMantenimientos(response.data);
    } catch (err) {
      console.error('Error al cargar mantenimientos:', err);
    }
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };

    if (name === 'date' && value) {
      updatedFilters.year = '';
      updatedFilters.month = '';
    }

    if ((name === 'year' || name === 'month') && value) {
      updatedFilters.date = '';
    }

    if (name === 'provider') {
      updatedFilters.technician = '';
    }

    if (name === 'technician') {
      updatedFilters.provider = '';
    }

    setFilters(updatedFilters);
    fetchMantenimientos(updatedFilters);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      year: '',
      month: '',
      status: '',
      provider: '',
      date: '',
      technician: '',
    };
    setFilters(clearedFilters);
    fetchMantenimientos(clearedFilters);
  };

  const handleRowClick = (mantenimientoId) => {
    setSelectedMantenimiento((prevSelected) => {
      const newSelected = prevSelected === mantenimientoId ? null : mantenimientoId;

      const mantenimientoSeleccionado = mantenimientos.find(
        (mantenimiento) => mantenimiento.mantenimiento_id === newSelected
      );

      console.log('Mantenimiento seleccionado:', mantenimientoSeleccionado || 'Ninguno seleccionado');
      return newSelected;
    });
  };





  return (
    <>
      <Navbar title="Menú de Mantenimientos" />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} currentMenu="mantenimientos" />
      <Container $sidebarOpen={sidebarOpen}>
        <Title>Mantenimientos Registrados</Title>
        <FilterWrapper>
          <FilterContainer>
            <FilterLabel>Filtrar por:</FilterLabel>
            <FilterSelect
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              disabled={!!filters.date}
            >
              <option value="">Año</option>
              {filterOptions.years?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              disabled={!!filters.date}
            >
              <option value="">Mes</option>
              {filterOptions.months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </FilterSelect>
            <FilterInput
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              disabled={!!filters.year || !!filters.month}
            />
            <FilterSelect
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Estado</option>
              {filterOptions.states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              name="provider"
              value={filters.provider}
              onChange={handleFilterChange}
              disabled={!!filters.technician}
            >
              <option value="">Proveedor</option>
              {filterOptions.providers?.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              name="technician"
              value={filters.technician}
              onChange={handleFilterChange}
              disabled={!!filters.provider}
            >
              <option value="">Técnico</option>
              {filterOptions.technicians?.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name}
                </option>
              ))}
            </FilterSelect>
            <ClearButton onClick={handleClearFilters}>Limpiar</ClearButton>
          </FilterContainer>
        </FilterWrapper>

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
                mantenimientos.map((mantenimiento, index) => (
                  <TableRow
                    key={mantenimiento.mantenimiento_id}
                    $isEven={index % 2 === 0}
                    $selected={selectedMantenimiento === mantenimiento.mantenimiento_id} // Asegúrate de pasar esto
                    onClick={() => handleRowClick(mantenimiento.mantenimiento_id)} // Maneja el clic en la fila
                  >
                    <TableData>{mantenimiento.numero_mantenimiento}</TableData>
                    <TableData>{mantenimiento.proveedor || 'N/A'}</TableData>
                    <TableData>{mantenimiento.tecnico || 'N/A'}</TableData>
                    <TableData>{new Date(mantenimiento.fecha_inicio).toLocaleString()}</TableData>
                    <TableData>{new Date(mantenimiento.fecha_fin).toLocaleString()}</TableData>
                    <TableData>{mantenimiento.estado}</TableData>
                    <TableData>{mantenimiento.numero_activos}</TableData>
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

        <Button
          onClick={() => {
            if (!selectedMantenimiento) {
              showInfoNotification('Debes seleccionar un mantenimiento para continuar.');
            } else {
              const mantenimientoSeleccionado = mantenimientos.find(
                (mantenimiento) => mantenimiento.mantenimiento_id === selectedMantenimiento
              );

              console.log('Mantenimiento seleccionado:', mantenimientoSeleccionado);

              navigate('/vermantenimiento', { state: { id: mantenimientoSeleccionado.mantenimiento_id } });
            }
          }}
        >
          Ver Mantenimiento
        </Button>








      </Container>
      <Footer />
    </>
  );
};

export default Mantenimientos;
