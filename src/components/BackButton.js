import React from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Importa el ícono de react-icons

const BackButton = ({ onClick, style }) => {
    return (
        <button
            onClick={onClick || (() => window.history.back())}
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                right: '20px', // Distancia del borde derecho
                top: '20px', // Distancia del borde superior
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10, // Asegúrate de que el botón esté sobre otros elementos
                transform: 'translateY(65px)',
                ...style,
            }}
        >
            <FaArrowLeft />
        </button>
    );
};

export default BackButton;
