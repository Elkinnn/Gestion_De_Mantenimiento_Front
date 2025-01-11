import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import api from "../api/api";
import styled from "styled-components";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
  max-width: 1200px; /* Aumentado el tamaño total */
  margin: 0 auto;
  padding: 20px;
  height: 500px; /* Se aumentó la altura */
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: black;
`;

const GraficoComponentes = () => {
    const [datos, setDatos] = useState([]);

    const fetchData = () => {
        api.get("/reportes/componentes-mas-utilizados")
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
        "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#00FFFF", "#FFFF00", "#A52A2A",
        "#808080", "#800000", "#4682B4", "#32CD32", "#8A2BE2", "#FF4500", "#2E8B57", "#20B2AA", "#DC143C",
        "#FF6347", "#FFD700", "#00FF7F", "#40E0D0", "#6495ED", "#1E90FF", "#B8860B", "#9370DB", "#D2691E",
        "#C71585", "#FF1493", "#ADFF2F"
    ];

    return (
        <ReportContainer>
            <Title>Componentes utilizados en mantenimientos</Title>
            <ChartWrapper>
                <Bar
                    data={{
                        labels: datos.map((d) => d.componente),
                        datasets: [
                            {
                                label: "Cantidad utilizada",
                                data: datos.map((d) => d.cantidad_usada),
                                backgroundColor: colores.slice(0, datos.length),
                                borderColor: "black",
                                borderWidth: 1,
                                barThickness: 50, // Aumenta el grosor de las barras
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1, // Mantiene el paso de 1
                                    font: {
                                        size: 14, // Agranda los números del eje Y
                                    },
                                },
                                grid: {
                                    drawBorder: false,
                                    color: "rgba(0, 0, 0, 0.1)", // Hace que las líneas sean más visibles
                                },
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 14, // Agranda los nombres de los componentes
                                    },
                                },
                            },
                        },
                    }}
                />
            </ChartWrapper>
        </ReportContainer>
    );
};

export default GraficoComponentes;