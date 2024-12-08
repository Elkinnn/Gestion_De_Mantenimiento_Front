import React from 'react';
import styled from 'styled-components';

// Estilos para la barra superior
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #007bff;  // Color original del navbar (azul)
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
`;

// Título de la barra superior
const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  padding-left: 50px;  // Esto moverá el título más a la derecha
`;

const Navbar = ({ title }) => {
  return (
    <NavbarContainer>
      <Title>{title}</Title>
    </NavbarContainer>
  );
};

export default Navbar;
