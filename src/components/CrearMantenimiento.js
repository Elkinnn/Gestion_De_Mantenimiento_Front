import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Notification, { showInfoNotification } from './Notification';
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
  text-align: center;
`;

const NoDataMessage = styled.td`
  padding: 20px;
  font-size: 16px;
  color: #888;
  text-align: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
`;

const CenteredButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const CrearMantenimiento = () => {
    const [tipoMantenimiento, setTipoMantenimiento] = useState('');
    const [numeroMantenimiento, setNumeroMantenimiento] = useState('');
    const [seleccionado, setSeleccionado] = useState('');
    const [tecnicos, setTecnicos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [activos] = useState([]);
    const [rolUsuario, setRolUsuario] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');

    const [showProveedorTecnico, setShowProveedorTecnico] = useState(false); // Controlar visibilidad del proveedor/técnico
    const [isFechaInicioEnabled, setIsFechaInicioEnabled] = useState(false); // Desbloquear Fecha Inicio
    const [isFechaFinEnabled, setIsFechaFinEnabled] = useState(false); // Desbloquear Fecha Fin
    const [isAgregarActivoEnabled, setIsAgregarActivoEnabled] = useState(false); // Desbloquear botón Agregar

    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (rolUsuario === 'Admin') {
            setShowMessage(true);
        }
    }, [rolUsuario]);


    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await api.get('/auth/user-info'); // Endpoint para obtener info del usuario actual
                setRolUsuario(response.data.role); // Almacena el rol
                setNombreUsuario(response.data.username); // Almacena el nombre del usuario
            } catch (error) {
                console.error('Error al obtener rol del usuario:', error);
            }
        };

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
                setTecnicos(usuariosResponse.data);
                setProveedores(proveedoresResponse.data);
            } catch (error) {
                console.error('Error al cargar técnicos o proveedores:', error);
            }
        };

        fetchUserRole();
        fetchNumeroMantenimiento();
        fetchTecnicosYProveedores();
    }, []);


    // Dependencia vacía para que se ejecute solo al montar el componente.


    const handleTipoMantenimientoChange = (tipo) => {
        setTipoMantenimiento(tipo);
        setShowMessage(false); // Ocultar mensaje al seleccionar tipo
        setShowProveedorTecnico(true);
        setSeleccionado('');
        setIsFechaInicioEnabled(false);
        setIsFechaFinEnabled(false);
        setIsAgregarActivoEnabled(false);

        if (rolUsuario === 'Admin') {
            setFechaInicio('');
            setFechaFin('');
        }
    };

    const handleSeleccionadoChange = (value) => {
        setSeleccionado(value);
    
        if (value === "") {
            // Restablecer fechas si selecciona "Seleccione una opción"
            setFechaInicio("");
            setFechaFin("");
            setIsFechaInicioEnabled(false); // Bloquear Fecha Inicio
            setIsFechaFinEnabled(false);   // Bloquear Fecha Fin
        } else {
            setIsFechaInicioEnabled(true); // Desbloquear Fecha Inicio si hay algo seleccionado
        }
    };
    

    const handleFechaInicioChange = (value) => {
        setFechaInicio(value);
        setIsFechaFinEnabled(!!value); // Desbloquear Fecha Fin si hay Fecha Inicio
    };

    const handleFechaFinChange = (value) => {
        setFechaFin(value);
        setIsAgregarActivoEnabled(!!value); // Desbloquear botón Agregar si hay Fecha Fin
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            tipoMantenimiento,
            numeroMantenimiento,
            seleccionado,
            fechaInicio,
            fechaFin,
            estado: 'Activo',
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
            <Notification />
            <Container>
                <FormWrapper>
                    <Title>Crear Nuevo Mantenimiento</Title>
                    {rolUsuario === 'Admin' && showMessage && (
    <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
        Por favor, seleccione un tipo de mantenimiento para continuar.
    </div>
)}

                    <form onSubmit={handleSubmit}>
                        <FormGrid>
                            {/* Solo visible para Admin */}
                            {rolUsuario === 'Admin' && (
                                <FullWidth>
                                    <InlineGroup>
                                        <Label>Tipo de Mantenimiento:</Label>
                                        <Label>
                                            <input
                                                type="radio"
                                                value="Interno"
                                                checked={tipoMantenimiento === 'Interno'}
                                                onChange={() => handleTipoMantenimientoChange('Interno')}
                                            />
                                            Interno
                                        </Label>
                                        <Label>
                                            <input
                                                type="radio"
                                                value="Externo"
                                                checked={tipoMantenimiento === 'Externo'}
                                                onChange={() => handleTipoMantenimientoChange('Externo')}
                                            />
                                            Externo
                                        </Label>
                                    </InlineGroup>
                                </FullWidth>
                            )}

                            <FormGroup>
                                <Label>Número de Mantenimiento:</Label>
                                <Input type="text" value={numeroMantenimiento} readOnly />
                            </FormGroup>

                            {/* Campo Técnico siempre visible para Técnico */}
                            {rolUsuario === 'Tecnico' && (
                                <FormGroup>
                                    <Label>Técnico:</Label>
                                    <Input type="text" value={nombreUsuario} readOnly />
                                </FormGroup>
                            )}

                            {/* Campos dinámicos para Admin */}
                            {rolUsuario === 'Admin' && showProveedorTecnico && (
                                <FormGroup>
                                    <Label>{tipoMantenimiento === 'Interno' ? 'Técnico:' : 'Proveedor:'}</Label>
                                    <Select
                                        value={seleccionado}
                                        onChange={(e) => handleSeleccionadoChange(e.target.value)}
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {(tipoMantenimiento === 'Interno' ? tecnicos : proveedores).map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nombre || item.username}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>
                            )}

                            <FormGroup>
                                <Label>Fecha Inicio:</Label>
                                <Input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => handleFechaInicioChange(e.target.value)}
                                    disabled={rolUsuario === 'Admin' && !isFechaInicioEnabled} // Siempre habilitada para Técnico
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Fecha Fin:</Label>
                                <Input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => handleFechaFinChange(e.target.value)}
                                    disabled={(rolUsuario === 'Admin' && !isFechaFinEnabled) || (rolUsuario === 'Tecnico' && !fechaInicio)}
                                />
                            </FormGroup>

                            {/* Botón Agregar Activo solo para Admin */}
                            {rolUsuario === 'Admin' && (
                                <FullWidth>
                                    <InlineGroup>
                                        <Label>Agregar Activo:</Label>
                                        <Button
                                            disabled={!isAgregarActivoEnabled}
                                            onClick={() => alert('Redirigiendo a agregar activo')}
                                        >
                                            Agregar
                                        </Button>
                                    </InlineGroup>
                                </FullWidth>
                            )}
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
                                            <NoDataMessage colSpan="7">No hay activos registrados.</NoDataMessage>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </TableWrapper>

                        <CenteredButtonWrapper>
                            <Button
                                type="submit"
                                disabled={rolUsuario !== 'Admin'}
                            >
                                Guardar Mantenimiento
                            </Button>
                        </CenteredButtonWrapper>
                    </form>
                </FormWrapper>
            </Container>
            <Footer />
        </>
    );


};

export default CrearMantenimiento;
