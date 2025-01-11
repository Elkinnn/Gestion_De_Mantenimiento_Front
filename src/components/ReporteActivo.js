import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { showInfoNotification } from './Notification';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 20px 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
  margin-top: 20px;
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

const ReporteActivo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [nombreActivo, setNombreActivo] = useState('');

  useEffect(() => {
    console.log(`📡 Solicitando mantenimientos para el activo con ID: ${id}`);

    const fetchMantenimientos = async () => {
      try {
        const response = await api.get(`/mantenimientos/activo/${id}`);
        console.log("✅ Respuesta de la API:", response.data);

        // Verificamos si el activo existe en la respuesta
        if (response.data) {
          setNombreActivo(response.data.nombre || 'Desconocido'); // Siempre guardamos el nombre
          setMantenimientos(response.data.mantenimientos || []); // Si no hay mantenimientos, se asigna un array vacío
        }
      } catch (error) {
        console.error("❌ Error al cargar mantenimientos:", error);

        if (error.response) {
          console.warn(`⚠️ Error ${error.response.status}: ${error.response.data.message}`);

          if (error.response.status === 404) {
            setNombreActivo("No encontrado"); // Si el activo no existe
          }
        } else {
          setNombreActivo("Error al obtener datos");
        }

        setMantenimientos([]);
      }
    };

    if (id) {
      fetchMantenimientos();
    } else {
      console.warn("⚠️ ID no definido en useParams.");
      setNombreActivo("No seleccionado");
    }
  }, [id]);




  return (
    <>
      <Navbar title={`Reporte del Activo ${nombreActivo || '...'}`} />
      <Container>
        <Title>Mantenimientos del Activo {nombreActivo}</Title>
        <FilterWrapper>
          <FilterContainer>
            <FilterLabel>Filtrar por:</FilterLabel>
            <FilterSelect>
              <option>Fecha Inicio</option>
            </FilterSelect>
            <FilterSelect>
              <option>Fecha Fin</option>
            </FilterSelect>
            <FilterSelect>
              <option>Proveedor</option>
            </FilterSelect>
            <FilterSelect>
              <option>Técnico</option>
            </FilterSelect>
            <ClearButton>Limpiar</ClearButton>
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
                <TableHeader>Acción</TableHeader>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.length > 0 ? (
                mantenimientos.map((mantenimiento, index) => (
                  <TableRow key={index}>
                    <TableData>{mantenimiento.numero_mantenimiento}</TableData>
                    <TableData>{mantenimiento.proveedor || 'N/A'}</TableData>
                    <TableData>{mantenimiento.tecnico || 'N/A'}</TableData>
                    <TableData>{mantenimiento.fecha_inicio ? new Date(mantenimiento.fecha_inicio).toLocaleDateString() : 'N/A'}</TableData>
                    <TableData>{mantenimiento.fecha_fin ? new Date(mantenimiento.fecha_fin).toLocaleDateString() : 'N/A'}</TableData>
                    <TableData>{mantenimiento.estado}</TableData>
                    <TableData>
                      <Button onClick={() => navigate(`/vermantenimiento/${mantenimiento.id}`)}>
                        Ver Mantenimiento
                      </Button>
                    </TableData>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                    {nombreActivo === "No encontrado"
                      ? "El activo no existe en la base de datos."
                      : "Este activo no tiene mantenimientos registrados."}
                  </td>
                </tr>
              )}
            </tbody>

          </Table>
        </TableWrapper>
      </Container>
      <Footer />
    </>
  );
};

export default ReporteActivo;
