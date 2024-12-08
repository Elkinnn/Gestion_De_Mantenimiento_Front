import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const Sidebar = ({ open, toggleSidebar, selectedActivo }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Obtenemos el rol del usuario

  const handleEdit = () => {
    if (!selectedActivo) {
      alert('Debes seleccionar un activo para editar.');
      return;
    }
    navigate(`/editar/${selectedActivo}`);
  };

  const handleMaintenance = () => {
    if (!selectedActivo) {
      alert('Debes seleccionar un activo para mantenimiento.');
      return;
    }
    navigate(`/mantenimiento/${selectedActivo}`);
  };

  const handleReport = () => {
    navigate('/reporte'); // El reporte ya no requiere un activo seleccionado
  };

  return (
    <>
      <SidebarContainer open={open}>
        {role === 'Admin' && (
          <>
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleMaintenance}>Mantenimiento</MenuItem>
            <MenuItem onClick={() => navigate('/crear')}>Crear</MenuItem>
            <MenuItem onClick={handleReport}>Reportes de Gestión</MenuItem>
          </>
        )}
        {role === 'Tecnico' && (
          <>
            <MenuItem onClick={handleMaintenance}>Mantenimiento</MenuItem>
          </>
        )}
      </SidebarContainer>
      <HamburgerButton onClick={toggleSidebar}>☰</HamburgerButton>
    </>
  );
};

export default Sidebar;
