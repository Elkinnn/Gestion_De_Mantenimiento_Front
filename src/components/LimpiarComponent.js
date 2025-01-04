import React from 'react';
import styled from 'styled-components';

const ClearButton = styled.button`
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  flex: none;

  &:hover {
    background-color: #0056b3;
  }
`;

const LimpiarComponent = ({ handleClear }) => {
  return <ClearButton onClick={handleClear}>Limpiar</ClearButton>;
};

export default LimpiarComponent;