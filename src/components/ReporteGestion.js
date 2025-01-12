import React, { useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GraficoActivosPorTipo from "./GraficoActivosPorTipo";
import GraficoComponentes from "./GraficoComponentes";
import GraficoActividades from "./GraficoActividades";
import GraficoMantenimientos from "./GraficoMantenimientos";
import styled from "styled-components";
import BackButton from "./BackButton";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 70px 50px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 20px auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const ReportContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  max-width: 1100px;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #ddd;
`;

const ReporteGestion = () => {
  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 3 }); 
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a3", 
    });

    pdf.addImage(imgData, "PNG", 10, 10, 280, 400); 

    pdf.save("ReporteGestion.pdf");
  };

  return (
    <Container>
      <Navbar title="Reportes de Gestión del Sistema" />
      <BackButton />
      <Content ref={reportRef}>
        <Title>Reportes de Gestión</Title>
        <ReportContainer>
          <GraficoActivosPorTipo />
        </ReportContainer>
        <ReportContainer>
          <GraficoComponentes />
        </ReportContainer>
        <ReportContainer>
          <GraficoActividades />
        </ReportContainer>
        <ReportContainer>
          <GraficoMantenimientos />
        </ReportContainer>
      </Content>
      <Button onClick={handleDownloadPDF}>
        <FaDownload /> Descargar PDF
      </Button>
      <Footer />
    </Container>
  );
};

export default ReporteGestion;
