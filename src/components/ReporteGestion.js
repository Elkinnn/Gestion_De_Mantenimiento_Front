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
  padding: 75px 50px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1px; 
  margin-bottom: 30px; 
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

const ReporteGestion = () => {
  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20; 
    const marginTop = 10; 
    const spacingBetweenGraphsFirstPage = 5;
    const spacingBetweenGraphsSecondPage = 15; 

    const graphs = [
      document.getElementById("grafico-activos"),
      document.getElementById("grafico-componentes"),
      document.getElementById("grafico-actividades"),
      document.getElementById("grafico-mantenimientos"),
    ];

    let isFirstPage = true; 

    for (let i = 0; i < graphs.length; i += 2) {
      if (!isFirstPage) pdf.addPage(); 
      isFirstPage = false;

      if (graphs[i]) {
        const canvas1 = await html2canvas(graphs[i], { scale: 3 });
        const imgData1 = canvas1.toDataURL("image/png");
        const ratio1 = canvas1.width / canvas1.height;
        const imgHeight1 = imgWidth / ratio1; 
        pdf.addImage(imgData1, "PNG", 10, marginTop, imgWidth, imgHeight1);
      }

      if (graphs[i + 1]) {
        const canvas2 = await html2canvas(graphs[i + 1], { scale: 3 });
        const imgData2 = canvas2.toDataURL("image/png");
        const ratio2 = canvas2.width / canvas2.height;
        const imgHeight2 = imgWidth / ratio2; 
        const spacingBetweenGraphs = i === 2 ? spacingBetweenGraphsSecondPage : spacingBetweenGraphsFirstPage; // 🔹 Ajuste de espacio por página
        pdf.addImage(imgData2, "PNG", 10, marginTop + imgHeight2 + spacingBetweenGraphs, imgWidth, imgHeight2);
      }
    }

    pdf.save("ReporteGestion.pdf");
  };

  return (
    <Container>
      <Navbar title="Reportes de Gestión del Sistema" />
      <BackButton />
      <Content ref={reportRef}>
        <Title>Reportes de Gestión</Title>
        <div id="grafico-activos">
          <GraficoActivosPorTipo />
        </div>
        <div id="grafico-componentes">
          <GraficoComponentes />
        </div>
        <div id="grafico-actividades">
          <GraficoActividades />
        </div>
        <div id="grafico-mantenimientos">
          <GraficoMantenimientos />
        </div>
      </Content>
      <ButtonContainer>
        <Button onClick={handleDownloadPDF}>
          <FaDownload /> Descargar PDF
        </Button>
      </ButtonContainer>
      <Footer />
    </Container>
  );
};

export default ReporteGestion;
