const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var empleadoSchema = Schema({
  nombre: String,
  puesto: String,
  departamento: String,
  idEmpres: { type: Schema.Types.ObjectId, ref: "usuarios" },
});

module.exports = mongoose.model("empleados", empleadoSchema);
