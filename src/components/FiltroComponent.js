import React from 'react';
import styled from 'styled-components';

const FilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px;
  font-size: 14px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  max-width: 200px;
`;

const FilterInput = styled.input`
  padding: 10px;
  font-size: 14px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  max-width: 200px;
`;

const FiltroComponent = ({ filtros, handleFilterChange }) => {
  return (
    <FilterWrapper>
      <FilterInput
        type="text"
        name="proceso_compra"
        value={filtros.proceso_compra}
        onChange={handleFilterChange}
        placeholder="Proceso de Compra"
      />

      <FilterSelect
        name="proveedor"
        value={filtros.proveedor}
        onChange={handleFilterChange}
      >
        <option value="">Proveedor</option>
        {['Tech Solutions S.A.', 'InnovaCom S.A.', 'ElectroProveedores S.A.', 'Global Tech Ltda.', 'SmartDevices S.A.'].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        name="tipo"
        value={filtros.tipo}
        onChange={handleFilterChange}
      >
        <option value="">Tipo</option>
        {['Mouse', 'Teclado', 'Monitor', 'CPU'].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        name="estado"
        value={filtros.estado}
        onChange={handleFilterChange}
      >
        <option value="">Estado</option>
        {['Funcionando', 'No Funcionando'].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FilterSelect>
    </FilterWrapper>
  );
};

export default FiltroComponent;
