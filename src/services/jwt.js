const moment = require('moment');
const jwt_simple = require('jwt-simple');
const secret = 'clave_secreta_IN6BM';

exports.crearToken = function(usuario){
    let payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        iat: moment().unix,
        wxp: moment().day(8, 'days').unix()
    }

    return jwt_simple.encode(payload , secret);
}