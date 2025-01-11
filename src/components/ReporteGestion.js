import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GraficoActivosPorTipo from "./GraficoActivosPorTipo";
import GraficoComponentes from "./GraficoComponentes";
import GraficoActividades from "./GraficoActividades";
import styled from "styled-components";
import BackButton from './BackButton';

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
            <Navbar title="Reportes de Gestión del Sistema" />
            <BackButton />
            <Content>
                <Title>Reportes de Gestión</Title>
                <GraficoActivosPorTipo />
                <GraficoComponentes />
                <GraficoActividades /> 
            </Content>
            <Footer />
        </Container>
    );
};

export default ReporteGestion;
