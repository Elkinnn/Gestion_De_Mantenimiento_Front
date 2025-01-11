import React, { useState } from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';
import BackButton from './BackButton';
import { showSuccessNotification, showErrorNotification } from './Notification';
import * as XLSX from 'xlsx';
const token = localStorage.getItem('token');

// Estilo del contenedor principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 70px 20px 20px;
  max-width: 800px;
  min-height: calc(100vh - 80px);
  background-color: white;
  align-items: center;
  justify-content: center;
`;

// Estilo de la tarjeta del formulario
const FormCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 10px;
  text-align: left;
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
`;

const FileName = styled.span`
  color: #6c757d;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

const SelectFileButton = styled.label`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #0056b3;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  max-width: 200px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ActivosLotes = () => {
  const [file, setFile] = useState(null);

  const expectedColumns = ["proceso_compra", "nombre", "estado", "ubicacion_id", "tipo_activo_id", "proveedor_id"];

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validar formato del archivo
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      showErrorNotification('Error al cargar: El formato es incorrecto.');
      setFile(null);
      return;
    }

    // Leer el archivo Excel para validar las columnas
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const fileColumns = jsonData[0]; // Primera fila como encabezados

      // Validar si las columnas esperadas están presentes
      const missingColumns = expectedColumns.filter((col) => !fileColumns.includes(col));

      if (missingColumns.length > 0) {
        showErrorNotification(`Error al cargar:  El
 formato es incorrecto.`);
        setFile(null);
        return;
      }

      setFile(selectedFile);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      showErrorNotification('Por favor, seleccione un archivo antes de cargar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showErrorNotification('Error al cargar: El archivo pesa más de 2mb.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/activos/upload-lotes', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

       const responseData = await response.json();

    if (response.ok) {
      showSuccessNotification('Activos cargados con éxito.');
    } else {
      const { errors, message } = responseData;
      if (errors.includes('missing_fields')) {
        showErrorNotification('Debe completar todos los campos.');
      } else if (errors.includes('duplicate_names')) {
        showErrorNotification('Error al cargar: Existen serie de activos repetitivos.');
      } else if (errors.includes('invalid_format')) {
        showErrorNotification('Error al cargar: El formato es incorrecto.');
      } else if (errors.includes('exceeds_limit')) {
        showErrorNotification('Error al cargar: El archivo contiene más de 100 activos.');
      } else {
        showErrorNotification(message || 'Hubo un error al cargar el archivo.');
      }
    }
  } catch (error) {
    console.error('Error durante la carga del archivo:', error);
    showErrorNotification('Error al cargar el archivo.');
  }
};
  return (
    <>
      <Navbar title="Cargar Activos por Lote" />
      <BackButton />
      <Container>
        <FormCard>
          <FormTitle>Nuevo Activo</FormTitle>
          <Label>Cargar por lote (Archivo Excel)</Label>
          <FileInputContainer>
            <FileName>{file ? file.name : 'Ningún archivo seleccionado'}</FileName>
            <SelectFileButton>
              Seleccione el archivo
              <HiddenInput type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            </SelectFileButton>
          </FileInputContainer>
          <ActionButton onClick={handleUpload}>Cargar Lote</ActionButton>
        </FormCard>
      </Container>
      <Footer />
    </>
  );
};

export default ActivosLotes;
