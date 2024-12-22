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

const FiltroComponent = ({ filtros, handleFilterChange }) => {
  return (
    <FilterWrapper>
      {Object.keys(filtros).map((filtroKey) => (
        <FilterSelect
          key={filtroKey}
          name={filtroKey}
          value={filtros[filtroKey]}
          onChange={handleFilterChange}
        >
          <option value="">{filtroKey}</option>
          {filtros[filtroKey + 'Options']?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </FilterSelect>
      ))}
    </FilterWrapper>
  );
};

export default FiltroComponent;