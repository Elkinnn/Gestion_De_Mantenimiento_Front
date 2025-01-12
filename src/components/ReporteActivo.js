import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { showInfoNotification } from './Notification';
import ModalReporteActivo from './ModalReporteActivo';  // ✅ Importa el nuevo modal
import BackButton from './BackButton';
import api from '../api/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 20px 20px;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  width: 230px;  /* 🔹 Mismo ancho que los campos de fecha */
  height: 35px;  /* 🔹 Mismo alto que los campos de fecha */
  padding: 5px 10px;  /* 🔹 Ajusta el espacio interno */
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
`;



const ClearButton = styled.button`
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  flex: none;

  &:hover {
    background-color: #0056b3;
  }
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #ddd;
  text-transform: uppercase;
  text-align: center;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.$selected ? '#d6eaf8' : props.$isEven ? '#f9f9f9' : '#fff')};
  &:hover {
    background-color: ${(props) => (props.$selected ? '#d6eaf8' : '#f1f1f1')};
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 2px 8px; /* 🔹 Reducimos aún más el padding vertical */
  border: 1px solid #ddd;
  font-size: 14px; /* 🔹 Dejamos el mismo tamaño de texto */
  color: #555;
  height: 15px; /* 🔹 Reducimos aún más la altura de la celda */
  text-align: center; /* 🔹 Centramos horizontalmente */
  vertical-align: middle; /* 🔹 Centramos verticalmente */
`;




const Button = styled.button`
  padding: 12px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 10px;
  width: auto;
  max-width: 250px;
  display: block;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  &:hover {
    background-color: #218838;
  }
`;

const ReporteActivo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [nombreActivo, setNombreActivo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMantenimientoId, setSelectedMantenimientoId] = useState(null);
  const [selectedActivoId, setSelectedActivoId] = useState(null);
  const [totalMantenimientos, setTotalMantenimientos] = useState(0); // ✅ Estado para almacenar el total


  const handleOpenModal = (mantenimientoId, activoId) => {
    console.log("📡 Abriendo modal con:", { mantenimientoId, activoId });
    setSelectedMantenimientoId(mantenimientoId);
    setSelectedActivoId(activoId);
    setModalOpen(true);
  };



  const handleCloseModal = () => {
    setModalOpen(false); // Cierra el modal
    setSelectedMantenimientoId(null); // Limpia el ID seleccionado
  };


  const handleFechaInicioChange = (e) => {
    const nuevaFechaInicio = e.target.value;
    if (!nuevaFechaInicio) {
      setFechaInicio('');
      return;
    }

    const fechaInicioTimestamp = new Date(nuevaFechaInicio).setHours(0, 0, 0, 0);
    const fechaFinTimestamp = fechaFin ? new Date(fechaFin).setHours(0, 0, 0, 0) : null;

    if (fechaFinTimestamp && fechaInicioTimestamp > fechaFinTimestamp) {
      showInfoNotification("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return; // ❌ No actualizamos la fecha
    }

    setFechaInicio(nuevaFechaInicio); // ✅ Solo se actualiza si es válida
  };

  const handleFechaFinChange = (e) => {
    const nuevaFechaFin = e.target.value;
    if (!nuevaFechaFin) {
      setFechaFin('');
      return;
    }

    const fechaFinTimestamp = new Date(nuevaFechaFin).setHours(23, 59, 59, 999);
    const fechaInicioTimestamp = fechaInicio ? new Date(fechaInicio).setHours(0, 0, 0, 0) : null;

    if (fechaInicioTimestamp && fechaFinTimestamp < fechaInicioTimestamp) {
      showInfoNotification("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return; // ❌ No actualizamos la fecha
    }

    setFechaFin(nuevaFechaFin); // ✅ Solo se actualiza si es válida
  };



  const handleProveedorChange = (e) => {
    setProveedorSeleccionado(e.target.value);
    setTecnicoSeleccionado(''); // Bloquea Técnico si selecciona Proveedor
  };

  const handleTecnicoChange = (e) => {
    setTecnicoSeleccionado(e.target.value);
    setProveedorSeleccionado(''); // Bloquea Proveedor si selecciona Técnico
  };


  const fetchMantenimientos = async () => {
    try {
      let query = `/mantenimientos/activo/${id}`;
      const params = {};

      if (fechaInicio && fechaFin) {
        params.fechaInicio = new Date(fechaInicio).toISOString().split('T')[0];
        params.fechaFin = new Date(fechaFin).toISOString().split('T')[0];
      }

      if (proveedorSeleccionado && !tecnicoSeleccionado) {
        params.proveedor = proveedorSeleccionado;
      }

      if (tecnicoSeleccionado && !proveedorSeleccionado) {
        params.tecnico = tecnicoSeleccionado;
      }

      console.log("📡 Enviando filtros a la API:", params);

      const response = await api.get(query, { params });

      console.log("✅ Respuesta completa de la API:", response.data);

      if (response.data) {
        setNombreActivo(response.data.nombre || 'Desconocido');
        setMantenimientos(response.data.mantenimientos || []);
        setTotalMantenimientos(response.data.mantenimientos.length || 0); // ✅ Guardamos el total de mantenimientos
      }
    } catch (error) {
      console.error("❌ Error al cargar mantenimientos:", error);

      if (error.response) {
        console.warn(`⚠️ Error ${error.response.status}: ${error.response.data.message}`);
        if (error.response.status === 404) {
          setNombreActivo("No encontrado");
        }
      } else {
        setNombreActivo("Error al obtener datos");
      }

      setMantenimientos([]);
      setTotalMantenimientos(0);
    }
  };



  useEffect(() => {
    if (id) {
      fetchMantenimientos();
    } else {
      console.warn("⚠️ ID no definido en useParams.");
      setNombreActivo("No seleccionado");
    }
  }, [id, fechaInicio, fechaFin, proveedorSeleccionado, tecnicoSeleccionado]);

  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const response = await api.get('/mantenimientos/filtros');
        console.log("📊 Filtros obtenidos:", response.data);

        setProveedores(response.data.providers || []);
        setTecnicos(response.data.technicians || []);
      } catch (error) {
        console.error("⚠️ Error al obtener filtros:", error);
      }
    };

    fetchFiltros();
  }, []);


  const mantenimientosFiltrados = mantenimientos.filter(mantenimiento => {
    // 🔹 Convertir fechas de los mantenimientos al formato YYYY-MM-DD
    const fechaInicioMantenimiento = mantenimiento.fecha_inicio
      ? new Date(mantenimiento.fecha_inicio).toISOString().split('T')[0]
      : null;
    const fechaFinMantenimiento = mantenimiento.fecha_fin
      ? new Date(mantenimiento.fecha_fin).toISOString().split('T')[0]
      : null;

    // 🔹 Convertir fechas seleccionadas en los filtros al formato YYYY-MM-DD
    const filtroFechaInicio = fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : null;
    const filtroFechaFin = fechaFin ? new Date(fechaFin).toISOString().split('T')[0] : null;

    // 🔹 Aplicar filtrado de fechas si el usuario ha seleccionado ambas fechas
    if (filtroFechaInicio && filtroFechaFin) {
      if (
        (fechaInicioMantenimiento && fechaInicioMantenimiento < filtroFechaInicio) ||
        (fechaFinMantenimiento && fechaFinMantenimiento > filtroFechaFin)
      ) {
        return false;
      }
    }

    // 🔹 Filtrar por proveedor (Comparar con el nombre en la API)
    if (proveedorSeleccionado) {
      const proveedorMantenimiento = mantenimiento.proveedor ? mantenimiento.proveedor.toString() : 'N/A';
      const proveedorAPI = proveedores.find(p => p.id === proveedorSeleccionado)?.name || 'N/A';
      if (proveedorMantenimiento !== proveedorAPI) {
        return false;
      }
    }

    // 🔹 Filtrar por técnico (Comparar con el nombre en la API)
    if (tecnicoSeleccionado) {
      const tecnicoMantenimiento = mantenimiento.tecnico ? mantenimiento.tecnico.toString() : 'N/A';
      const tecnicoAPI = tecnicos.find(t => t.id.toString() === tecnicoSeleccionado)?.name || 'N/A';
      if (tecnicoMantenimiento !== tecnicoAPI) {
        return false;
      }
    }

    return true; // ✅ Devuelve true si el mantenimiento cumple con los filtros
  });





  // ✅ BOTÓN LIMPIAR - Ahora borra todo y recarga los datos correctamente
  const handleClearFilters = () => {
    setFechaInicio('');
    setFechaFin('');
    setProveedorSeleccionado('');
    setTecnicoSeleccionado('');

    // 🔹 Restablecemos los inputs de fecha a "text" temporalmente para que el placeholder reaparezca
    setTimeout(() => {
      document.getElementById("fechaInicioInput").type = "text";
      document.getElementById("fechaFinInput").type = "text";
    }, 0);

    // 🔹 Volver a cargar los mantenimientos sin filtros
    fetchMantenimientos();
  };





  return (
    <>
      <Navbar title={`Reporte del Activo ${nombreActivo || '...'}`} />
      <Container>
        <BackButton
          onClick={() => {
            // Lógica del botón para regresar
            console.log('Regresando a la página anterior...');
            window.history.back(); // Regresa a la página anterior
          }}
          style={{
            top: '20px', // Ajusta posición vertical
            right: '15px', // Ajusta posición horizontal
            fontSize: '24px', // Tamaño del icono
          }}
        />
        <Title>Mantenimientos del Activo {nombreActivo}</Title>
        <FilterWrapper>
          <FilterContainer>
            <FilterLabel>Filtrar por:</FilterLabel>

            {/* 🔹 FILTRO DE FECHA DE INICIO */}
            <input
              id="fechaInicioInput"
              type={fechaInicio ? "date" : "text"} // 🔹 Mantiene "text" si está vacío
              value={fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : ''}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={handleFechaInicioChange}
              placeholder="📅 Fecha Inicio"
              style={{
                width: "170px",
                height: "23px",
                padding: "5px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                fontSize: "14px",
                textAlign: "center",
                cursor: "pointer",
                color: fechaInicio ? "#000" : "#aaa",
              }}
            />

            {/* 🔹 FILTRO DE FECHA DE FIN */}
            <input
              id="fechaFinInput"
              type={fechaFin ? "date" : "text"} // 🔹 Mantiene "text" si está vacío
              value={fechaFin ? new Date(fechaFin).toISOString().split('T')[0] : ''}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={handleFechaFinChange}
              placeholder="📅 Fecha Fin"
              style={{
                width: "170px",
                height: "23px",
                padding: "5px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                fontSize: "14px",
                textAlign: "center",
                cursor: "pointer",
                color: fechaFin ? "#000" : "#aaa",
              }}
            />




            {/* 🔹 FILTRO DE PROVEEDOR */}
            <FilterSelect
              value={proveedorSeleccionado}
              onChange={(e) => setProveedorSeleccionado(e.target.value)}
              disabled={tecnicoSeleccionado !== ''}
            >
              <option value="">Proveedor</option>
              {proveedores.map(proveedor => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.name}</option>
              ))}
            </FilterSelect>

            {/* 🔹 FILTRO DE TÉCNICO */}
            <FilterSelect
              value={tecnicoSeleccionado}
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
              disabled={proveedorSeleccionado !== ''}
            >
              <option value="">Técnico</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id} value={tecnico.id}>{tecnico.name}</option>
              ))}
            </FilterSelect>

            {/* 🔹 BOTÓN LIMPIAR - Ahora borra todo y recarga los datos */}
            <ClearButton onClick={handleClearFilters}>Limpiar</ClearButton>
          </FilterContainer>
        </FilterWrapper>
        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '20px', fontWeight: 'bold', color: '#000' }}>
          Total de Mantenimientos:
          <span style={{ color: '#007bff', marginLeft: '8px', fontSize: '22px' }}>{totalMantenimientos}</span>
        </div>


        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Número de Mantenimiento</TableHeader>
                <TableHeader>Proveedor</TableHeader>
                <TableHeader>Técnico</TableHeader>
                <TableHeader>Fecha Inicio</TableHeader>
                <TableHeader>Fecha Fin</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Acción</TableHeader>
              </tr>
            </thead>
            <tbody>
              {mantenimientosFiltrados.length > 0 ? (
                mantenimientosFiltrados.map((mantenimiento, index) => (
                  <TableRow key={index}>
                    <TableData>{mantenimiento.numero_mantenimiento}</TableData>
                    <TableData>{mantenimiento.proveedor || 'N/A'}</TableData>
                    <TableData>{mantenimiento.tecnico || 'N/A'}</TableData>
                    <TableData>{new Date(mantenimiento.fecha_inicio).toLocaleDateString()}</TableData>
                    <TableData>{new Date(mantenimiento.fecha_fin).toLocaleDateString()}</TableData>
                    <TableData>{mantenimiento.estado}</TableData>
                    <TableData>
                      {mantenimiento?.mantenimiento_id ? (
                        <Button onClick={() => handleOpenModal(mantenimiento.mantenimiento_id, id)}>
                          Ver Mantenimiento
                        </Button>
                      ) : (
                        <span style={{ color: 'red' }}>ID no disponible</span>
                      )}

                    </TableData>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                    {nombreActivo === "No encontrado"
                      ? "El activo no existe en la base de datos."
                      : "Este activo no tiene mantenimientos registrados."}
                  </td>
                </tr>
              )}
            </tbody>

          </Table>
        </TableWrapper>
      </Container>
      <ModalReporteActivo
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mantenimientoId={selectedMantenimientoId}
        activoId={selectedActivoId}  // 🔹 Pasamos el ID del activo al modal
      />


      <Footer />
    </>
  );


};

export default ReporteActivo;
