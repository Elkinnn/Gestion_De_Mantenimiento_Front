import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2"; // Se mantiene el estilo de donut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/api";
import styled from "styled-components";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra elegante */
  padding: 25px;
  max-width: 1100px;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #ddd; /* Borde suave */
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px; /* Se amplía el tamaño total */
  margin: 0 auto;
  padding: 20px;
`;

const ChartContainer = styled.div`
  width: 65%;
  max-width: 700px; /* Aumentado el tamaño de la gráfica */
  height: 400px; /* Altura ajustada para que se vea más grande */
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
  color: black; /* Se asegura de que el título se vea bien */
`;

const TotalTipos = styled.p`
  font-size: 20px; /* Aumenta el tamaño del texto */
  font-weight: bold; /* Hace que el texto sea en negrita */
  margin-bottom: 10px; /* Espacio debajo del texto */
`;

const GraficoActivosPorTipo = () => {
    const [datos, setDatos] = useState([]);

    const fetchData = () => {
        api.get("/reportes/activos-por-tipo")
            .then((res) => {
                console.log("Datos actualizados:", res.data);
                setDatos(res.data);
            })
            .catch((err) => console.error("Error obteniendo datos:", err));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const colores = [
        "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#00FFFF",
        "#FFFF00", "#A52A2A", "#808080", "#800000", "#4682B4", "#32CD32", "#8A2BE2",
        "#FF4500", "#2E8B57"
    ];

    return (

        <ReportContainer>
            <Title>Distribución de activos por tipo en Mantenimientos</Title>
            <ChartWrapper>
                <ChartContainer>
                    <Doughnut
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
                            cutout: "30%", // Mantiene el diseño de DONUT sin hacerlo tan delgado
                            plugins: {
                                legend: {
                                    display: false, // 🚀 Se oculta la leyenda superior
                                },
                            },
                        }}
                    />
                </ChartContainer>

                <LegendContainer>
                    <TotalTipos>Tipos totales: {datos.reduce((acc, d) => acc + d.cantidad, 0)}</TotalTipos>
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
