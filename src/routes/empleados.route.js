const express = require("express");
const empleadosController = require("../controllers/empleados.controller");
const md_autenticacion = require("../middlewares/authentication");

var app = express.Router();

app.post(
  "/agregarEmpleado",
  md_autenticacion.Authentication,
  empleadosController.agregarEmpleados
);
app.put(
  "/editarEmpleado/:idEmpleado",
  md_autenticacion.Authentication,
  empleadosController.editarEmpleados
);
app.delete(
  "/eliminarEmpleado/:idEmpresa",
  md_autenticacion.Authentication,
  empleadosController.eliminarEmpleados
);
app.get(
  "/obtenerEmpleadosPorId/:idEmpleado",
  md_autenticacion.Authentication,
  empleadosController.obtenerEmpleadosPorId
);
app.get(
  "/obtenerEmpleadoPorNombre/:nomUs",
  md_autenticacion.Authentication,
  empleadosController.obtenerEmpleadosPorNombre
);
app.get(
  "/obtenerEmpleadosPorPuesto/:puestoEmpleado",
  md_autenticacion.Authentication,
  empleadosController.obtenerEmpleadosPorPuesto
);
app.get(
  "/obtenerDepartamento/:departamento",
  md_autenticacion.Authentication,
  empleadosController.obtenerDepartamento
);
app.get(
  "/empleados",
  md_autenticacion.Authentication,
  empleadosController.obtenerTodosEmpleados
);
app.get(
  "/generarPDF",
  md_autenticacion.Authentication,
  empleadosController.generarPDF
);
app.get(
  "/contarEmpleados",
  md_autenticacion.Authentication,
  empleadosController.contarEmpleados
);

module.exports = app;
