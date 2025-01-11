import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import api from "../api/api";
import styled from "styled-components";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
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
        "#008000", "#00CED1", "#8A2BE2", "#FF0000", "#B22222", "#0000FF"
    ];

    return (
        <div>
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
                                barThickness: 40,
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
                                    stepSize: 1,
                                },
                            },
                        },
                    }}
                />
            </ChartWrapper>
        </div>
    );
};

export default GraficoComponentes;
