import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoActivosPorTipo = () => {
    const [datos, setDatos] = useState([]);

    // Función para obtener datos de la API cada 5 segundos
    const fetchData = () => {
        api.get("/reportes/activos-por-tipo")
            .then((res) => {
                console.log("Datos actualizados:", res.data);
                setDatos(res.data);
            })
            .catch((err) => console.error("Error obteniendo datos:", err));
    };

    useEffect(() => {
        fetchData(); // Obtener datos iniciales
        const interval = setInterval(fetchData, 5000); // Polling cada 5 segundos
        return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
    }, []);

    return (
        <div>
            <h2>Distribución de activos por tipo en Mantenimientos</h2>
            <Pie
                data={{
                    labels: datos.map((d) => d.tipo_activo),
                    datasets: [
                        {
                            data: datos.map((d) => d.cantidad),
                            backgroundColor: ["red", "blue", "green", "orange", "purple"],
                        },
                    ],
                }}
            />
        </div>
    );
};

export default GraficoActivosPorTipo;
