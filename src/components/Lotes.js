import React, { useState } from 'react';


const Lotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Manejar el cambio de archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Manejar la carga del archivo
  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado después del login

    if (!token) {
      setMessage('No se encontró el token de autenticación');
      return;
    }

    try {
      // Realizar la solicitud POST con el archivo y el token en los encabezados
      const response = await fetch('http://localhost:5000/api/activos/upload-lotes', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,  // Enviar el token en el encabezado
        },
      });

      // Procesar la respuesta
      const data = await response.json();
      setMessage(data.message || 'Archivo subido correctamente.');
    } catch (error) {
      setMessage('Error al subir el archivo.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa', // Fondo claro para la página
    }}>
     
        <button
    onClick={() => window.history.back()}
    style={{
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      position: 'absolute', // Posicionar el botón en la parte superior derecha
      right: '50px',  // Ajusta la distancia desde el borde derecho
      top: '0%',
       // Alinea verticalmente en el centro
       transform: 'translateY(30px)', // Ajusta para que el centro esté perfectamente alineado
    }}
  >
    <img
      src="https://img.icons8.com/ios/50/ffffff/left.png"
      alt="Volver"
      style={{ width: '30px',filter: 'invert(1)', }}
    />
  </button>
      
      {/* Contenedor principal de la página */}
      
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: '80px',  // Para evitar que el contenido quede oculto debajo del header
  padding: '20px',
  backgroundColor: '#ffffff',
  width: '100%',
  textAlign: 'left',
  maxWidth: '800px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  border: '0.2px solid black', // Agregar borde negro alrededor
}}>
        <h2 style={{
          marginBottom: '20px',
          fontWeight: 'bold',
        }}>Nuevo Activo</h2>
        <p>Cargar por lote (Archivo Excel)</p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <button
          onClick={handleUpload}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: '#00000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Cargar Lote
        </button>

        {/* Mostrar mensaje de éxito o error */}
        {message && (
          <p style={{
            marginTop: '20px',
            color: message.includes('Error') ? 'red' : 'green',
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Lotes;
