import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../api/api'; // Supongamos que tienes un archivo para realizar llamadas a la API

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
  max-width: 1200px; /* Incrementa el ancho máximo */
  margin: 0 auto;
  width: 90%; /* Asegúrate de que ocupe el 90% del contenedor */
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

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  overflow-x: auto; /* Permite el desplazamiento horizontal */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  max-height: 400px;
  margin-bottom: 0;
  width: 100%; /* Asegúrate de que ocupe todo el ancho disponible */
`;

const Table = styled.table`
  width: 100%; /* La tabla ocupa el ancho completo del contenedor */
  border-collapse: collapse;
  text-align: left;
  min-width: 900px; /* Define un ancho mínimo para evitar que las columnas se colapsen */
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
  width: 150px; /* Ajusta el ancho de las columnas */
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
  const role = localStorage.getItem('role'); // Obtenemos el rol desde localStorage
  const userName = localStorage.getItem('userName'); // Obtenemos el nombre del usuario logueado

  const [tipoMantenimiento, setTipoMantenimiento] = useState('Interno');
  const [numeroMantenimiento, setNumeroMantenimiento] = useState('');
  const [tecnico, setTecnico] = useState(role === 'Tecnico' ? userName : '');
  const [proveedor, setProveedor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [activos, setActivos] = useState([]);

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const response = await api.get('/activos/menu');
        setActivos(response.data);
      } catch (err) {
        console.error('Error al cargar los activos:', err);
      }
    };

    fetchActivos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      tipoMantenimiento,
      numeroMantenimiento,
      tecnico: tipoMantenimiento === 'Interno' ? tecnico : null,
      proveedor: tipoMantenimiento === 'Externo' ? proveedor : null,
      fechaInicio,
      fechaFin,
      estado,
    };

    try {
      const response = await api.post('/mantenimientos', data);
      alert('Mantenimiento creado exitosamente');
      console.log(response.data);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      alert('Hubo un error al crear el mantenimiento');
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
              {/* Tipo de Mantenimiento */}
              <FullWidth>
                <InlineGroup>
                  <Label>Tipo de Mantenimiento:</Label>
                  <RadioGroup>
                    <Label>
                      <input
                        type="radio"
                        value="Interno"
                        checked={tipoMantenimiento === 'Interno'}
                        onChange={(e) => setTipoMantenimiento(e.target.value)}
                      />
                      Interno
                    </Label>
                    <Label>
                      <input
                        type="radio"
                        value="Externo"
                        checked={tipoMantenimiento === 'Externo'}
                        onChange={(e) => setTipoMantenimiento(e.target.value)}
                      />
                      Externo
                    </Label>
                  </RadioGroup>
                </InlineGroup>
              </FullWidth>

              {/* Número de Mantenimiento y Técnico/Proveedor */}
              <FormGroup>
                <Label>Número de Mantenimiento:</Label>
                <Input
                  type="text"
                  value={numeroMantenimiento}
                  onChange={(e) => setNumeroMantenimiento(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>{tipoMantenimiento === 'Interno' ? 'Técnico:' : 'Proveedor:'}</Label>
                {tipoMantenimiento === 'Interno' ? (
                  <Input
                    type="text"
                    value={tecnico}
                    onChange={(e) => setTecnico(e.target.value)}
                    readOnly={role === 'Tecnico'} // Solo los Admins pueden modificar
                  />
                ) : (
                  <Select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  >
                    <option value="">Seleccione un proveedor</option>
                    <option value="Proveedor1">Proveedor 1</option>
                    <option value="Proveedor2">Proveedor 2</option>
                  </Select>
                )}
              </FormGroup>

              {/* Fecha Inicio y Fecha Fin */}
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

              {/* Estado */}
              <FormGroup>
                <Label>Estado:</Label>
                <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="Activo">Activo</option>
                  <option value="Terminado">Terminado</option>
                </Select>
              </FormGroup>

              {/* Agregar Activo */}
              <FullWidth>
                <InlineGroup>
                  <Label>Agregar Activo:</Label>
                  <Button>Agregar</Button>
                </InlineGroup>
              </FullWidth>
            </FormGrid>

            {/* Tabla de Activos */}
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
                    activos.map((activo, index) => (
                      <TableRow key={activo.id} $isEven={index % 2 === 0}>
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
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay activos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>

            {/* Botón de Enviar */}
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
