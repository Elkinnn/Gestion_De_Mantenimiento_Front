import React, { useState } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
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
        codigo: '',
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
        const emptyFields = Object.keys(formData).filter((key) => !formData[key].trim());
        if (emptyFields.length > 0) {
            showErrorNotification('Por favor, completa todos los campos.');
            return;
        }

        // Simular guardar el activo
        showSuccessNotification('Activo guardado con éxito.');

        // Reiniciar el formulario
        setFormData({
            proceso_compra: '',
            codigo: '',
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
                        <Input
                            type="text"
                            name="proceso_compra"
                            value={formData.proceso_compra}
                            onChange={handleChange}
                            placeholder="Ingrese el proceso de compra"
                        />

                        <Label>Código</Label>
                        <Input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            placeholder="Ingrese el código"
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
                        <Input
                            type="text"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            placeholder="Ingrese el estado"
                        />

                        <Label>Ubicación</Label>
                        <Input
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            placeholder="Ingrese la ubicación"
                        />

                        <Label>Tipo</Label>
                        <Input
                            type="text"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            placeholder="Ingrese el tipo"
                        />

                        <Label>Proveedor</Label>
                        <Input
                            type="text"
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            placeholder="Ingrese el proveedor"
                        />

                        <ActionButton type="submit">Guardar Activo</ActionButton>
                    </form>
                </FormCard>
            </Container>
            <Footer />
        </>
    );
};

export default CrearActivos;