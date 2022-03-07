const cors = require("cors");
var express = require("express");
var app = express();

const usuarioRuta = require("./src/routes/usuarios.route");
const empleadoRuta = require("./src/routes/empleados.route");

app.use(cors());
app.use("/api", usuarioRuta, empleadoRuta);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

module.exports = app;
