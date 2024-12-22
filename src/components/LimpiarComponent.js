import React from 'react';
import styled from 'styled-components';

const ClearButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const LimpiarComponent = ({ handleClear }) => {
  return <ClearButton onClick={handleClear}>Limpiar</ClearButton>;
};

export default LimpiarComponent;