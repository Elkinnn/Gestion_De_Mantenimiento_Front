import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 20px 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
  width: 90%;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: span 2;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InlineGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow-x: auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  max-height: 400px;
  margin-bottom: 0;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
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
  width: 150px;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.$isEven ? '#f9f9f9' : '#fff')};
  &:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 12px 20px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #555;
`;

const CrearMantenimiento = () => {
  const [tipoMantenimiento, setTipoMantenimiento] = useState('Interno');
  const [numeroMantenimiento, setNumeroMantenimiento] = useState('');
  const [seleccionado, setSeleccionado] = useState('');
  const [tecnicos, setTecnicos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [activos, setActivos] = useState([]);

  useEffect(() => {
    // Obtener número autoincremental de mantenimiento
    const fetchNumeroMantenimiento = async () => {
      try {
        const response = await api.get('/mantenimientos/ultimo-numero');
        setNumeroMantenimiento(response.data.siguienteNumero);
      } catch (error) {
        console.error('Error al obtener número de mantenimiento:', error);
      }
    };

    // Obtener técnicos y proveedores
    const fetchTecnicosYProveedores = async () => {
        try {
          const [usuariosResponse, proveedoresResponse] = await Promise.all([
            api.get('/usuarios'), // Asegúrate de que esta ruta es correcta
            api.get('/proveedores'), // Asegúrate de que esta ruta es correcta
          ]);
          setTecnicos(usuariosResponse.data); // Cambia setUsuarios por setTecnicos si es necesario
          setProveedores(proveedoresResponse.data);
        } catch (error) {
          console.error('Error al cargar técnicos o proveedores:', error);
        }
      };
      
      
      

    fetchNumeroMantenimiento();
    fetchTecnicosYProveedores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      tipoMantenimiento,
      numeroMantenimiento,
      seleccionado,
      fechaInicio,
      fechaFin,
      estado: 'Activo', // Estado bloqueado
    };

    try {
      const response = await api.post('/mantenimientos', data);
      alert('Mantenimiento creado exitosamente');
      console.log(response.data);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      alert('Error al crear el mantenimiento');
    }
  };

  return (
    <>
      <Navbar title="Nuevo Mantenimiento" />
      <Container>
        <FormWrapper>
          <Title>Crear Nuevo Mantenimiento</Title>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FullWidth>
                <InlineGroup>
                  <Label>Tipo de Mantenimiento:</Label>
                  <Label>
                    <input
                      type="radio"
                      value="Interno"
                      checked={tipoMantenimiento === 'Interno'}
                      onChange={() => setTipoMantenimiento('Interno')}
                    />
                    Interno
                  </Label>
                  <Label>
                    <input
                      type="radio"
                      value="Externo"
                      checked={tipoMantenimiento === 'Externo'}
                      onChange={() => setTipoMantenimiento('Externo')}
                    />
                    Externo
                  </Label>
                </InlineGroup>
              </FullWidth>

              <FormGroup>
                <Label>Número de Mantenimiento:</Label>
                <Input type="text" value={numeroMantenimiento} readOnly />
              </FormGroup>

              <FormGroup>
                <Label>{tipoMantenimiento === 'Interno' ? 'Técnico:' : 'Proveedor:'}</Label>
                <Select
                  value={seleccionado}
                  onChange={(e) => setSeleccionado(e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  {(tipoMantenimiento === 'Interno' ? tecnicos : proveedores).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre || item.username}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Fecha Inicio:</Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Fecha Fin:</Label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </FormGroup>

              <FullWidth>
                <InlineGroup>
                  <Label>Agregar Activo:</Label>
                  <Button onClick={() => alert('Redirigiendo a agregar activo')}>Agregar</Button>
                </InlineGroup>
              </FullWidth>
            </FormGrid>

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
                  {activos.length > 0 ? (
                    activos.map((activo) => (
                      <TableRow key={activo.id}>
                        <TableData>{activo.proceso_compra}</TableData>
                        <TableData>{activo.codigo}</TableData>
                        <TableData>{activo.serie}</TableData>
                        <TableData>{activo.estado}</TableData>
                        <TableData>{activo.ubicacion}</TableData>
                        <TableData>{activo.tipo}</TableData>
                        <TableData>{activo.proveedor}</TableData>
                      </TableRow>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No hay activos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>

            <FullWidth>
              <Button type="submit">Guardar Mantenimiento</Button>
            </FullWidth>
          </form>
        </FormWrapper>
      </Container>
      <Footer />
    </>
  );
};

export default CrearMantenimiento;
