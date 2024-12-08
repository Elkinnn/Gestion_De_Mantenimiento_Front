import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

// Estilo del contenedor principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 80px 20px 20px; // Espacio para el navbar y el footer
  max-width: 800px;
  min-height: 100vh;
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
`;

// Estilo del título
const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
`;

// Estilo de las opciones de radio
const RadioGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

// Estilo para cada opción de radio
const RadioLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  display: flex;
  align-items: center;
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
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const GestionActivo = () => {
  const [option, setOption] = useState('ingresar');

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  const handleAction = () => {
    if (option === 'ingresar') {
      alert('Redirigiendo a la página para ingresar un activo...');
      // Redirigir a la página correspondiente
      window.location.href = '/activos/crear';
    } else {
      alert('Redirigiendo a la página para cargar activos por lote...');
      // Redirigir a la página correspondiente
      window.location.href = '/activos/cargar-lote';
    }
  };

  return (
    <>
      <Navbar title="Gestión de Activos" />
      <Container>
        <FormCard>
          <FormTitle>Nuevo Activo</FormTitle>
          <p>¿Qué desea hacer?</p>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="action"
                value="ingresar"
                checked={option === 'ingresar'}
                onChange={handleOptionChange}
              />
              Ingresar un activo
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="action"
                value="cargar"
                checked={option === 'cargar'}
                onChange={handleOptionChange}
              />
              Cargar activos por lote
            </RadioLabel>
          </RadioGroup>
          <ActionButton onClick={handleAction}>
            Continuar
          </ActionButton>
        </FormCard>
      </Container>
      <Footer />
    </>
  );
};

export default GestionActivo;
