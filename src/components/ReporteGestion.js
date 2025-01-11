import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GraficoActivosPorTipo from "./GraficoActivosPorTipo";
import GraficoComponentes from "./GraficoComponentes";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 70px 50px; /* Se aumentó el padding para dar más espacio */
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px; /* Espaciado adicional para separar del gráfico */
`;

const ReporteGestion = () => {
    return (
        <Container>
            <Navbar title="Reporte de Gestión del Sistema" />
            <Content>
                <Title>Reporte de Gestión</Title>
                <GraficoActivosPorTipo />
                <GraficoComponentes />
            </Content>
            <Footer />
        </Container>
    );
};

export default ReporteGestion;
