import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import api from '../api/api'; // Supongamos que tienes un archivo para realizar llamadas a la API

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
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
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
`;

const Select = styled.select`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
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

const CrearMantenimiento = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const role = localStorage.getItem('role'); // Obtenemos el rol desde localStorage
  const userName = localStorage.getItem('userName'); // Obtenemos el nombre del usuario logueado

  const [tipoMantenimiento, setTipoMantenimiento] = useState('Interno');
  const [numeroMantenimiento, setNumeroMantenimiento] = useState('');
  const [tecnico, setTecnico] = useState(role === 'Tecnico' ? userName : '');
  const [proveedor, setProveedor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('Activo');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} currentMenu="mantenimientos" />
      <Container $sidebarOpen={sidebarOpen}>
        <Title>Crear Nuevo Mantenimiento</Title>
        <form onSubmit={handleSubmit}>
          {/* Tipo de Mantenimiento */}
          {role === 'Admin' && (
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
          )}

          {/* Número de Mantenimiento */}
          <FormGroup>
            <Label>Número de Mantenimiento:</Label>
            <Input
              type="text"
              value={numeroMantenimiento}
              onChange={(e) => setNumeroMantenimiento(e.target.value)}
              required
            />
          </FormGroup>

          {/* Técnico */}
          {tipoMantenimiento === 'Interno' && (
            <FormGroup>
              <Label>Técnico:</Label>
              <Input
                type="text"
                value={tecnico}
                onChange={(e) => setTecnico(e.target.value)}
                readOnly={role === 'Tecnico'} // Solo los Admins pueden modificar
              />
            </FormGroup>
          )}

          {/* Proveedor */}
          {tipoMantenimiento === 'Externo' && (
            <FormGroup>
              <Label>Proveedor:</Label>
              <Select
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
              >
                <option value="">Seleccione un proveedor</option>
                <option value="Proveedor1">Proveedor 1</option>
                <option value="Proveedor2">Proveedor 2</option>
                {/* Puedes mapear proveedores dinámicamente */}
              </Select>
            </FormGroup>
          )}

          {/* Fecha Inicio y Fin */}
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

          {/* Botón de Enviar */}
          <Button type="submit">Guardar Mantenimiento</Button>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default CrearMantenimiento;
