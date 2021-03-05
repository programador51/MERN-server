const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
const { response, request } = require('express');

//Crea una nueva tarea
exports.crearTarea = async(request,response) =>{
    const erros = validationResult(request);
    if(!erros.isEmpty()){
        return response.status(400).json({erros:erros.array()})
    }    
    
    try {
        const {proyecto} = request.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return response.status(400).json({msg:`Proyecto no encontrado`});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        //Crear la tarea
        const tarea = new Tarea(request.body);
        await tarea.save();

        response.json({tarea});
    } catch (e) {
        console.log(e);
        response.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async(request,response)=>{
    //Extraer el proyecto
    try {
        const {proyecto} = request.query;
        console.log(request.query);

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return response.status(400).json({msg:`Proyecto no encontrado`});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        //Obtener las tareas por proyecto
        /* Es como el WHERE de SQL */
        const tareas = await Tarea.find({proyecto});
        response.json({tareas})

    } catch (e) {
        console.log('Error:'+e);
        response.status(500).send('Hubo un error');
    }
}

// Actualizar tarea
exports.actualizarTarea = async(request,response)=>{
     try {
        const {proyecto,nombre,estado} = request.body;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(request.params.id);

        if(!tarea){
            return response.status(404).json({msg:'No existe esa tarea'});
        }
        
        /* Extraer proyecto */
        const existeProyecto = await Proyecto.findById(proyecto);
        
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        const nuevaTarea = {};

        if(nombre){
            nuevaTarea.nombre = nombre
        }
        if(estado){
            nuevaTarea.estado = estado
        }
        
        else{
            nuevaTarea.estado = estado;
        }

        tarea = await Tarea.findOneAndUpdate({_id:request.params.id},nuevaTarea,
            {new:true});

        response.json({tarea});


     } catch (e) {
         console.log(e);
        return response.status(500).send('Hubo un error')
    }
}

//Elimina una tarea
exports.eliminarTarea = async(request,response)=>{
    try {
        const {proyecto} = request.query;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(request.params.id);

        if(!tarea){
            return response.status(404).json({msg:'No existe esa tarea'});
        }
        
        /* Extraer proyecto */
        const existeProyecto = await Proyecto.findById(proyecto);
        
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==request.usuario.id){
            return response.status(401).json({msg:'No autorizado para el cambio'});
        }

        //Eliminar
        await Tarea.findOneAndRemove({_id:request.params.id});
        response.json({msg:'Tarea Eliminada'});      

     } catch (e) {
         console.log(e);
        return response.status(500).send('Hubo un error')
    }
}