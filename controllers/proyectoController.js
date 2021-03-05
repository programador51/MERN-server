const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
const { request } = require('express');

exports.crearProyecto = async(request,response)=>{
    const erros = validationResult(request);
    if(!erros.isEmpty()){
        return response.status(400).json({erros:erros.array()})
    }
    
    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(request.body);

        // Guardar el creado via web token
        proyecto.creador = request.usuario.id;

        proyecto.save();
        response.json(proyecto);
    } catch (e) {
        console.log(`Hubo un error: ${e}`);
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async(request,response)=>{
    try{
        const proyectos = await Proyecto.find({creador:request.usuario.id}).sort({creado:-1});
        response.json({proyectos});
    }catch(e){
        console.log(error);
        response.status(500).send({msg:'Hubo un error: '+e});
    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async(request,response)=>{
    const erros = validationResult(request);
    if(!erros.isEmpty()){
        return response.status(400).json({erros:erros.array()})
    }

    //Extraer la inf. del proyecto
    const {nombre} = request.body;
    const nuevoProyecto = {};
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);

        //Si el proyecto existe o no
        if(!proyecto){
            return response.status(404).json({msg:`Proyecto no encontrado`});
        }

        //Verificar creador del proyecto
        if(proyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        //Actualizar
        /* Como un where en SQL */
        proyecto = await Proyecto.findByIdAndUpdate({_id:request.params.id},{
            $set:nuevoProyecto},{new:true});

        response.json({proyecto});

    } catch (e) {
        console.log(e);
        response.status(500).send('Error en el servidor');
    }
}

//Eliminar un proyecto por su id
exports.eliminarProyecto = async(request,response)=>{
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);

        //Si el proyecto existe o no
        if(!proyecto){
            return response.status(404).json({msg:`Proyecto no encontrado`});
        }

        //Verificar creador del proyecto
        if(proyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id:request.params.id});
        response.json({msg:`Proyecto eliminado`});


    } catch (e) {
        console.log(e);
        response.status(500).send('Error en el servidor: '+e);
    }
}