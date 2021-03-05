const jwt = require('jsonwebtoken');

module.exports = function(request,response,next){
    //Leer token del header
    const token = request.header('x-auth-token');
    
    //Revisar si no hay token
    if(!token){
        return response.status(401).json({msg:`Sesion cerrada. Inicia sesion nuevamente`});
    }

    //Validar el token
    try {
        const cifrado = jwt.verify(token,process.env.SECRETA);
        request.usuario = cifrado.usuario;
        next();
    } catch (e) {
        response.status(401).json({msg:`Token no valido`});
    }
}