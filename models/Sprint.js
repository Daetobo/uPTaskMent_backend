import mongoose from "mongoose";

const sprintSchema = mongoose.Schema({
    equipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Equipo'
    },
    nombre:{
        type:String,
        trim:true,
        required:true,
    },
    tareas:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tarea"
    }],
    capacidad:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Capacidad"
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    fechaInicio:{
        type:Date,
        require:true,
        default:Date.now()
    },
    fechaFinal:{
        type:Date,
        require:true,
        default:Date.now()
    },
},{
    timestamps: true
});

const Sprint = mongoose.model("Sprint",sprintSchema);

export default Sprint;