import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import api from "../api/api";
import styled from "styled-components";
import { showErrorNotification } from "./Notification"; // Solo importamos la función de notificación

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

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
  height: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  color: black;
`;

const Filters = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const Button = styled.button`
  background: black;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #444;
  }
`;

const GraficoMantenimientos = () => {
    const [datos, setDatos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [tipoMantenimiento, setTipoMantenimiento] = useState("");

    const fetchData = () => {
        // Si solo se ha ingresado la fecha de inicio, no hace nada
        if (fechaInicio && !fechaFin) {
            return;
        }

        // Verificar si la fecha fin es menor que la fecha inicio
        if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
            showErrorNotification("La fecha fin no puede ser menor que la fecha inicio.");
            return;
        }

        api.get("/reportes/mantenimientos-por-periodo", {
            params: { fechaInicio, fechaFin, tipoMantenimiento }
        })
            .then((res) => {
                console.log("Datos actualizados:", res.data);
                setDatos(res.data);
            })
            .catch((err) => console.error("Error obteniendo datos:", err));
    };

    useEffect(() => {
        fetchData(); // Llamado inicial para que la gráfica siempre se muestre
        const interval = setInterval(fetchData, 5000); // Polling cada 5s
        return () => clearInterval(interval);
    }, [fechaInicio, fechaFin, tipoMantenimiento]);

    const limpiarFiltros = () => {
        setFechaInicio("");
        setFechaFin("");
        setTipoMantenimiento("");
        fetchData();
    };

    return (
        <ReportContainer>
            <Title>Número de mantenimientos realizados por período</Title>
            <Filters>
                <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    placeholder="Fecha Inicio"
                />
                <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    placeholder="Fecha Fin"
                />
                <Select value={tipoMantenimiento} onChange={(e) => setTipoMantenimiento(e.target.value)}>
                    <option value="">Tipo de Mantenimiento</option>
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                </Select>
                <Button onClick={limpiarFiltros}>Limpiar</Button>
            </Filters>

            {/* La gráfica solo se muestra si NO hay fecha de inicio o si hay ambas fechas */}
            {(datos.length > 0 && (!fechaInicio || (fechaInicio && fechaFin))) && (
                <ChartWrapper>
                    <Line
                        data={{
                            labels: datos.map((d) => d.fecha),
                            datasets: [
                                {
                                    label: "Mantenimientos",
                                    data: datos.map((d) => d.cantidad),
                                    borderColor: "red",
                                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                                    pointRadius: 5,
                                    pointBackgroundColor: "red",
                                    tension: 0.4,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartWrapper>
            )}
        </ReportContainer>
    );
};

export default GraficoMantenimientos;
