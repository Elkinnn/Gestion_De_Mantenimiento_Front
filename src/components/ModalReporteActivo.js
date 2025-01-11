import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api/api';

const ModalContainer = styled.div`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 50%;
  max-width: 700px;
  max-height: 75vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  position: relative;
  padding-bottom: 20px;
`;

const Header = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  &:hover {
    color: #e0e0e0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background: #f1f1f1;
  padding: 10px;
  border-bottom: 2px solid #ddd;
`;

const Tab = styled.button`
  background: ${(props) => (props.$isActive ? '#007bff' : 'transparent')};
  color: ${(props) => (props.$isActive ? 'white' : '#007bff')};
  border: none;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const Section = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
`;

const ScrollableTableContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f8f9fa;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
`;

const TableHead = styled.thead`
  background-color: #007bff;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #e9ecef;
    cursor: pointer;
  }
`;

const TableHeader = styled.th`
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const TableData = styled.td`
  padding: 8px 10px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  text-align: center;
`;

const ModalReporteActivo = ({ isOpen, onClose, mantenimientoId, activoId }) => {
    const [especificaciones, setEspecificaciones] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [observacion, setObservacion] = useState('');
    const [activeTab, setActiveTab] = useState('actividades');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (mantenimientoId && activoId) {
            fetchDetallesMantenimiento(mantenimientoId, activoId);
        }
    }, [mantenimientoId, activoId]);


    const fetchDetallesMantenimiento = async (mantenimientoId, activoId) => {
        if (!mantenimientoId || !activoId) return;
        setLoading(true);

        try {
            const response = await api.get(`/mantenimientos/detalles/${mantenimientoId}/${activoId}`);

            setEspecificaciones(
                response.data.actividades_realizadas?.map((item) => ({
                    nombre: item.nombre_actividad,
                })) || []
            );

            setComponentes(
                response.data.componentes_utilizados?.map((item) => ({
                    nombre: item.componente_utilizado,
                })) || []
            );

            setObservacion(response.data.observacion || 'Sin observaciones registradas.');
        } catch (error) {
            console.error("Error al cargar detalles del mantenimiento:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <ModalContainer $isOpen={isOpen}>
            <ModalContent>
                <Header>
                    <span>Detalles del Mantenimiento</span>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </Header>

                {/* 🔹 Pestañas de navegación */}
                <TabsContainer>
                    <Tab $isActive={activeTab === 'actividades'} onClick={() => setActiveTab('actividades')}>
                        Actividades
                    </Tab>
                    <Tab $isActive={activeTab === 'componentes'} onClick={() => setActiveTab('componentes')}>
                        Componentes
                    </Tab>
                    <Tab $isActive={activeTab === 'observacion'} onClick={() => setActiveTab('observacion')}>
                        Observación
                    </Tab>
                </TabsContainer>

                {/* 🔹 Contenido de la pestaña seleccionada */}
                <Section>
                    {activeTab === 'actividades' && (
                        <>
                            <SectionTitle>Actividades Realizadas</SectionTitle>
                            <ScrollableTableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>Actividad</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <tbody>
                                        {loading ? (
                                            <TableRow>
                                                <TableData colSpan="1">Cargando...</TableData>
                                            </TableRow>
                                        ) : (
                                            especificaciones.length > 0 ? (
                                                especificaciones.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableData>{item.nombre}</TableData>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableData colSpan="1">No hay especificaciones registradas</TableData>
                                                </TableRow>
                                            )
                                        )}

                                    </tbody>
                                </Table>
                            </ScrollableTableContainer>
                        </>
                    )}

                    {activeTab === 'componentes' && (
                        <>
                            <SectionTitle>Componentes Utilizados</SectionTitle>
                            <ScrollableTableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>Componente</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <tbody>
                                        {componentes.length > 0 ? (
                                            componentes.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableData>{item.nombre}</TableData>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableData colSpan="1">No hay componentes registrados</TableData>
                                            </TableRow>
                                        )}
                                    </tbody>
                                </Table>
                            </ScrollableTableContainer>
                        </>
                    )}

                    {activeTab === 'observacion' && (
                        <>
                            <SectionTitle>Observación</SectionTitle>
                            <ScrollableTableContainer>
                                <Table>
                                    <tbody>
                                        <TableRow>
                                            <TableData>{observacion}</TableData>
                                        </TableRow>
                                    </tbody>
                                </Table>
                            </ScrollableTableContainer>
                        </>
                    )}
                </Section>
            </ModalContent>
        </ModalContainer>
    );
};

export default ModalReporteActivo;
