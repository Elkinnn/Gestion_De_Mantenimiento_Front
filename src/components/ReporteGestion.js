import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
`;

const ReporteGestion = () => {
  return (
    <Container>
      <Navbar title="Reporte de Gestión del Sistema" />
      <Content>
        <h1>Reporte de Gestión</h1>
        <p>Esta es la página donde se mostrarán los reportes de gestión.</p>
      </Content>
      <Footer />
    </Container>
  );
};

export default ReporteGestion;
