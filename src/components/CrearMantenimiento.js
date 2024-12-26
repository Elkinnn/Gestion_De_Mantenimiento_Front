
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Notification, { showInfoNotification, showSuccessNotification, showErrorNotification } from './Notification';
import Modal from './Modal';
import EspecificacionesModal from './EspecificacionesModal';
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

const ActionButton = styled.button`
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
  font-weight: bold;
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
    const [activos, setActivos] = useState([]);
    const [rolUsuario, setRolUsuario] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');

    const [showProveedorTecnico, setShowProveedorTecnico] = useState(false); // Controlar visibilidad del proveedor/técnico
    const [isFechaInicioEnabled, setIsFechaInicioEnabled] = useState(false); // Desbloquear Fecha Inicio
    const [isFechaFinEnabled, setIsFechaFinEnabled] = useState(false); // Desbloquear Fecha Fin
    const [isAgregarActivoEnabled, setIsAgregarActivoEnabled] = useState(false); // Desbloquear botón Agregar

    const [showMessage, setShowMessage] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'activos' o 'confirm'


    const [activosSeleccionados, setActivosSeleccionados] = useState([]);
    const [todosActivos, setTodosActivos] = useState([]);

    const [especificacionesModalOpen, setEspecificacionesModalOpen] = useState(false); // Estado para controlar el modal
    const [activoSeleccionado, setActivoSeleccionado] = useState(null); // Activo seleccionado

    const [especificacionesGuardadas, setEspecificacionesGuardadas] = useState({});


    // Funciones para abrir y cerrar el modal
    const handleOpenModal = () => {
        setIsModalOpen(true); // Solo abre el modal
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const onEspecificacionesGuardadas = (id, nuevasEspecificaciones) => {
        // Actualiza las especificaciones en el estado global
        setEspecificacionesGuardadas((prev) => ({
            ...prev,
            [id]: nuevasEspecificaciones,
        }));

        // Actualiza el activo correspondiente en el estado de los activos seleccionados
        setActivosSeleccionados((prev) =>
            prev.map((activo) =>
                activo.id === id
                    ? { ...activo, especificaciones: nuevasEspecificaciones, tieneEspecificaciones: true }
                    : activo
            )
        );
    };





    const handleOpenEspecificacionesModal = (activo) => {
        if (!activo || !activo.tipo_activo_id) {
            showInfoNotification('El activo seleccionado no tiene tipo_activo_id.');
            return;
        }

        const especificaciones = especificacionesGuardadas[activo.id] || {
            actividades: [],
            componentes: [],
            observaciones: '',
        };

        setActivoSeleccionado({ ...activo, especificaciones }); // Sincroniza con las especificaciones más recientes
        setEspecificacionesModalOpen(true);
    };













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




    useEffect(() => {
        const fetchActivos = async () => {
            try {
                const response = await api.get('/activos'); // Cambia el endpoint si es necesario
                console.log(response.data); // Asegúrate de que los datos incluyen `tipo_activo_id`
                setTodosActivos(response.data);
            } catch (error) {
                console.error('Error al obtener activos:', error);
            }
        };
        fetchActivos();
    }, []);

    // Dependencia vacía para que se ejecute solo al montar el componente.


    const handleConfirmModal = () => {
        setIsModalOpen(false);
        alert('Acción confirmada.'); // Aquí puedes realizar cualquier acción al confirmar
    };

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
            // Si selecciona "Seleccione una opción", bloquear todo y restablecer
            setFechaInicio("");
            setFechaFin("");
            setIsFechaInicioEnabled(false);
            setIsFechaFinEnabled(false);
            setIsAgregarActivoEnabled(false); // Bloquear el botón
        } else {
            // Si selecciona un nuevo técnico o proveedor, restablecer las fechas
            setFechaInicio("");
            setFechaFin("");
            setIsFechaInicioEnabled(true); // Habilitar Fecha Inicio
            setIsFechaFinEnabled(false);  // Bloquear Fecha Fin hasta que se seleccione Fecha Inicio
            setIsAgregarActivoEnabled(false); // Bloquear el botón
        }
    };

    const handleAgregarActivo = (activo) => {
        const nuevoActivo = {
            id: activo.id || null,
            procesoCompra: activo.procesoCompra || activo.proceso_compra || 'No especificado',
            codigo: activo.codigo || 'Sin código',
            nombre: activo.nombre || 'Sin nombre',
            estado: activo.estado || 'Desconocido',
            ubicacion: activo.ubicacion || 'No especificado',
            tipo: activo.tipo || 'No especificado',
            proveedor: activo.proveedor || 'No especificado',
            tipo_activo_id: activo.tipo_activo_id || null,
            tieneEspecificaciones: false, // Inicializado como falso
        };

        // Validación: El activo debe tener un tipo_activo_id válido
        if (!nuevoActivo.tipo_activo_id) {
            console.error('El activo seleccionado no tiene un tipo válido:', nuevoActivo);
            showInfoNotification('El activo seleccionado debe tener un tipo válido.');
            return;
        }

        if (!activosSeleccionados.find((a) => a.codigo === nuevoActivo.codigo)) {
            setActivosSeleccionados([...activosSeleccionados, nuevoActivo]);
            showInfoNotification('Activo agregado correctamente.');
        } else {
            showInfoNotification('El activo ya está agregado.');
        }

        handleCloseModal();
    };



    const handleGuardarMantenimiento = async (e) => {
        e.preventDefault();
    
        // Validar si hay activos seleccionados
        if (activosSeleccionados.length === 0) {
            showErrorNotification('Debe agregar al menos un activo para enviar el mantenimiento.');
            return;
        }
    
        // Validar si todos los activos tienen especificaciones completas
        const activosSinEspecificaciones = activosSeleccionados.filter(
            (activo) => !activo.tieneEspecificaciones
        );
    
        if (activosSinEspecificaciones.length > 0) {
            showErrorNotification('Debe agregar especificaciones a todos los activos.');
            return;
        }
    
        // Validar campos obligatorios
        if (!tipoMantenimiento || !seleccionado || !fechaInicio || !fechaFin) {
            showErrorNotification('Debe completar todos los campos obligatorios.');
            return;
        }
    
        try {
            // Preparar datos del mantenimiento
            const mantenimientoData = {
                numero_mantenimiento: numeroMantenimiento,
                proveedor_id: tipoMantenimiento === 'Externo' ? seleccionado : null,
                tecnico_id: tipoMantenimiento === 'Interno' ? seleccionado : null,
                admin_id: null, // Siempre será null
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                estado: 'Activo',
                activos: activosSeleccionados.map((activo) => ({
                    id: activo.id,
                    especificaciones: especificacionesGuardadas[activo.id] || {
                        actividades: [],
                        componentes: [],
                        observaciones: '',
                    },
                })),
            };
    
            // Realizar la solicitud al backend
            const response = await api.post('/mantenimientos', mantenimientoData);
    
            // Mostrar notificación de éxito
            showSuccessNotification('Mantenimiento registrado correctamente.');
    
            // Reiniciar el formulario
            setTipoMantenimiento('');
            setNumeroMantenimiento('');
            setSeleccionado('');
            setFechaInicio('');
            setFechaFin('');
            setActivosSeleccionados([]);
            setEspecificacionesGuardadas({});
        } catch (error) {
            console.error('Error al registrar el mantenimiento:', error);
            showErrorNotification('Error al registrar el mantenimiento.');
        }
    };
    
    
    
    








    const handleFechaInicioChange = (value) => {
        setFechaInicio(value);
        setIsFechaFinEnabled(!!value); // Desbloquear Fecha Fin si hay Fecha Inicio
    };

    const handleFechaFinChange = (value) => {
        setFechaFin(value);

        // Validar que la fecha de fin no sea menor que la de inicio
        if (fechaInicio && new Date(value) < new Date(fechaInicio)) {
            showInfoNotification('La fecha de fin no puede ser anterior a la fecha de inicio.');
            setFechaFin(''); // Reiniciar la fecha de fin
            setIsAgregarActivoEnabled(false); // Bloquear el botón
            return;
        }

        // Habilitar el botón si la Fecha Fin es válida
        const isValidFechaFin = !!value && new Date(value) >= new Date(fechaInicio);
        setIsAgregarActivoEnabled(isValidFechaFin);
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

                    <form onSubmit={handleGuardarMantenimiento}>
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

                            <FormGroup>
                                <Label>Estado:</Label>
                                <Input
                                    type="text"
                                    value="Activo"
                                    readOnly
                                />
                            </FormGroup>

                            {/* Botón Agregar Activo solo para Admin */}
                            {(rolUsuario === 'Admin' || rolUsuario === 'Tecnico') && (
                                <FullWidth>
                                    <InlineGroup>
                                        <Label>Agregar Activo:</Label>
                                        <Button
                                            type="button"
                                            onClick={handleOpenModal}
                                            disabled={!isAgregarActivoEnabled} // Botón bloqueado según el estado
                                        >
                                            Abrir Lista de Activos
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
                                        <TableHeader>Acción</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activosSeleccionados.length === 0 ? (
                                        <tr>
                                            <NoDataMessage colSpan="8">No hay activos agregados al mantenimiento.</NoDataMessage>
                                        </tr>
                                    ) : (
                                        activosSeleccionados.map((activo, index) => (
                                            <TableRow key={activo.codigo} $isEven={index % 2 === 0}>
                                                <TableData>{activo.procesoCompra}</TableData>
                                                <TableData>{activo.codigo}</TableData>
                                                <TableData>{activo.nombre}</TableData>
                                                <TableData>{activo.estado}</TableData>
                                                <TableData>{activo.ubicacion}</TableData>
                                                <TableData>{activo.tipo}</TableData>
                                                <TableData>{activo.proveedor}</TableData>
                                                <TableData>
                                                    {!especificacionesGuardadas[activo.id] ? (
                                                        <ActionButton
                                                            type="button"
                                                            onClick={() => handleOpenEspecificacionesModal(activo)}
                                                        >
                                                            Agregar Especificaciones
                                                        </ActionButton>
                                                    ) : (
                                                        <ActionButton
                                                            type="button"
                                                            onClick={() => handleOpenEspecificacionesModal(activo)}
                                                        >
                                                            Ver/Editar Especificaciones
                                                        </ActionButton>
                                                    )}
                                                </TableData>

                                            </TableRow>
                                        )))}
                                </tbody>


                            </Table>

                        </TableWrapper>

                        <CenteredButtonWrapper>
                            <Button
                                type="submit"
                                //</CenteredButtonWrapper>disabled={
                                    //!numeroMantenimiento ||
                                    //!fechaInicio ||
                                   // !fechaFin ||
                                   // (tipoMantenimiento && !seleccionado) ||
                                   // activosSeleccionados.length === 0 ||
                                    //activosSeleccionados.some((activo) => !activo.tieneEspecificaciones)
                                //}
                            >
                                Guardar Mantenimiento
                            </Button>



                        </CenteredButtonWrapper>
                    </form>
                </FormWrapper>

                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onAgregarActivo={(activo) => {
                            handleAgregarActivo(activo);
                            handleCloseModal(); // Cierra el modal después de agregar
                        }}
                        activos={todosActivos}
                    />
                )}


                {especificacionesModalOpen && activoSeleccionado && (
                    <EspecificacionesModal
                        isOpen={especificacionesModalOpen}
                        onClose={() => setEspecificacionesModalOpen(false)}
                        activo={activoSeleccionado}
                        onEspecificacionesGuardadas={onEspecificacionesGuardadas} // Usamos la función centralizada
                    />
                )}




            </Container>
            <Footer />
        </>
    );
};

export default CrearMantenimiento;