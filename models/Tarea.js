import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    notas: {
        type: String,
        trim: true,
        require: true,
    },
    comentario: {
        type: String,
        trim: true,
        default:'',
    },
    estado: {
        type: Boolean,
        trim: true,
        default: false,
    },
    fechaInicio: {
        type: Date,
        require: true,
        default: Date.now()
    },
    fechaFinal: {
        type: Date,
        require: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        trim: true,
        enum: ['Baja', 'Media', 'Alta'],
    },
    sprint: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sprint"
    },
    tiempo: {
        type: Number,
        trim: true,
        default: 0,
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
}, {
    timestamps: true
});

const Tarea = mongoose.model("Tarea",tareaSchema)

export default Tarea;