import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { showInfoNotification } from './Notification';

const SidebarContainer = styled.div`
  width: ${(props) => (props.open ? '200px' : '0')};
  background-color: #003366;
  color: white;
  height: 100vh;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
  overflow: hidden;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* El contenido empieza desde arriba */
`;

const HamburgerButton = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  cursor: pointer;
  font-size: 30px;
  color: white;
  z-index: 1100;
  transition: left 0.3s ease;
`;

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

const Sidebar = ({ open, toggleSidebar, selectedActivo, currentMenu }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Obtenemos el rol del usuario

  const handleEdit = () => {
    if (!selectedActivo) {
      showInfoNotification('Debes seleccionar un activo para editar.');
      return;
    }
    navigate(`/editar/${selectedActivo}`);
  };

  const handleMaintenance = () => {
    navigate('/mantenimientos'); // Redirige directamente al nuevo componente
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <>
      <SidebarContainer open={open}>
        {role === 'Admin' && currentMenu === 'activos' && (
          <>
            <MenuItem onClick={() => navigate('/crear')}>Nuevo</MenuItem>
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleMaintenance}>Mantenimiento</MenuItem>
          </>
        )}
        {role === 'Admin' && currentMenu !== 'activos' && (
          <>
            <MenuItem onClick={() => navigate('/reporte')}>Reportes de Gestión</MenuItem>
          </>
        )}
        {role === 'Tecnico' && (
          <>
            <MenuItem onClick={handleMaintenance}>Mantenimiento</MenuItem>
          </>
        )}
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </SidebarContainer>
      <HamburgerButton onClick={toggleSidebar}>☰</HamburgerButton>
    </>
  );
};

export default Sidebar;
