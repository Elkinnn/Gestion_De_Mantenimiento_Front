import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EspecificacionesModalNuevo from './EspecificacionesModalNuevo';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.$sidebarOpen ? '200px' : '0')};
  padding: 80px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  color: #343a40;
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

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const VerMantenimiento = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mantenimiento, setMantenimiento] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activoSeleccionado, setActivoSeleccionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const mantenimientoId = location.state?.id || mantenimiento?.mantenimiento_id;


    useEffect(() => {
        if (mantenimientoId) {
            fetchMantenimientoData(mantenimientoId);
        }
    }, [mantenimientoId]);

    const fetchMantenimientoData = async (id) => {
        try {
            const response = await api.get(`/mantenimientos/${id}`);
            setMantenimiento(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al cargar los datos del mantenimiento:', error);
            setIsLoading(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleViewEspecificaciones = (activo) => {
        if (!activo) {
          console.warn('Intentaste ver especificaciones sin seleccionar un activo.');
          return; // Salir si activo es null
        }
        setActivoSeleccionado(activo);
        setIsModalOpen(true);
      };
      
      
      

    if (isLoading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <>
            <Navbar title="Detalles del Mantenimiento" />
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} currentMenu="mantenimientos" />
            <Container $sidebarOpen={sidebarOpen}>
                <Title>Detalles del Mantenimiento</Title>
                <div>
                    <p><strong>Número de Mantenimiento:</strong> {mantenimiento.numero_mantenimiento || 'No disponible'}</p>
                    <p><strong>Proveedor:</strong> {mantenimiento.proveedor || 'No disponible'}</p>
                    <p><strong>Técnico:</strong> {mantenimiento.tecnico || 'No disponible'}</p>
                    <p><strong>Fecha Inicio:</strong> {mantenimiento.fecha_inicio?.split('T')[0] || 'No disponible'}</p>
                    <p><strong>Fecha Fin:</strong> {mantenimiento.fecha_fin?.split('T')[0] || 'No disponible'}</p>
                    <p><strong>Estado:</strong> {mantenimiento.estado || 'No disponible'}</p>
                </div>

                <Title>Activos en Mantenimiento</Title>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Código</TableHeader>
                            <TableHeader>Nombre</TableHeader>
                            <TableHeader>Estado</TableHeader>
                            <TableHeader>Ubicación</TableHeader>
                            <TableHeader>Tipo</TableHeader>
                            <TableHeader>Proveedor</TableHeader>
                            <TableHeader>Acción</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimiento.activos && mantenimiento.activos.length > 0 ? (
                            mantenimiento.activos.map((activo) => (
                                <tr key={activo.activo_id}>
                                    <TableData>{activo.codigo}</TableData>
                                    <TableData>{activo.nombre}</TableData>
                                    <TableData>{activo.estado}</TableData>
                                    <TableData>{activo.ubicacion}</TableData>
                                    <TableData>{activo.tipo}</TableData>
                                    <TableData>{activo.proveedor}</TableData>
                                    <TableData>
                                        <Button onClick={() => handleViewEspecificaciones(activo)}>Ver Especificaciones</Button>
                                    </TableData>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <TableData colSpan="7">No hay activos registrados.</TableData>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>

            <EspecificacionesModalNuevo
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activo={activoSeleccionado}
                mantenimientoId={mantenimiento?.mantenimiento_id} // Asegúrate de que este valor exista
            />

        </>
    );
};

export default VerMantenimiento;
