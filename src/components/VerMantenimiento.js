import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import EspecificacionesModalNuevo from './EspecificacionesModalNuevo';
import { showSuccessNotification, showErrorNotification, showInfoNotification } from './Notification';

import Modal from './Modal';
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
  padding: 10px 15px; /* Ajusta el espacio interno */
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  text-align: center; /* Centra el texto */
  line-height: 1.2; /* Ajusta el espacio entre líneas */
  white-space: normal; /* Permite que el texto se divida en varias líneas */
  word-break: break-word; /* Permite dividir las palabras largas */
  display: block; /* Asegura el centrado vertical del contenido */

  &:hover {
    background-color: #218838; /* Cambia el color al pasar el cursor */
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
  text-align: center;
  max-width: 200px; /* Limita el ancho del botón */

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
  const [isAgregarActivoModalOpen, setIsAgregarActivoModalOpen] = useState(false);
  const [activos, setActivos] = useState([]); // Todos los activos disponibles
  const [activosSeleccionados, setActivosSeleccionados] = useState([]);

  const [isFechaFinEnabled, setIsFechaFinEnabled] = useState(false);
  const [fechaFinOriginal, setFechaFinOriginal] = useState('');


  useEffect(() => {
    if (mantenimientoId) {
      fetchMantenimientoData(mantenimientoId);
    }
  }, [mantenimientoId]);

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const response = await api.get('/activos'); // Ajusta el endpoint si es necesario
        setActivos(response.data);
      } catch (error) {
        console.error('Error al cargar activos:', error);
      }
    };

    fetchActivos();
  }, []);

  const fetchMantenimientoData = async (id) => {
    try {
      const response = await api.get(`/mantenimientos/${id}`);
      setMantenimiento(response.data);
      setFechaFinOriginal(response.data.fecha_fin);
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

    // Verifica si el activo es nuevo (sin activo_id)
    const esNuevoActivo = !activo.activo_id;

    // Si es nuevo, inicializa especificaciones vacías
    if (esNuevoActivo) {
      setActivoSeleccionado({
        ...activo,
        especificaciones: {
          actividades_realizadas: [],
          componentes_utilizados: [],
          observaciones: '',
        },
      });
    } else {
      // Si el activo ya existe, pasa directamente
      setActivoSeleccionado(activo);
    }

    setIsModalOpen(true);
  };


  if (isLoading) {
    return <p>Cargando datos...</p>;
  }


  const handleOpenAgregarActivoModal = () => {
    setIsAgregarActivoModalOpen(true);
  };

  const handleCloseAgregarActivoModal = () => {
    setIsAgregarActivoModalOpen(false);
  };

  const handleAgregarActivo = (activo) => {
    // Combina activos del mantenimiento original y los seleccionados
    const activosTotales = [...(mantenimiento.activos || []), ...activosSeleccionados];

    // Verifica si el activo ya existe en la lista
    const existe = activosTotales.some((a) => a.codigo === activo.codigo);

    if (existe) {
      showInfoNotification('El activo ya está agregado.');
    } else {
      setActivosSeleccionados([...activosSeleccionados, activo]);
      showSuccessNotification('Activo agregado correctamente.');

      setIsFechaFinEnabled(true);
    }

    handleCloseAgregarActivoModal();
  };

  const handleFechaFinChange = (value) => {
    const nuevaFechaFin = new Date(value); // Fecha seleccionada por el usuario
    const fechaOriginal = new Date(fechaFinOriginal); // Fecha original registrada
  
    // Permitir regresar a la fecha original
    if (nuevaFechaFin.getTime() === fechaOriginal.getTime()) {
      setMantenimiento((prev) => ({
        ...prev,
        fecha_fin: value,
      }));
      return;
    }
  
    // Validar que la nueva fecha no sea inferior a la fecha original
    if (nuevaFechaFin < fechaOriginal) {
      showErrorNotification(
        'La fecha de fin no puede ser anterior a la fecha original registrada.'
      );
      return;
    }
  
    // Actualizar la fecha de fin para fechas válidas
    setMantenimiento((prev) => ({
      ...prev,
      fecha_fin: value,
    }));
  };
  
  
  
  
  const handleGuardarMantenimiento = async () => {
    try {
        // Validación: Asegurarse de que los datos requeridos estén completos
        if (!mantenimiento.estado || !mantenimiento.fecha_fin) {
            showErrorNotification('El estado y la fecha de fin son obligatorios.');
            return;
        }

        // Consolidar los activos seleccionados
        const activosFinales = (mantenimiento.activos || []).concat(activosSeleccionados);

        if (!activosFinales.length) {
          showErrorNotification('Debe agregar al menos un activo.');
          return;
      }
        // Filtrar los activos que tienen un activo_id válido
        const activosValidos = activosFinales.filter((activo) => {
            if (!activo.codigo || !activo.nombre) {
                console.error('Datos incompletos en el activo:', activo);
                showErrorNotification('Uno o más activos tienen información incompleta.');
                return false;
            }
            return activo.activo_id;
        });

        // Verificar si hay activos no válidos
        if (activosFinales.length !== activosValidos.length) {
            console.error('Algunos activos no tienen un activo_id válido:', activosFinales.filter((activo) => !activo.activo_id));
            showErrorNotification('Uno o más activos no tienen un ID válido.');
            return;
        }
        // Preparar el payload para el backend
        const payload = {
            estado: mantenimiento.estado,
            fecha_fin: mantenimiento.fecha_fin,
            activos: activosValidos.map((activo) => ({
                activo_id: activo.activo_id,
                codigo: activo.codigo,
                nombre: activo.nombre,
                especificaciones: activo.especificaciones || {
                    actividades: activo.especificaciones?.actividades || [],
                    componentes: activo.especificaciones?.componentes || [],
                    observaciones: activo.especificaciones?.observaciones || '',
                },
            })),
        };

        console.log('Payload que se envía al backend:', JSON.stringify(payload, null, 2));

        // Llamada al backend
        const response = await api.put(`/mantenimientos/${mantenimiento.mantenimiento_id}`, payload);

        if (response.status === 200) {
            showSuccessNotification('Mantenimiento guardado correctamente.');
            setMantenimiento(response.data); // Actualizar el estado con los datos más recientes
        } else {
            showErrorNotification('Hubo un problema al guardar el mantenimiento.');
        }
    } catch (error) {
        console.error('Error al guardar el mantenimiento:', error);
        showErrorNotification('Error al guardar el mantenimiento. Por favor, inténtalo de nuevo.');
    }
};


  
  
  const handleGuardarEspecificaciones = (activo, especificaciones) => {
    setMantenimiento((prev) => ({
        ...prev,
        activos: prev.activos.map((a) =>
            a.codigo === activo.codigo ? { ...a, especificaciones } : a
        ),
    }));

    setActivosSeleccionados((prev) =>
        prev.map((a) =>
            a.codigo === activo.codigo ? { ...a, especificaciones } : a
        )
    );
};


  
  
  



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
                <Input
                  type="date"
                  value={mantenimiento.fecha_fin?.split('T')[0] || ''}
                  onChange={(e) => handleFechaFinChange(e.target.value)}
                  disabled={!isFechaFinEnabled}
                />
              </FormGroup>


              <FormGroup>
                <Label style={{ marginBottom: '10px' }}>Estado:</Label>
                <Input type="text" value={mantenimiento.estado || ''} readOnly />

                {/* Botón Agregar Activo debajo de Estado */}
                <Label style={{ marginTop: '20px', marginBottom: '10px' }}>Agregar Activo:</Label>
                <Button
                  type="button"
                  onClick={handleOpenAgregarActivoModal}
                  style={{
                    padding: '10px 15px',
                    textAlign: 'center',
                  }}
                >
                  Abrir Lista de Activos
                </Button>
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
                {(mantenimiento.activos?.concat(activosSeleccionados) || []).length > 0 ? (
                  mantenimiento.activos.concat(activosSeleccionados).map((activo, index) => (
                    <TableRow key={activo.activo_id || activo.codigo} $isEven={index % 2 === 0}>
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
          <Button
  type="button"
  onClick={handleGuardarMantenimiento}
  style={{ marginTop: '20px' }}
>
  Guardar Mantenimiento
</Button>
        </FormWrapper>

      </Container>
      {isAgregarActivoModalOpen && (
        <Modal
          isOpen={isAgregarActivoModalOpen}
          onClose={handleCloseAgregarActivoModal}
          onAgregarActivo={handleAgregarActivo}
          activos={activos}
        />
      )}
      <EspecificacionesModalNuevo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activo={activoSeleccionado}
        mantenimientoId={mantenimiento?.mantenimiento_id}
        onGuardarEspecificaciones={handleGuardarEspecificaciones}
      />
    </>
  );
};

export default VerMantenimiento;
