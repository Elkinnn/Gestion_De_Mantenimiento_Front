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

// Sección para el nombre y rol
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  padding-right: 50px; // Espacio a la derecha
  font-size: 16px;
`;

// Nombre del usuario y rol
const UserName = styled.div`
  font-weight: bold;
`;

const UserRole = styled.div`
  font-size: 14px;
`;

const Navbar = ({ title }) => {
  // Obtener el nombre y rol desde el localStorage
  const userName = localStorage.getItem('userName') || 'No disponible'; // Deberías asegurarte de que esto se establezca correctamente
  const userRole = localStorage.getItem('role') || 'No definido';

  return (
    <NavbarContainer>
      <Title>{title}</Title>
      <UserInfo>
        <UserName>{userName}</UserName>
        <UserRole>{userRole}</UserRole>
      </UserInfo>
    </NavbarContainer>
  );
};

export default Navbar;
