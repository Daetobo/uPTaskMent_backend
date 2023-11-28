import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";
import Equipo from "../models/Equipo.js";


const nuevoProyecto = async (req, res) => {
    const { equipo } = req.body;
    const proyecto = new Proyecto(req.body)

    if (!mongoose.Types.ObjectId.isValid(equipo)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const existeEquipo = await Equipo.findById(equipo)

    if (!existeEquipo) {
        const error = new Error('Equipo no existe');
        return res.status(404).json({msg: error.message});
    }

    //solo creador del equipo puede añadir proyectos
    if (existeEquipo.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para añadir Proyectos');
        return res.status(403).json({ msg: error.message });
    }

    try {
        proyecto.creador = req.usuario._id
        const proyectoAlmacenado = await proyecto.save();
        existeEquipo.proyectos.push(proyectoAlmacenado._id)
        await existeEquipo.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }

};

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id).populate('tareas')

    if (!proyecto) {
        const error = new Error('Proyecto no existe');
        return res.status(404).json(error.message);
    }

    //solo creador del proyecto puede ver las tareas (ingresar al proyecto)
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del proyecto');
        return res.status(404).json({msg: error.message})
    }

    res.json(proyecto)
};

const editarProyecto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message});
    }

    //solo creador del proyecto puede editar
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del proyecto');
        return res.status(404).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaInicio = req.body.fechaInicio || proyecto.fechaInicio;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg:error.message});
    }

    //elimina solo el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del Proyecto');
        return res.status(404).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({msg: 'Proyecto Eliminado'})
    } catch (error) {
        console.log(error)
    }
};

const buscarColaborador = async (req, res) => {
    
};

const agregarColaborador = async (req, res) => {
    
};

const eliminarColaborador = async (req, res) => {
    
};

export {
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
}
