import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import CrearActivos from './CrearActivos';
import Navbar from './Navbar';
import Footer from './Footer';
import styled from 'styled-components';

// Contenedor principal que asegura que el Footer se ajuste al final
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que ocupe toda la pantalla */
`;

const ContentWrapper = styled.div`
  flex: 1; /* Esto permite que el contenido principal ocupe todo el espacio disponible */
  padding: 20px;
`;

const EditarActivos = () => {
    const { id } = useParams(); // Obtiene el ID del activo de la URL
    const [activo, setActivo] = useState(null);

    useEffect(() => {
        const fetchActivo = async () => {
            try {
                const response = await api.get(`/activos/${id}`); // Cargar el activo por ID
                setActivo(response.data);
            } catch (error) {
                console.error('Error al cargar el activo:', error);
            }
        };
        fetchActivo();
    }, [id]);

    if (!activo) {
        return <p>Cargando datos...</p>;
    }

    return (
        <PageContainer>
            <Navbar title="Editar Activo" />
            <ContentWrapper>
                <CrearActivos
                    initialData={activo}
                    onSubmitSuccess={() => window.location.href = '/menu-activos'}
                    showFooter={false}
                />
            </ContentWrapper>
            <Footer />
        </PageContainer>
    );
};

export default EditarActivos;
