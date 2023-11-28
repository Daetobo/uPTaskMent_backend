import mongoose from "mongoose";
import Tarea from "../models/Tarea.js"
import Sprint from "../models/Sprint.js";

const agregarTarea = async (req, res) => {
    const { sprint } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sprint)) {
        const error = new Error('Id sprint no válido');
        return res.status(404).json({msg: error.message});
    }

    const sprintExiste = await Sprint.findById(sprint)

    if (!sprintExiste) {
        const error = new Error('Sprint no existe');
        return res.status(404).json({msg: error.message});
    }

    // solo el creador del proyecto puede añadir tareas
    if (sprintExiste.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para añadir Tareas');
        return res.status(403).json({ msg: error.message });
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        sprintExiste.tareas.push(tareaAlmacenada._id)
        await sprintExiste.save();
        res.json(tareaAlmacenada); 
    } catch (error) {
        console.log(error)
    }

}

const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('ID no válido');
        return res.status(404).json({ msg: error.message });
    }

    // populate hace la relación entre schemas referenciados en el modelo
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('La Tarea no Existe');
        return res.status(404).json({ msg: error.message });
    }

    // Error cuando consulta tareas que no fueron creadas por el usuario creador del proyecto
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no Válida');
        return res.status(403).json({ msg: error.message });
    }


    res.json(tarea);
}

const actualizarTarea = async (req, res) => {
    const { id } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('ID no válido');
        return res.status(404).json({ msg: error.message });
    }

    // populate hace la relación entre schemas referenciados en el modelo
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('La Tarea no Existe');
        return res.status(404).json({ msg: error.message });
    }

    // Error cuando consulta tareas que no fueron creadas por el usuario creador del proyecto
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no Válida');
        return res.status(403).json({ msg: error.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.comentario = req.body.comentario || tarea.comentario;
    tarea.estado = req.body.estado || tarea.estado;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.sprint = req.body.sprint || tarea.sprint;
    tarea.tiempo = req.body.tiempo || tarea.tiempo;
    tarea.nota = req.body.nota || tarea.nota;
    tarea.fechaInicio = req.body.fechaInicio || tarea.fechaInicio;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareAlmacenada = await tarea.save();
        res.json(tareAlmacenada)
    } catch (error) {
        console.log(error);
    }
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('ID no válido');
        return res.status(404).json({ msg: error.message });
    }
    
    // populate hace la relación entre schemas referenciados en el modelo
    const tarea = await Tarea.findById(id);
    console.log(tarea)
    if (!tarea) {
        const error = new Error('La Tarea no Existe');
        return res.status(404).json({ msg: error.message });
    }
    
    // Error cuando consulta tareas que no fueron creadas por el usuario creador del proyecto
    // if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    //     const error = new Error('Acción no Válida');
    //     return res.status(403).json({ msg: error.message });
    // }

    try {
        const sprint = await Sprint.findById(tarea.sprint)
        sprint.tareas.pull(tarea._id)
        // promesa que permite solucionar varias peticiones al tiempo
        await Promise.allSettled([await sprint.save(), await tarea.deleteOne()])
        res.json({msg: "La Tarea se Eliminó Correctamente"})

    } catch (error) {
        console.log(error)
    }
}

const cambiarEstado = async (req, res) => {

}


export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}