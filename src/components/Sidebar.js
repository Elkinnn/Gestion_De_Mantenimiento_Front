import React from 'react';
import styled from 'styled-components';

// Contenedor de la barra lateral
const SidebarContainer = styled.div`
  width: ${(props) => (props.open ? '200px' : '0')};
  background-color: #003366;
  color: white;
  height: 100vh;  // Asegura que ocupe todo el alto de la ventana
  position: fixed;
  top: 60px;  // Barra lateral comienza justo debajo de la barra superior
  left: 0;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
  overflow: hidden;  // Evita que el contenido se desborde
  padding-top: 20px;  // Espacio superior para los elementos de la barra lateral
`;

// Contenedor del botón de hamburguesa
const HamburgerButton = styled.div`
  position: fixed;
  top: 20px;  // Posición original de la hamburguesa (arriba)
  left: 20px;
  cursor: pointer;
  font-size: 30px;
  color: white;
  z-index: 1100;
  transition: left 0.3s ease;
`;

// Elementos del menú
const MenuItem = styled.div`
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  &:hover {
    background-color: #005f87;
    border-radius: 5px;
  }
`;

const Sidebar = ({ open, toggleSidebar }) => {
  return (
    <>
      <SidebarContainer open={open}>
        <MenuItem>Nuevo</MenuItem>
        <MenuItem>Editar</MenuItem>
        <MenuItem>Mantenimiento</MenuItem>
        <MenuItem>Reportes de Gestión</MenuItem>
      </SidebarContainer>
      <HamburgerButton onClick={toggleSidebar}>
        ☰
      </HamburgerButton>
    </>
  );
};

export default Sidebar;
