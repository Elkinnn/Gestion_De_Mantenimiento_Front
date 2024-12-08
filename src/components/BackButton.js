import React from 'react';

const BackButton = ({ onClick, style }) => {
  return (
    <button
      onClick={onClick || (() => window.history.back())} // Usa onClick si se pasa como prop, de lo contrario usa la funcionalidad predeterminada
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        position: 'absolute',
        right: '50px', // Ajusta la distancia desde el borde derecho
        top: '0%',
        transform: 'translateY(30px)', // Alineación vertical
        ...style, // Permite que se sobreescriban estilos si se pasa como prop
      }}
    >
      🔙 {/* Emoji o ícono de retroceso */}
    </button>
  );
};

export default BackButton;
