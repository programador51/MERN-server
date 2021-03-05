const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (request,response) => {
    //Revisar si hay errores
    const erros = validationResult(request);
    if(!erros.isEmpty()){
        return response.status(400).json({erros:erros.array()})
    }

    //Extrar email password
    const {email,password} = request.body;

    try {
        //Revisar usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return response.status(400).json({msg: 'El correo ya existe'});
        }

        //crear el nuevo usuario
        usuario = new Usuario(request.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password,salt);

        //Guardar usuario
        await usuario.save();

        //Crear y firmar el JWT
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
        response.status(400).send('Hubo un error');
    }
}