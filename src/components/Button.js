import React from 'react';
import styled from 'styled-components';

// Estilo del botón
const StyledButton = styled.button`
  padding: 6px 12px;  // Reducir el padding en ambos ejes
  background-color: ${props => props.bgColor || '#007bff'};
  color: ${props => props.color || '#fff'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;  // Reducir el tamaño de la fuente
  margin: ${props => props.margin || '10px 0'};  // Reducir el margen
  display: inline-block;  // Mantener el botón como un bloque en línea

  &:hover {
    background-color: ${props => props.hoverColor || '#0056b3'};
  }
`;

// Componente de botón
const Button = ({ text, onClick, bgColor, color, hoverColor, margin }) => {
  return (
    <StyledButton
      onClick={onClick}
      bgColor={bgColor}
      color={color}
      hoverColor={hoverColor}
      margin={margin}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
