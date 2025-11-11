import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";

const AnalisisHV = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [anio1, setAnio1] = useState("");
  const [anio2, setAnio2] = useState("");
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [tipoAnalisis, setTipoAnalisis] = useState("horizontal"); // 👈 Nuevo

  // Cargar empresas
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/empresas")
      .then((res) => setEmpresas(res.data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, []);

  // Cargar años disponibles según empresa
  useEffect(() => {
    if (empresaSeleccionada) {
      axios
        .get(`http://localhost:8080/api/v1/estados-financieros/anios/${empresaSeleccionada}`)
        .then((res) => setAniosDisponibles(res.data))
        .catch((err) => console.error("Error al cargar años:", err));
    }
  }, [empresaSeleccionada]);

  const handleGenerarReporte = () => {
    axios
      .get("http://localhost:8080/api/analisis/reporte-interno", {
        params: { empresaId: empresaSeleccionada, anio1, anio2 },
      })
      .then((res) => {
        setReporte(res.data);
        console.log("Reporte recibido:", res.data);
      })
      .catch((err) => console.error("Error al generar reporte:", err));
  };

  const datos = tipoAnalisis === "horizontal"
    ? reporte?.analisisHorizontal || []
    : reporte?.analisisVertical || [];

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">Análisis Comparativo Interno</Typography>

      {/* Selectores */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Empresa</InputLabel>
          <Select
            value={empresaSeleccionada}
            label="Empresa"
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
          >
            {empresas.map((e) => (
              <MenuItem key={e.empresaId} value={e.empresaId}>
                {e.nombreEmpresa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Año Base</InputLabel>
          <Select value={anio1} label="Año Base" onChange={(e) => setAnio1(e.target.value)}>
            {aniosDisponibles.map((anio) => (
              <MenuItem key={anio} value={anio}>
                {anio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Año Comparación</InputLabel>
          <Select value={anio2} label="Año Comparación" onChange={(e) => setAnio2(e.target.value)}>
            {aniosDisponibles.map((anio) => (
              <MenuItem key={anio} value={anio}>
                {anio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={!empresaSeleccionada || !anio1 || !anio2}
        >
          Generar Reporte
        </Button>
      </Box>

      {/* Botones de vista */}
      {reporte && (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant={tipoAnalisis === "horizontal" ? "contained" : "outlined"}
            onClick={() => setTipoAnalisis("horizontal")}
          >
            Análisis Horizontal
          </Button>
          <Button
            variant={tipoAnalisis === "vertical" ? "contained" : "outlined"}
            onClick={() => setTipoAnalisis("vertical")}
          >
            Análisis Vertical
          </Button>
        </Box>
      )}

      {/* Tabla de resultados */}
      {reporte && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Cuenta</TableCell>
                {tipoAnalisis === "horizontal" ? (
                  <>
                    <TableCell>Saldo {anio1}</TableCell>
                    <TableCell>Saldo {anio2}</TableCell>
                    <TableCell>Variación Absoluta</TableCell>
                    <TableCell>Variación Relativa (%)</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>% Vertical {anio1}</TableCell>
                    <TableCell>% Vertical {anio2}</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((linea, i) => (
                <TableRow key={i}>
                  <TableCell>{linea.codigoCuenta}</TableCell>
                  <TableCell>{linea.nombreCuenta}</TableCell>
                  {tipoAnalisis === "horizontal" ? (
                    <>
                      <TableCell>{linea.saldoAnio1}</TableCell>
                      <TableCell>{linea.saldoAnio2}</TableCell>
                      <TableCell>{linea.variacionAbsoluta}</TableCell>
                      <TableCell>{linea.variacionRelativa?.toFixed(2)}%</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{linea.porcentajeVerticalAnio1?.toFixed(2)}%</TableCell>
                      <TableCell>{linea.porcentajeVerticalAnio2?.toFixed(2)}%</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AnalisisHV;
