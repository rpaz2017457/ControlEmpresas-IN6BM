const Empleado = require("../models/empleados.model");

function agregarEmpleados(req, res) {
  var parameters = req.body;
  var verificacion = req.user.rol;

  const empleadoModel = new Empleado();

  if (parameters.nombre && parameters.puesto && parameters.departamento) {
    empleadoModel.nombre = parameters.nombre;
    empleadoModel.puesto = parameters.puesto;
    empleadoModel.departamento = parameters.departamento;
    empleadoModel.idEmpresa = req.user.sub;
  }
  if (verificacion == "ROL_EMPRESA") {
    Empleado.find(
      {
        nombre: parameters.nombre,
        puesto: parameters.puesto,
        departamento: parameters.departamento,
        idEmpresa: req.user.sub,
      },
      (err, EmpleadoNuevo) => {
        if (EmpleadoNuevo.length == 0) {
          empleadoModel.save((err, EmpleadoH) => {
            if (err)
              return res
                .status(500)
                .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
            if (!EmpleadoH)
              return res
                .status(500)
                .send({
                  mensaje:
                    "ALGO SALIO MAL AL INTENTAR AGREGAR UN EMPLEADO, INTENTELO DE NUEVO",
                });
            return res.status(200).send({ Empleados: EmpleadoH });
          });
        } else {
          return res
            .status(404)
            .send({ message: "SE ESTA INTENTANDO CREAR EL MISMO EMPLEADO" });
        }
      }
    );
  } else {
    return res
      .status(404)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA AGREGAR ESTA SOLICITUD",
      });
  }
}

function editarEmpleados(req, res) {
  var idEmpleado = req.params.idEmpleado;
  var parametros = req.body;
  var idempresa = req.user.sub;

  if (req.user.rol == "ROL_EMPRESA") {
    Empleado.findOneAndUpdate(
      { _id: idEmpleado, idEmpresa: idempresa },
      parametros,
      { new: true },
      (err, usuarioGuardado) => {
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!usuarioGuardado)
          return res
            .status(400)
            .send({
              message: "NO SE PUDO EDITAR AL EMPLEADO, INTENTELO DE NUEVO",
            });
        return res.status(200).send({ empleados: usuarioGuardado });
      }
    );
  } else {
    return res
      .status(500)
      .send({ message: "NO SE POSEEN LOS PERMISOS PARA EDITAR EMPLEADOS" });
  }
}

function eliminarEmpleados(req, res) {
  var idEmpresa = req.params.idEmpresa;
  var verificacion = req.user.rol;
  var idempresa = req.user.sub;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.findOneAndDelete(
      { _id: idEmpresa, idEmpresa: idempresa },
      (err, empleadoEliminado) => {
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!empleadoEliminado)
          return res
            .status(500)
            .send({
              message: "NO SE PUDO ELIMINAR AL EMPLEADO, INTENTELO DE NUEVO",
            });

        return res.status(200).send({ empleados: empleadoEliminado });
      }
    );
  } else {
    return res
      .status(404)
      .send({ message: "NO SE POSEEN LOS PERMISOS PARA ELIMINAR EMPLEADOS" });
  }
}

function obtenerEmpleadosPorId(req, res) {
  var idEmpleado = req.params.idEmpleado;
  var verificacion = req.user.rol;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.findById(idEmpleado, (err, empleadoEnc) => {
      if (err)
        return res
          .status(500)
          .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
      if (!empleadoEnc)
        return res
          .status(404)
          .send({
            message:
              "NO SE HA ENCONTRADO AL EMPLEADO, VERIFIQUE LOS DATOS E INTENTELO DE NUEVO",
          });
      return res.status(200).send({ empleadoEncontrado: empleadoEnc });
    }).populate("idEmpresa", "nombre");
  } else {
    return res
      .status(500)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA REALIZAR ESTA SOLICITUD",
      });
  }
}
function obtenerEmpleadosPorNombre(req, res) {
  var nombreUsuario = req.params.nomUs;
  var verificacion = req.user.rol;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.find(
      {
        idEmpresa: req.user.sub,
        nombre: { $regex: nombreUsuario, $options: ["i", "x"] },
      },
      (err, usuarioEncontrado) => {
        console.log(err);
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!usuarioEncontrado)
          return res
            .status(404)
            .send({
              message:
                "NO SE HA ENCONTRADO AL EMPLEADO, VERIFIQUE LOS DATOS E INTENTELO DE NUEVO",
            });
        return res.status(200).send({ empleados: usuarioEncontrado });
      }
    ).populate("idEmpresa", "nombre");
  } else {
    return res
      .status(500)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA REALIZAR ESTA SOLICITUD",
      });
  }
}

