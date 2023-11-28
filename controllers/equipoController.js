import Equipo from "../models/Equipo.js";
import Usuario from "../models/Usuario.js";

const obtenerEquipos = async (req, res) => {
    const equipos = await Equipo.find({
        $or:[
            {miembros : {$in: req.usuario}},
            {creador : {$in: req.usuario}},
        ]
    })//.select('-proyectos');

    res.json(equipos)
};

const nuevoEquipo = async (req, res) => {
    const equipo = new Equipo(req.body);
    equipo.creador = req.usuario._id;

    try {
        const equipoAlmacenado = await equipo.save();
        res.json(equipoAlmacenado)
    } catch (error) {
        console.log(error);
    }

};

const obtenerEquipo = async (req, res) => {
    const { id } = req.params;
    const equipo = await Equipo.findById(id)
    .populate('creador', "nombre" )
    .populate('miembros',"nombre user email")
    .populate({
        path:'sprints',
        select: "nombre fechaInicio fechaFinal",
        populate:{
            path:'tareas'
        }
    });
    
    if (!equipo) {
        const error = new Error('Equipo no Encontrado');
        return res.status(404).json({msg: error.message})
    }

    if (equipo.creador._id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del equipo');
        return res.status(404).json({msg: error.message})
    }
    res.json(equipo)
};

const editarEquipo = async (req, res) => {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);

    if (!equipo) {
        const error = new Error('Equipo no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if (equipo.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del equipo');
        return res.status(404).json({msg: error.message})
    }

    equipo.nombre = req.body.nombre || equipo.nombre;

    try {
        const equipoAlmacenado = await equipo.save();
        res.json(equipoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const eliminarEquipo = async (req, res) => {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);

    if (!equipo) {
        const error = new Error('Equipo no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if (equipo.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida, debes ser colaborador o creador del equipo');
        return res.status(404).json({msg: error.message})
    }

    try {
        await equipo.deleteOne();
        res.json({msg: 'Equipo Eliminado'})
    } catch (error) {
        console.log(error)
    }
};

const buscarMiembro = async (req, res) => {
    const { texto } = req.body;
    const usuarios = await Usuario.find({
        $or: [
            { nombre: { $regex: texto, $options: 'i' } }, // Búsqueda insensible a mayúsculas y minúsculas
            { email: { $regex: texto, $options: 'i' } },
            { user: { $regex: texto, $options: 'i' } },
          ],
    });

    res.json(usuarios)
};

const agregarMiembro = async (req, res) => {
    const { id } = req.params;
    const { emailMiembroEquipo } = req.body;

    const equipo = await Equipo.findById(id);
    
    if (!equipo) {
        const error = new Error('Equipo no encontrado')
        return res.status(404).json({ msg: error.message })
    }

    // solo el creador del equipo puede agregar colaboradores
    if (equipo.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(404).json({msg:error.message})
    }

    const usuario = await Usuario.findOne({email: emailMiembroEquipo}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    
    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg:error.message})
    }

    //El colaborador es el Admin del proyecto
    if (equipo.creador.toString() === usuario._id.toString() ) {
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(404).json({msg:error.message})
    }

    //El colaborador es el Admin del proyecto
    if (equipo.miembros.includes(usuario._id) ) {
        const error = new Error('El colaborador ya pertenece al proyecto');
        return res.status(404).json({msg:error.message})
    }

    equipo.miembros.push(usuario.id)
    await equipo.save()
    res.json({msg:'Colaborador Agregado Correctamente'})

};

const eliminarMiembro = async (req, res) => {
    
};

export {
    obtenerEquipos,
    nuevoEquipo,
    obtenerEquipo,
    editarEquipo,
    eliminarEquipo,
    buscarMiembro,
    agregarMiembro,
    eliminarMiembro
}

