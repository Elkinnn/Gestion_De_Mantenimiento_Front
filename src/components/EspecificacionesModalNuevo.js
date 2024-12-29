import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api/api';
import { showSuccessNotification, showErrorNotification, showInfoNotification } from './Notification';


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
  margin-top: 50px; /* Ajusta el margen superior */
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

const Section = styled.div`
  margin-bottom: 15px;
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

  th {
    pointer-events: none; /* Esto evita cambios al pasar el cursor */
    background-color: #007bff; /* Color fijo */
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #e9ecef; /* Esto aplica solo a las filas del cuerpo */
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

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 10px;
  font-size: 14px;
  resize: none;
  height: 100px; /* Ajusta el tamaño vertical */
  width: 96.5%; /* Ajusta el tamaño horizontal */
`;

const EspecificacionesModalNuevo = ({ isOpen, onClose, activo, mantenimientoId, onGuardarEspecificaciones }) => {
    const [actividadesRealizadas, setActividadesRealizadas] = useState([]);
    const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
    const [componentesUtilizados, setComponentesUtilizados] = useState([]);
    const [componentesDisponibles, setComponentesDisponibles] = useState([]);
    const [observaciones, setObservaciones] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Controla el estado de guardado
    const [especificacionesTemporales, setEspecificacionesTemporales] = useState({});

    useEffect(() => {

        if (activo && mantenimientoId) {
            fetchEspecificaciones(mantenimientoId, activo.activo_id);
        }
    }, [activo, mantenimientoId]);

    const fetchEspecificaciones = async (mantenimientoId, activoId) => {
        const especificacionesGuardadas = especificacionesTemporales[activo.codigo];
        if (especificacionesGuardadas) {
          console.log("Cargando especificaciones temporales:", especificacionesGuardadas);
          setActividadesRealizadas(especificacionesGuardadas.actividades || []);
          setComponentesUtilizados(especificacionesGuardadas.componentes || []);
          setObservaciones(especificacionesGuardadas.observaciones || '');
          return; // Evitamos cargar desde el backend si ya hay datos temporales
        }
      
        // Si no hay activoId, inicializa datos vacíos para un nuevo activo
        if (!activoId) {
          console.log("Activo nuevo, inicializando especificaciones vacías.");
          await fetchEspecificacionesNuevo(activo); // Llama a la función para inicializar activos nuevos
          return; // Salimos porque no necesitamos consultar al backend
        }
      
        try {
          // Si no hay activoId, inicializa datos vacíos para un nuevo activo
          if (!activoId) {
            console.log("Activo nuevo, inicializando especificaciones vacías.");
            setActividadesDisponibles([]);
            setComponentesDisponibles([]);
            setActividadesRealizadas([]);
            setComponentesUtilizados([]);
            setObservaciones('');
            return;
          }
      
          console.log("Inicio de fetchEspecificaciones");
      
          // Obtener especificaciones originales desde el backend
          const response = await api.get('/mantenimientos/actividades-del-activo', {
            params: { mantenimiento_id: mantenimientoId, activo_id: activoId },
          });
      
          console.log("Especificaciones originales desde backend:", response.data);
      
          // Obtener especificaciones temporales si existen
          const tempEspecificaciones = especificacionesTemporales[activo.codigo] || {
            actividades: [],
            componentes: [],
            observaciones: '',
          };
      
          console.log("Especificaciones temporales locales:", tempEspecificaciones);
      
          // --- Ajuste en la forma de combinar actividades ---
          const backendActividades = response.data.actividades_realizadas || [];
          const tempActividades = tempEspecificaciones.actividades || [];
      
          // Copiamos primero las de backend
          const actividadesCombinadas = [...backendActividades];
          // Agregamos solo las que no existan ya
          tempActividades.forEach((actTmp) => {
            const existe = actividadesCombinadas.some(
              (a) => a.actividad_id === actTmp.actividad_id
            );
            if (!existe) {
              actividadesCombinadas.push(actTmp);
            }
          });
          console.log("Actividades combinadas finales:", actividadesCombinadas);
      
          // --- Ajuste en la forma de combinar componentes ---
          const backendComponentes = response.data.componentes_utilizados || [];
          const tempComponentes = tempEspecificaciones.componentes || [];
      
          const componentesCombinados = [...backendComponentes];
          tempComponentes.forEach((compTmp) => {
            const existe = componentesCombinados.some(
              (c) => c.componente_id === compTmp.componente_id
            );
            if (!existe) {
              componentesCombinados.push(compTmp);
            }
          });
          console.log("Componentes combinados finales:", componentesCombinados);
      
          // Combinar observaciones (las temporales prevalecen si existen)
          const observacionCombinada =
            tempEspecificaciones.observaciones || response.data.observacion || '';
      
          console.log("Observaciones combinadas:", observacionCombinada);
      
          // Actualizar estados en el modal
          setActividadesRealizadas(actividadesCombinadas);
          setComponentesUtilizados(componentesCombinados);
          setObservaciones(observacionCombinada);
      
          console.log("Estados actualizados en el modal");
      
          // Actualizar las listas disponibles
          setActividadesDisponibles(response.data.actividades_disponibles || []);
          setComponentesDisponibles(response.data.componentes_disponibles || []);
      
          console.log("Listas disponibles actualizadas");
      
          // Actualizar especificaciones temporales (para persistir cambios locales)
          setEspecificacionesTemporales((prev) => ({
            ...prev,
            [activo.codigo]: {
              actividades: actividadesCombinadas,
              componentes: componentesCombinados,
              observaciones: observacionCombinada,
            },
          }));
      
          console.log("Especificaciones temporales actualizadas correctamente");
        } catch (error) {
          console.error('Error al obtener las especificaciones del activo:', error);
          showErrorNotification('Error al obtener las especificaciones del activo.');
        }
      };
      


    const handleObservacionesChange = (e) => {
        const nuevaObservacion = e.target.value;
        setObservaciones(nuevaObservacion);

        setEspecificacionesTemporales((prev) => ({
            ...prev,
            [activo.codigo]: {
                ...prev[activo.codigo],
                observaciones: nuevaObservacion,
            },
        }));
    };



    const fetchEspecificacionesNuevo = async (activo) => {
        try {
            console.log("Cargando especificaciones para un nuevo activo:", activo);

            if (!activo.tipo_activo_id) {
                showErrorNotification("El activo no tiene un tipo definido.");
                return;
            }

            // Llamar al backend para obtener actividades y componentes disponibles
            const [actividadesResponse, componentesResponse] = await Promise.all([
                api.get(`/especificaciones/actividades?tipo_activo_id=${activo.tipo_activo_id}`),
                api.get(`/especificaciones/componentes?tipo_activo_id=${activo.tipo_activo_id}`),
            ]);

            console.log("Actividades disponibles para el nuevo activo:", actividadesResponse.data);
            console.log("Componentes disponibles para el nuevo activo:", componentesResponse.data);

            // Configurar datos iniciales para nuevos activos
            const especificacionesIniciales = {
                actividades: [],
                componentes: [],
                observaciones: "",
            };

            // Actualizar estados
            setActividadesRealizadas(especificacionesIniciales.actividades);
            setComponentesUtilizados(especificacionesIniciales.componentes);
            setObservaciones(especificacionesIniciales.observaciones);

            // Establecer actividades y componentes disponibles
            setActividadesDisponibles(actividadesResponse.data || []);
            setComponentesDisponibles(componentesResponse.data || []);

            // Guardar en especificaciones temporales
            setEspecificacionesTemporales((prev) => ({
                ...prev,
                [activo.codigo]: especificacionesIniciales,
            }));

            console.log("Especificaciones inicializadas correctamente para el nuevo activo.");
        } catch (error) {
            console.error("Error al inicializar especificaciones para un nuevo activo:", error);
            showErrorNotification("Error al inicializar las especificaciones del nuevo activo.");
        }
    };


















    const agregarActividad = (actividad) => {
        console.log("Estado actual - actividadesRealizadas:", actividadesRealizadas);
        console.log("Estado actual - actividad agregada:", actividad);

        // Verificación para activos cargados desde BD
        if (activo?.activo_id) {
            if (
                actividadesRealizadas.some(
                    (a) =>
                        a.actividad_id === actividad.actividad_id ||
                        a.nombre_actividad === actividad.actividad_disponible
                )
            ) {
                console.log("La actividad ya está registrada en un activo de la BD.");
                showInfoNotification(`La actividad "${actividad.nombre || actividad.actividad_disponible}" ya está registrada en este activo.`);
                return; // Evitar duplicados para activos de BD
            }
        } else {
            // Verificación para nuevos activos
            if (
                actividadesRealizadas.some(
                    (a) =>
                        a.actividad_id === actividad.id ||
                        a.nombre_actividad === actividad.actividad_disponible
                )
            ) {
                console.log("La actividad ya fue agregada en un nuevo activo.");
                showInfoNotification(`La actividad "${actividad.nombre || actividad.actividad_disponible}" ya fue agregada.`);
                return; // Evitar duplicados para nuevos activos
            }
        }

        // Agregar actividad
        const nuevasActividades = [
            ...actividadesRealizadas,
            {
                actividad_id: actividad.actividad_id || actividad.id,
                nombre_actividad: actividad.nombre || actividad.actividad_disponible,
            },
        ];

        setActividadesRealizadas(nuevasActividades);

        // Actualizar especificaciones temporales
        setEspecificacionesTemporales((prev) => ({
            ...prev,
            [activo.codigo]: {
                ...prev[activo.codigo],
                actividades: nuevasActividades,
            },
        }));

        showSuccessNotification(`Actividad "${actividad.nombre || actividad.actividad_disponible}" agregada correctamente.`);
    };

    const agregarComponente = (componente) => {
        console.log("Estado actual - componentesUtilizados:", componentesUtilizados);
        console.log("Estado actual - componente agregado:", componente);

        // Verificación para activos cargados desde BD
        if (activo?.activo_id) {
            if (
                componentesUtilizados.some(
                    (c) =>
                        c.componente_id === componente.componente_id ||
                        c.componente_utilizado === componente.componente_disponible
                )
            ) {
                console.log("El componente ya está registrado en un activo de la BD.");
                showInfoNotification(`El componente "${componente.nombre || componente.componente_disponible}" ya está registrado en este activo.`);
                return; // Evitar duplicados para activos de BD
            }
        } else {
            // Verificación para nuevos activos
            if (
                componentesUtilizados.some(
                    (c) =>
                        c.componente_id === componente.id ||
                        c.componente_utilizado === componente.componente_disponible
                )
            ) {
                console.log("El componente ya fue agregado en un nuevo activo.");
                showInfoNotification(`El componente "${componente.nombre || componente.componente_disponible}" ya fue agregado.`);
                return; // Evitar duplicados para nuevos activos
            }
        }

        // Agregar componente
        const nuevosComponentes = [
            ...componentesUtilizados,
            {
                componente_id: componente.componente_id || componente.id,
                componente_utilizado: componente.nombre || componente.componente_disponible,
            },
        ];

        setComponentesUtilizados(nuevosComponentes);

        // Actualizar especificaciones temporales
        setEspecificacionesTemporales((prev) => ({
            ...prev,
            [activo.codigo]: {
                ...prev[activo.codigo],
                componentes: nuevosComponentes,
            },
        }));

        showSuccessNotification(`Componente "${componente.nombre || componente.componente_disponible}" agregado correctamente.`);
    };




    const handleCloseModal = () => {
        setEspecificacionesTemporales((prev) => ({
            ...prev,
            [activo.codigo]: {
                actividades: actividadesRealizadas,
                componentes: componentesUtilizados,
                observaciones,
            },
        }));
        onClose(); // Llama a la función existente para cerrar el modal
    };
    







    const handleGuardar = () => {
        if (isSaving) return; // Evita múltiples clics mientras guarda

        // Filtrar actividades y componentes válidos
        const actividadesValidas = actividadesRealizadas.filter((actividad) => actividad.actividad_id);
        const componentesValidos = componentesUtilizados.filter((componente) => componente.componente_id);

        if (!actividadesValidas.length && !componentesValidos.length && !observaciones) {
            showErrorNotification('Debe agregar al menos una actividad válida, un componente válido o una observación antes de guardar.');
            return;
        }

        setIsSaving(true);

        const especificaciones = {
            actividades: actividadesValidas,
            componentes: componentesValidos,
            observaciones,
        };

        if (JSON.stringify(especificaciones) === JSON.stringify(activo.especificaciones)) {
            showInfoNotification('No se realizaron cambios en las especificaciones.');
            setIsSaving(false);
            return;
        }

        // Actualizar especificaciones temporales independientemente de si el activo es nuevo o de la BD
        setEspecificacionesTemporales((prevEspecificaciones) => ({
            ...prevEspecificaciones,
            [activo.codigo]: especificaciones,
        }));
        console.log('Especificaciones temporales guardadas:', especificaciones);

        // Sincronizar con el componente padre
        if (onGuardarEspecificaciones) {
            onGuardarEspecificaciones(activo, especificaciones);
        }

        setTimeout(() => {
            console.log('Especificaciones guardadas:', especificaciones);
            showSuccessNotification('Especificaciones guardadas con éxito.');
            setIsSaving(false);
            onClose(); // Cierra el modal después de guardar
        }, 1500);
    };
















    return (
        <ModalContainer $isOpen={isOpen}>
            <ModalContent>
                <Header>
                    <span>Especificaciones para {activo?.nombre || 'Activo no definido'}</span>
                    <CloseButton onClick={handleCloseModal}>&times;</CloseButton>

                </Header>

                {/* Actividades Disponibles */}
                <SectionTitle>Actividades Disponibles</SectionTitle>
                <ScrollableTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Actividad</TableHeader>
                                <TableHeader>Acción</TableHeader>
                            </TableRow>
                        </TableHead>
                        <tbody>
                            {actividadesDisponibles.length > 0 ? (
                                actividadesDisponibles.map((actividad, index) => (
                                    <TableRow key={`actividad-disponible-${actividad.actividad_id}-${index}`}>
                                        <TableData>{actividad.nombre || actividad.actividad_disponible || 'Nombre no disponible'}</TableData>

                                        <TableData>
                                            <Button onClick={() => agregarActividad(actividad)}>Agregar</Button>
                                        </TableData>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableData colSpan="2">No hay actividades disponibles</TableData>
                                </TableRow>
                            )}
                        </tbody>
                    </Table>
                </ScrollableTableContainer>

                {/* Actividades Realizadas */}
                <Section>
                    <SectionTitle>Actividades Realizadas</SectionTitle>
                    <ScrollableTableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Actividad</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {actividadesRealizadas.length > 0 ? (
                                    actividadesRealizadas.map((actividad, index) => (
                                        <TableRow key={`actividad-realizada-${actividad.actividad_id}-${index}`}>
                                            <TableData>{actividad.nombre_actividad || actividad.nombre || 'Nombre no disponible'}</TableData>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableData colSpan="1">No hay actividades realizadas</TableData>
                                    </TableRow>
                                )}
                            </tbody>
                        </Table>
                    </ScrollableTableContainer>
                </Section>

                {/* Componentes Disponibles */}
                <Section>
                    <SectionTitle>Componentes Disponibles</SectionTitle>
                    <ScrollableTableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Componente</TableHeader>
                                    <TableHeader>Acción</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {componentesDisponibles.length > 0 ? (
                                    componentesDisponibles.map((componente, index) => (
                                        <TableRow key={`componente-disponible-${componente.componente_id || index}`}>
                                            <TableData>{componente.nombre || componente.componente_disponible || 'Nombre no disponible'}</TableData>
                                            <TableData>
                                                <Button onClick={() => agregarComponente(componente)}>Agregar</Button>
                                            </TableData>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableData colSpan="2">No hay componentes disponibles</TableData>
                                    </TableRow>
                                )}
                            </tbody>

                        </Table>
                    </ScrollableTableContainer>
                </Section>

                {/* Componentes Utilizados */}
                <Section>
                    <SectionTitle>Componentes Utilizados</SectionTitle>
                    <ScrollableTableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Componente</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {componentesUtilizados.length > 0 ? (
                                    componentesUtilizados.map((componente, index) => (
                                        <TableRow key={`componente-utilizado-${componente.componente_id}-${index}`}>
                                            <TableData>{componente.componente_utilizado}</TableData>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableData colSpan="1">No hay componentes utilizados</TableData>
                                    </TableRow>
                                )}
                            </tbody>
                        </Table>
                    </ScrollableTableContainer>
                </Section>

                {/* Observación */}
                <Section>
                    <SectionTitle>Observación</SectionTitle>
                    <ScrollableTableContainer>
                        <Table>
                            <tbody>
                                <TableRow>
                                    <TableData>
                                        <Input
                                            placeholder="Escriba aquí las observaciones..."
                                            value={observaciones}
                                            onChange={handleObservacionesChange}
                                        />
                                    </TableData>
                                </TableRow>
                            </tbody>
                        </Table>
                    </ScrollableTableContainer>
                </Section>

                <Button onClick={handleGuardar} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>

            </ModalContent>
        </ModalContainer>
    );
};

export default EspecificacionesModalNuevo;