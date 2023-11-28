import mongoose, { Schema } from "mongoose";

const capacidadSchema = mongoose.Schema({
    sprint:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sprint'
    },
    capacidadDiaria:{
        type:Number,
        default:408
    }
},
{
    timestamps: true
});

const Capacidad = mongoose.model("Capacidad",capacidadSchema);

export default Capacidad;
