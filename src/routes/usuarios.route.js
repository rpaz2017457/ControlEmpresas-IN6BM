const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");
const md_autenticacion = require("../middlewares/authentication");

var app = express.Router();

app.post("/login", usuariosController.login);
app.post(
  "/agregarEmpresa",
  md_autenticacion.Authentication,
  usuariosController.agregarEmpresa
);
app.put(
  "/editarEmpresa/:idUser",
  md_autenticacion.Authentication,
  usuariosController.editarEmpresa
);
app.delete(
  "/eliminarEmpresa/:idUser",
  md_autenticacion.Authentication,
  usuariosController.eliminarEmpresa
);

module.exports = app;
