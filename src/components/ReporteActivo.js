import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { showInfoNotification } from './Notification';
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
  max-height: 400px;
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
  padding: 12px 20px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #555;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
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

  &:hover {
    background-color: #0056b3;
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

      // 🔹 Convertir fechas a formato YYYY-MM-DD antes de enviarlas
      if (fechaInicio && fechaFin) {
        params.fechaInicio = new Date(fechaInicio).toISOString().split('T')[0];
        params.fechaFin = new Date(fechaFin).toISOString().split('T')[0];
      }

      // 🔹 Filtrar por proveedor (Enviamos el ID del proveedor)
      if (proveedorSeleccionado && !tecnicoSeleccionado) {
        params.proveedor = proveedorSeleccionado; // Ahora enviamos el ID del proveedor
      }

      // 🔹 Filtrar por técnico (Enviamos el ID del técnico)
      if (tecnicoSeleccionado && !proveedorSeleccionado) {
        params.tecnico = tecnicoSeleccionado; // Ahora enviamos el ID del técnico
      }

      console.log("📡 Enviando filtros a la API:", params);

      const response = await api.get(query, { params });
      console.log("✅ Respuesta de la API:", response.data);

      if (response.data) {
        setNombreActivo(response.data.nombre || 'Desconocido');
        setMantenimientos(response.data.mantenimientos || []);
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

    // 🔹 Volver a cargar los mantenimientos sin filtros
    fetchMantenimientos();
  };




  return (
    <>
      <Navbar title={`Reporte del Activo ${nombreActivo || '...'}`} />
      <Container>
        <Title>Mantenimientos del Activo {nombreActivo}</Title>
        <FilterWrapper>
          <FilterContainer>
            <FilterLabel>Filtrar por:</FilterLabel>

            {/* 🔹 FILTRO DE FECHA DE INICIO */}
            <input
              type="date"
              value={fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : ''}
              onChange={handleFechaInicioChange} // Aquí debe estar asignada la función correctamente
              style={{ 
                width: "170px",  // 🔹 Reduce el ancho del filtro
                height: "23px",  // 🔹 Reduce la altura del filtro
                padding: "5px 10px",  // 🔹 Ajusta el espacio interno para que se vea bien
                borderRadius: "8px", 
                border: "1px solid #ccc", 
                backgroundColor: "#f9f9f9", 
                fontSize: "14px",  
                textAlign: "center"
              }}
              
            />

            {/* 🔹 FILTRO DE FECHA DE FIN */}
            <input
              type="date"
              value={fechaFin ? new Date(fechaFin).toISOString().split('T')[0] : ''}
              onChange={handleFechaFinChange} // Aquí debe estar asignada la función correctamente
              style={{ 
                width: "170px",  // 🔹 Reduce el ancho del filtro
                height: "23px",  // 🔹 Reduce la altura del filtro
                padding: "5px 10px",  // 🔹 Ajusta el espacio interno para que se vea bien
                borderRadius: "8px", 
                border: "1px solid #ccc", 
                backgroundColor: "#f9f9f9", 
                fontSize: "14px",  
                textAlign: "center"
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
                      <Button onClick={() => navigate(`/vermantenimiento/${mantenimiento.id}`)}>
                        Ver Mantenimiento
                      </Button>
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
      <Footer />
    </>
  );


};

export default ReporteActivo;