function obtenerEmpleadosPorPuesto(req, res) {
  var puestoEmpleado = req.params.puestoEmpleado;
  var verificacion = req.user.rol;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.find(
      {
        idEmpresa: req.user.sub,
        puesto: { $regex: puestoEmpleado, $options: ["i", "x"] },
      },
      (err, usuarioEncontrado) => {
        console.log(err);
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!usuarioEncontrado)
          return res
            .status(404)
            .send({
              message:
                "NO SE HA ENCONTRADO AL EMPLEADO, VERIFIQUE LOS DATOS E INTENTELO DE NUEVO",
            });
        return res.status(200).send({ empleados: usuarioEncontrado });
      }
    ).populate("idEmpresa", "nombre");
  } else {
    return res
      .status(500)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA REALIZAR ESTA SOLICITUD",
      });
  }
}

function obtenerDepartamento(req, res) {
  var departamento = req.params.departamento;
  var verificacion = req.user.rol;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.find(
      {
        idEmpresa: req.user.sub,
        departamento: { $regex: departamento, $options: ["i", "x"] },
      },
      (err, empleadoEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!empleadoEncontrado)
          return res
            .status(404)
            .send({
              message:
                "NO SE HA ENCONTRADO ALGUN EMPLEADO ASIGNADO A ESE DEPARTAMENTO",
            });
        return res.status(200).send({ empleados: empleadoEncontrado });
      }
    ).populate("idEmpresa", "nombre");
  } else {
    return res
      .status(500)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA REALIZAR ESTA SOLICITUD",
      });
  }
}

function obtenerTodosLosEmpleados(req, res) {
  var verificacion = req.user.rol;

  if (verificacion == "ROL_EMPRESA") {
    Empleado.find({ idEmpresa: req.user.sub }, (err, empleadoEncontrado) => {
      for (let i; i < empleadoEncontrado.length; ) {}
      return res.status(200).send({ empleados: empleadoEncontrado });
    }).populate("idEmpresa", "nombre");
  } else {
    return res
      .status(500)
      .send({
        message: "NO SE POSEEN LOS PERMISOS PARA REALIZAR ESTA SOLICITUD",
      });
  }
}

function generarPDF(req, res) {
  var usuario = req.user.sub;

  Empleado.find({ idEmpresa: usuario }, (err, empleadoSend) => {
    if (err)
      return res
        .status(500)
        .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
    const fs = require("fs");
    const pdfmake = require("pdfmake");
    var fonts = {
      Helvetica: {
        normal: ".../fonts/helvetica/Helvetica.ttf",
        bold: ".../fonts/helvetica/Helvetica-Bold.ttf",
        italics: ".../fonts/helvetica/Helvetica-Oblique.ttf",
        bolditalics: ".../fonts/helvetica/Helvetica-BoldOblique.ttf",
      },
    };
    let pdf = new pdfmake(fonts);
    let content = [
      {
        text: "DESCRIPCIÓN DE LOS EMPLEADOS",
        fontSize: 18,
        alignment: "center",
        color: "#FFFFFF",
      },
    ];
    content.push({
      text: " ",
    });
    content.push({
      text: " ",
    });
    content.push({
      text: " ",
    });

    for (let i = 0; i < empleadoSend.length; i++) {
      let array = i + 1;
      content.push({
        text: " ",
      });
      content.push({
        text: " ",
      });
      content.push({
        text: " ",
      });
      content.push({
        text: [array + ")Empleado:"] + " " + empleadoSend[i].nombre,
      });
      content.push({
        text: "Puesto:" + " " + empleadoSend[i].puesto,
      });
      content.push({
        text: "Departamento:" + " " + empleadoSend[i].departamento,
      });
      content.push({
        text: "Nombre de la Empresa: ",
        alignment: "center",
        fontSize: 15,
        fontFamily: "Roboto",
        fontWeight: "bold",
      });
      content.push({
        text: empleadoSend[i].idEmpresa.nombre,
        alignment: "center",
        fontSize: 15,
        fontFamily: "Roboto",
        fontWeight: "bold",
      });
    }
    content.push({
      text: " ",
    });
    content.push({
      text: " ",
    });
    content.push({
      text: "Total de empleados:" + " " + empleadoSend.length,
      alignment: "end",
      color: "#310879",
      fontSize: 15,
    });

    let documento = pdf.createPdfKitDocument(docDefinition, {});
    documento.pipe(
      fs.createWriteStream("./src/pdfGenerado/reporteEmpleados.pdf")
    );
    documento.end();
    return res.status(200).send({ mensaje: "EL PDF SE HA REALIZADO" });
  }).populate("idEmpresa");
}
function contarEmpleados(req, res) {
  Empleado.count({ idEmpresa: req.user.sub }, (err, empleadoEncontrado) => {
    for (let i = 0; i < empleadoEncontrado.length; i++) {
      console.log(err);
    }
    return res.send({ empleado: empleadoEncontrado });
  });
}

module.exports = {
  agregarEmpleados,
  editarEmpleados,
  eliminarEmpleados,
  obtenerEmpleadosPorId: obtenerEmpleadosPorId,
  obtenerEmpleadosPorNombre: obtenerEmpleadosPorNombre,
  obtenerEmpleadosPorPuesto,
  obtenerDepartamento,
  obtenerTodosEmpleados: obtenerTodosLosEmpleados,
  generarPDF,
  contarEmpleados,
};
