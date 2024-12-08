import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';
import BackButton from './BackButton';
import { showSuccessNotification, showErrorNotification } from './Notification';
import api from '../api/api';

// Estilo del contenedor principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 80px 20px 20px;
  max-width: 800px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
  align-items: center;
`;

// Estilo de la tarjeta del formulario
const FormCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }
`;

// Estilo del título del formulario
const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
`;

// Estilo para las etiquetas
const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 5px;
  text-align: left;
`;

// Estilo para los campos de entrada
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

// Estilo del botón de acción
const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  &:hover {
    background-color: #0056b3;
  }
`;

const CrearActivos = ({ initialData = {}, onSuccess }) => {
    const [formData, setFormData] = useState({
        proceso_compra: initialData.proceso_compra || '',
        codigo: initialData.codigo || '',
        nombre: initialData.nombre || '',
        estado: initialData.estado || '',
        ubicacion_id: initialData.ubicacion_id || '',
        tipo_activo_id: initialData.tipo_activo_id || '',
        proveedor_id: initialData.proveedor_id || '',
    });

    const [procesosCompra, setProcesosCompra] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [estados, setEstados] = useState([]);

    // Cargar datos dinámicos al cargar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Obtener datos del backend
                const procesosCompra = await api.get('/activos/combo/procesos_compra');
                const codigo = await api.get('/activos/codigo');
                const ubicaciones = await api.get('/activos/combo/ubicaciones');
                const tipos = await api.get('/activos/combo/tipos_activos');
                const proveedores = await api.get('/activos/combo/proveedores');
                const estados = await api.get('/activos/combo/estados');

                // Asignar datos a los estados
                setProcesosCompra(procesosCompra.data);
                setFormData((prev) => ({
                    ...prev,
                    codigo: initialData.codigo || codigo.data.codigo || 'COD-001',
                }));
                setUbicaciones(ubicaciones.data);
                setTipos(tipos.data);
                setProveedores(proveedores.data);
                setEstados(estados.data);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        cargarDatos();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        const emptyFields = Object.keys(formData).filter(
            (key) => key !== 'codigo' && !formData[key]?.trim()
        );
        if (emptyFields.length > 0) {
            showErrorNotification('Por favor, completa todos los campos.');
            return;
        }

        try {
            // Determinar si es creación o edición
            const url = initialData.id ? `/activos/${initialData.id}` : '/activos';
            const method = initialData.id ? 'put' : 'post';

            // Enviar datos al backend
            await api[method](url, formData);

            showSuccessNotification(
                initialData.id ? 'Activo actualizado con éxito.' : 'Activo creado con éxito.'
            );

            if (onSuccess) onSuccess(); // Llamar a función de éxito (si existe)
        } catch (error) {
            showErrorNotification('Error al guardar el activo.');
            console.error('Error al guardar el activo:', error.response || error.message);
        }
    };

    return (
        <>
            <Navbar title={initialData.id ? 'Editar Activo' : 'Crear Activo'} />
            <BackButton />
            <Container>
                <FormCard>
                    <FormTitle>{initialData.id ? 'Editar Activo' : 'Nuevo Activo'}</FormTitle>
                    <form onSubmit={handleSubmit}>
                        <Label>Proceso de Compra</Label>
                        <Select
                            name="proceso_compra"
                            value={formData.proceso_compra}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el proceso de compra</option>
                            {procesosCompra.map((proceso) => (
                                <option key={proceso.nombre} value={proceso.nombre}>
                                    {proceso.nombre}
                                </option>
                            ))}
                        </Select>

                        <Label>Código</Label>
                        <Input type="text" value={formData.codigo} disabled />

                        <Label>Tipo</Label>
                        <Select
                            name="tipo_activo_id"
                            value={formData.tipo_activo_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el tipo</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </Select>

                        <Label>Nombre</Label>
                        <Input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del activo"
                        />

                        <Label>Estado</Label>
                        <Select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el estado</option>
                            {estados.map((estado) => (
                                <option key={estado.nombre} value={estado.nombre}>
                                    {estado.nombre}
                                </option>
                            ))}
                        </Select>

                        <Label>Ubicación</Label>
                        <Select
                            name="ubicacion_id"
                            value={formData.ubicacion_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona la ubicación</option>
                            {ubicaciones.map((ubicacion) => (
                                <option key={ubicacion.id} value={ubicacion.id}>
                                    {ubicacion.nombre}
                                </option>
                            ))}
                        </Select>

                        <Label>Proveedor</Label>
                        <Select
                            name="proveedor_id"
                            value={formData.proveedor_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </Select>

                        <ActionButton type="submit">
                            {initialData.id ? 'Actualizar Activo' : 'Guardar Activo'}
                        </ActionButton>
                    </form>
                </FormCard>
            </Container>
            <Footer />
        </>
    );
};

export default CrearActivos;
