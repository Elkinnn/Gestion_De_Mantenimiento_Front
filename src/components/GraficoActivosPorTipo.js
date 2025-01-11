import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/api";
import styled from "styled-components";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ChartContainer = styled.div`
  width: 65%;
  max-width: 700px;
  height: 400px;
  position: relative;
`;

const LegendContainer = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ColorBox = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: black;
`;

const TotalTipos = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
  color: #333;
  max-width: 120px; /* 🚀 Evita que el texto sea demasiado ancho */
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const GraficoActivosPorTipo = () => {
    const [datos, setDatos] = useState([]);
    const [hoveredData, setHoveredData] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/reportes/activos-por-tipo");
                console.log("Datos actualizados:", res.data);
                setDatos(res.data);
            } catch (err) {
                console.error("Error obteniendo datos:", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const colores = [
        "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#00FFFF",
        "#FFFF00", "#A52A2A", "#808080", "#800000", "#4682B4", "#32CD32", "#8A2BE2",
        "#FF4500", "#2E8B57"
    ];

    const totalCantidad = datos.reduce((acc, d) => acc + d.cantidad, 0);

    const truncateText = (text, length = 12) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    const handleHover = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const tipo = datos[index]?.tipo_activo || "";
            const porcentaje = ((datos[index]?.cantidad / totalCantidad) * 100).toFixed(2);

            setHoveredData((prev) => {
                if (prev?.tipo !== tipo || prev?.porcentaje !== porcentaje) {
                    return { tipo: truncateText(tipo), porcentaje };
                }
                return prev;
            });
        } else {
            setHoveredData(null);
        }
    };

    return (
        <ReportContainer>
            <Title>Distribución de activos por tipo en Mantenimientos</Title>
            <ChartWrapper>
                <ChartContainer>
                    <Doughnut
                        ref={chartRef}
                        data={{
                            labels: datos.map((d) => d.tipo_activo),
                            datasets: [
                                {
                                    data: datos.map((d) => d.cantidad),
                                    backgroundColor: colores.slice(0, datos.length),
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            cutout: "30%",
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    enabled: false, // 🚀 Deshabilita la tooltip flotante
                                },
                            },
                            onHover: handleHover,
                        }}
                    />
                    {hoveredData && (
                        <CenterText>
                            <div style={{ fontSize: "28px", color: "#007bff" }}>{hoveredData.porcentaje}%</div>
                            <div style={{ fontSize: "16px", color: "#333" }}>{hoveredData.tipo}</div>
                        </CenterText>
                    )}
                </ChartContainer>

                <LegendContainer>
                    <TotalTipos>Tipos totales: {totalCantidad}</TotalTipos>
                    <hr />
                    {datos.map((d, index) => (
                        <LegendItem key={index}>
                            <ColorBox color={colores[index]} />
                            {d.tipo_activo} - {d.cantidad}
                        </LegendItem>
                    ))}
                </LegendContainer>
            </ChartWrapper>
        </ReportContainer>
    );
};

export default GraficoActivosPorTipo;
