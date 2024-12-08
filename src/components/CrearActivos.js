import React, { useState } from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';
import BackButton from './BackButton';
import { showSuccessNotification, showErrorNotification } from './Notification';

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

const CrearActivos = () => {
    const [formData, setFormData] = useState({
        proceso_compra: '',
        codigo: 'AUTO_GENERADO', // El código está bloqueado por defecto
        nombre: '',
        estado: '',
        ubicacion: '',
        tipo: '',
        proveedor: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        const emptyFields = Object.keys(formData).filter(
            (key) => key !== 'codigo' && !formData[key].trim()
        );
        if (emptyFields.length > 0) {
            showErrorNotification('Por favor, completa todos los campos.');
            return;
        }

        // Simular guardar el activo
        showSuccessNotification('Activo guardado con éxito.');

        // Reiniciar el formulario
        setFormData({
            proceso_compra: '',
            codigo: 'AUTO_GENERADO',
            nombre: '',
            estado: '',
            ubicacion: '',
            tipo: '',
            proveedor: '',
        });
    };

    return (
        <>
            <Navbar title="Gestión de Activos" />
            <BackButton />
            <Container>
                <FormCard>
                    <FormTitle>Nuevo Activo</FormTitle>
                    <form onSubmit={handleSubmit}>
                        <Label>Proceso de Compra</Label>
                        <Select
                            name="proceso_compra"
                            value={formData.proceso_compra}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el proceso de compra</option>
                            {/* Opciones dinámicas vendrán de la base de datos */}
                        </Select>

                        <Label>Código</Label>
                        <Input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            disabled // Código bloqueado para edición
                        />

                        <Label>Nombre</Label>
                        <Input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del activo"
                        />

                        <Label>Estado</Label>
                        <Select name="estado" value={formData.estado} onChange={handleChange}>
                            <option value="">Selecciona el estado</option>
                            {/* Opciones dinámicas vendrán de la base de datos */}
                        </Select>

                        <Label>Ubicación</Label>
                        <Select
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona la ubicación</option>
                            {/* Opciones dinámicas vendrán de la base de datos */}
                        </Select>

                        <Label>Tipo</Label>
                        <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                            <option value="">Selecciona el tipo</option>
                            {/* Opciones dinámicas vendrán de la base de datos */}
                        </Select>

                        <Label>Proveedor</Label>
                        <Select
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el proveedor</option>
                            {/* Opciones dinámicas vendrán de la base de datos */}
                        </Select>

                        <ActionButton type="submit">Guardar Activo</ActionButton>
                    </form>
                </FormCard>
            </Container>
            <Footer />
        </>
    );
};

export default CrearActivos;
