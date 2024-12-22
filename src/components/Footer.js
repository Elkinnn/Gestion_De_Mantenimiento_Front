import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #007bff;
  color: white;
  text-align: center;
  padding: 15px;
  position: relative;
  width: 100%;
  bottom: 0;
  font-size: 14px;
  margin-top: auto;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Todos los derechos reservados.</p>
    </FooterContainer>
  );
};

export default Footer;
