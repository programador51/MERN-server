const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (request,response) => {
    //Revisar si hay errores
    const erros = validationResult(request);
    if(!erros.isEmpty()){
        return response.status(400).json({erros:erros.array()})
    }

    //Extraer email password
    const {email,password} = request.body;

    try {
        //Revisar que sea usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return response.status(400).json({msg:`Usuario no existe`});
        }

        //Revisar el password
        /* Se le pasa el password hasheado */
        const isPassCorrect = await bcryptjs.compare(password,usuario.password);

        if(isPassCorrect===false){
            return response.status(400).json({msg:`Password Incorrecto`});
        }

        //Si todo es correcto Crear y firmar el JWT
        const payload = {
            usuario:{
                id:usuario.id
            }
        };

        //Firmar el JSONWeb Token
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600
        },(error,token)=>{
            if(error) throw error;

            //Mensaje confirmacion
            response.json({token:token});
        });
    } catch (e) {
        console.log(e);
    }
}

exports.usuarioAutenticado = async(request,response)=>{
    try {
        const usuario = await Usuario.findById(request.usuario.id).select('-password');
        response.json({usuario});
    } catch (error) {
        console.log(error);
        response.status(500).json({
            msg:'Hubo un error...'
        })
    }
}