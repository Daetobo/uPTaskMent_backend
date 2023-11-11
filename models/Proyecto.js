import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },
    tareas:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tarea',
        }
    ],
    equipo: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipo",
        },
}, {
    timestamps: true,
});

const Proyecto = mongoose.model("Proyecto", proyectoSchema);

export default Proyecto;