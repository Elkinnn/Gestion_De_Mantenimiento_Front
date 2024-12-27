import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import EspecificacionesModalNuevo from './EspecificacionesModalNuevo';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
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

const GreenButton = styled.button`
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
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
  text-align: center;
`;

const NoDataMessage = styled.td`
  padding: 20px;
  font-size: 16px;
  color: #888;
  text-align: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  font-weight: bold;
`;

const VerMantenimiento = () => {
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

    const handleViewEspecificaciones = (activo) => {
        if (!activo) {
            console.warn('Intentaste ver especificaciones sin seleccionar un activo.');
            return;
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
            <Container>
                <FormWrapper>
                    <Title>Detalles del Mantenimiento</Title>
                    <form>
                        <FormGrid>
                            <FormGroup>
                                <Label>Número de Mantenimiento:</Label>
                                <Input type="text" value={mantenimiento.numero_mantenimiento || ''} readOnly />
                            </FormGroup>

                            {/* Mostrar Proveedor solo si está definido */}
                            {mantenimiento.proveedor && (
                                <FormGroup>
                                    <Label>Proveedor:</Label>
                                    <Input type="text" value={mantenimiento.proveedor} readOnly />
                                </FormGroup>
                            )}

                            {/* Mostrar Técnico solo si no hay proveedor */}
                            {!mantenimiento.proveedor && mantenimiento.tecnico && (
                                <FormGroup>
                                    <Label>Técnico:</Label>
                                    <Input type="text" value={mantenimiento.tecnico} readOnly />
                                </FormGroup>
                            )}

                            <FormGroup>
                                <Label>Fecha Inicio:</Label>
                                <Input type="date" value={mantenimiento.fecha_inicio?.split('T')[0] || ''} readOnly />
                            </FormGroup>

                            <FormGroup>
                                <Label>Fecha Fin:</Label>
                                <Input type="date" value={mantenimiento.fecha_fin?.split('T')[0] || ''} readOnly />
                            </FormGroup>

                            <FormGroup>
                                <Label>Estado:</Label>
                                <Input type="text" value={mantenimiento.estado || ''} readOnly />
                            </FormGroup>
                        </FormGrid>
                    </form>

                    {/* Tabla de activos */}
                    <Title>Activos en Mantenimiento</Title>
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
                                    <TableHeader>Acción</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {mantenimiento.activos && mantenimiento.activos.length > 0 ? (
                                    mantenimiento.activos.map((activo, index) => (
                                        <TableRow key={activo.activo_id} $isEven={index % 2 === 0}>
                                            <TableData>{activo.proceso_compra || 'No disponible'}</TableData>
                                            <TableData>{activo.codigo}</TableData>
                                            <TableData>{activo.nombre}</TableData>
                                            <TableData>{activo.estado}</TableData>
                                            <TableData>{activo.ubicacion}</TableData>
                                            <TableData>{activo.tipo}</TableData>
                                            <TableData>{activo.proveedor}</TableData>
                                            <TableData>
                                                <GreenButton onClick={() => handleViewEspecificaciones(activo)}>
                                                    Ver/Editar Especificaciones
                                                </GreenButton>
                                            </TableData>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <NoDataMessage colSpan="8">No hay activos registrados.</NoDataMessage>
                                    </TableRow>
                                )}
                            </tbody>
                        </Table>

                    </TableWrapper>
                </FormWrapper>

            </Container>

            <EspecificacionesModalNuevo
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activo={activoSeleccionado}
                mantenimientoId={mantenimiento?.mantenimiento_id}
            />
        </>
    );
};

export default VerMantenimiento;
