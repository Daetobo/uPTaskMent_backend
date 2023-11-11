import mongoose from "mongoose";

const equipoSchema = mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },
  miembros: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
  proyectos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
    },
  ],
},{
  timestamps: true,
});

const Equipo = mongoose.model("Equipo", equipoSchema);

export default Equipo;
