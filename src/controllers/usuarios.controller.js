const brycpt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Usuarios = require("../models/usuarios.model");

function login(req, res) {
  var parameters = req.body;

  Usuarios.findOne({ nombre: parameters.nombre }, (err, usuarioLogeado) => {
    if (err)
      return res
        .status(500)
        .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });

    if (usuarioLogeado) {
      brycpt.compare(
        parameters.password,
        usuarioLogeado.password,
        (err, passwordC) => {
          if (passwordC) {
            if (parameters.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioLogeado) });
            } else {
              usuarioLogeado.password = undefined;
              return res.status(200).send({ usuario: usuarioLogeado });
            }
          } else {
            return res
              .status(404)
              .send({ message: "CONTRASEÑA INCORRECTA, INTENTE DE NUEVO" });
          }
        }
      );
    } else {
      return res
        .status(404)
        .send({ message: "LOS DATOS INGRESADOS SON ERRONEOS" });
    }
  });
}

function agregarAlAdminDefault(req, res) {
  var usuarioModelo = new Usuarios();
  usuarioModelo.nombre = "ADMIN";
  usuarioModelo.rol = "ROL_ADMINISTRADOR";

  Usuarios.find({ nombre: "ADMIN" }, (err, usuarioGuardado1) => {
    if (usuarioGuardado1.length == 0) {
      brycpt.hash("123456", null, null, (err, passswordEncypt) => {
        usuarioModelo.password = passswordEncypt;
        usuarioModelo.save((err, usuarioGuardado2) => {
          return res.status(200).send({ usuario: usuarioGuardado2 });
        });
      });
    } else {
      console.log("ESTE USUARIO YA EXISTE");
    }
  });
}

function agregarEmpresa(req, res) {
  var parameters = req.body;
  const usuarioModel = new Usuarios();

  if (parameters.nombre && parameters.password) {
    usuarioModel.nombre = parameters.nombre;
    usuarioModel.rol = "ROL_EMPRESA";
    usuarioModel.password = parameters.password;
  }

  if (req.user.rol == "ROL_ADMINISTRADOR") {
    Usuarios.find({ nombre: parameters.nombre }, (err, usuarioGuardado1) => {
      if (usuarioGuardado1.length == 0) {
        brycpt.hash(parameters.password, null, null, (err, passswordEncypt) => {
          usuarioModel.password = passswordEncypt;
          usuarioModel.save((err, usuarioGuardado1) => {
            console.log(err);
            if (err)
              return res
                .status(500)
                .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
            if (!usuarioGuardado1)
              return res
                .status(500)
                .send({
                  message: "EL USUARIO NO SE HA AGREGADO, INTENTE DE NUEVO",
                });
            return res.status(202).send({ usuario: usuarioGuardado1 });
          });
        });
      } else {
        return res
          .status(404)
          .send({ message: "SE ESTA UTILIZANDO EL MISMO NOMBRE" });
      }
    });
  } else {
    return res
      .status(500)
      .send({
        message:
          "ERROR EN LA SOLICITUD, NO SE POSEEN PERMISOS DE ADMINISTRADOR",
      });
  }
}

function editarEmpresa(req, res) {
  var idUser = req.params.idUser;
  var parameters = req.body;

  if (req.user.rol == "ROL_ADMINISTRADOR") {
    Usuarios.findByIdAndUpdate(
      { _id: idUser },
      parameters,
      { new: true },
      (err, usuarioEditado) => {
        if (err)
          return res
            .status(500)
            .send({ message: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!usuarioEditado)
          return res
            .status(500)
            .send({ message: "NO SE EDITO ESTE USUARIO, INTENTELO DE NUEVO" });
        return res.status(200).send({ message: usuarioEditado });
      }
    );
  } else {
    return res
      .status(500)
      .send({
        message:
          "ERROR EN LA SOLICITUD, NO SE POSEEN PERMISOS DE ADMINISTRADOR",
      });
  }
}

function eliminarEmpresa(req, res) {
  var idUser = req.params.idUser;
  var parameters = req.body;

  if (req.user.rol == "ROL_ADMINISTRADOR") {
    Usuarios.findByIdAndDelete(
      { _id: idUser },
      parameters,
      (err, empresaEliminada) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "HA OCURRIDO UN ERROR EN LA SOLICITUD" });
        if (!empresaEliminada)
          return res
            .status(500)
            .send({ mensaje: "NO SE PUEDE ELIMINAR LA EMPRESA" });
        return res.status(200).send({ usuarios: empresaEliminada });
      }
    );
  } else {
    return res
      .status(500)
      .send({
        mensaje:
          "ERROR EN LA SOLICITUD, NO SE POSEEN PERMISOS PARA ELIMINAR UNA EMPRESA",
      });
  }
}

module.exports = {
  login,
  agregarAlAdminDefault,
  agregarEmpresa,
  editarEmpresa,
  eliminarEmpresa,
};
