import Sprint from "../models/Sprint.js";
import Equipo from "../models/Equipo.js";
import mongoose from "mongoose";

const nuevoSprint = async (req, res) => {
    const { equipo } = req.body;
    
    const sprint = new Sprint(req.body);

    if (!mongoose.Types.ObjectId.isValid(equipo)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }
    
    const existeEquipo = await Equipo.findById(equipo);

    if (!existeEquipo) {
        const error = new Error('Equipo no encontrado');
        return res.status(404).json({msg:error.message})
    }

    try {
        sprint.creador = req.usuario._id;
        const sprintAlmacenado = await sprint.save();
        existeEquipo.sprints.push(sprintAlmacenado._id)
        await existeEquipo.save();
        res.json(sprintAlmacenado)
        console.log(sprintAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const editarSprint = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('ID no válido');
        return res.status(404).json({ msg: error.message });
    }

    const sprint = await Sprint.findById(id).populate("equipo")

    if (!sprint) {
        const error = new Error('El sprint no existe')
        return res.status(404).json({ msg: error.message })
    }

    sprint.nombre = req.body.nombre || sprint.nombre;
    sprint.fechaInicio = req.body.fechaInicio || sprint.fechaInicio;
    sprint.fechaFinal = req.body.fechaFinal || sprint.fechaFinal;

    try {
        const sprintAlmacenado = await sprint.save();
        res.json(sprintAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const eliminarSprint = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('ID no válido');
        return res.status(404).json({ msg: error.message });
    }

    const sprint = await Sprint.findById(id)

    if (!sprint) {
        const error = new Error('Sprint no existe');
        return res.status(404).json({ msg: error.message });
    }

    try {
        const equipo = await Equipo.findById(sprint.equipo)
        equipo.sprints.pull(sprint._id)
        await Promise.allSettled([await equipo.save(),await sprint.deleteOne()])
        res.json({msg: "El Sprint se Eliminó Correctamente"})
    } catch (error) {
        console.log(error)
    }

}

export {
    nuevoSprint,
    editarSprint,
    eliminarSprint
}