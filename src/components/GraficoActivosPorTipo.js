import React, { useState, useEffect, useRef, useCallback } from "react";
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
  cursor: pointer;
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
  max-width: 120px;
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const GraficoActivosPorTipo = () => {
    const [datos, setDatos] = useState([]);
    const [hoveredData, setHoveredData] = useState(null);
    const chartRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get("/reportes/activos-por-tipo");
            console.log("Datos actualizados:", res.data);
            setDatos(res.data);
        } catch (err) {
            console.error("Error obteniendo datos:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const colores = [
        "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFD700", "#00CED1", "#DC143C",
        "#ADFF2F", "#FF69B4", "#8B4513", "#4682B4", "#32CD32", "#FF4500", "#6A5ACD", "#FFDAB9",
        "#2E8B57", "#DAA520", "#FF6347", "#7FFF00", "#FF00FF", "#40E0D0", "#191970", "#B22222",
        "#556B2F", "#FF8C00", "#9370DB", "#20B2AA", "#DC143C", "#8A2BE2"
    ];

    const totalCantidad = datos.reduce((acc, d) => acc + d.cantidad, 0);

    const truncateText = (text, length = 12) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    const handleHover = useCallback((_, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const tipo = datos[index]?.tipo_activo || "";
            const porcentaje = ((datos[index]?.cantidad / totalCantidad) * 100).toFixed(2);

            setHoveredData((prev) => {
                if (!prev || prev.tipo !== tipo || prev.porcentaje !== porcentaje) {
                    return { tipo: truncateText(tipo), porcentaje };
                }
                return prev;
            });
        } else {
            setHoveredData(null);
        }
    }, [datos, totalCantidad]);

    const handleLegendHover = useCallback((index) => {
        if (datos[index]) {
            const tipo = datos[index].tipo_activo;
            const porcentaje = ((datos[index].cantidad / totalCantidad) * 100).toFixed(2);
            setHoveredData({ tipo: truncateText(tipo), porcentaje });
        }
    }, [datos, totalCantidad]);

    const handleLegendLeave = () => {
        setHoveredData(null);
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
                                    enabled: false,
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
                        <LegendItem
                            key={index}
                            onMouseEnter={() => handleLegendHover(index)}
                            onMouseLeave={handleLegendLeave}
                        >
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
