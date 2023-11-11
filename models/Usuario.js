import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim:true,
    },
    user:{
        type: String,
        require: true,
        trim:true,
        unique:true
    },
    email:{
        type: String,
        require: true,
        trim:true,
        unique:true,
    },
    password:{
        type: String,
        require: true,
        trim:true,
    },
    rol:{
        type : String,
        trim: true,
        enum:['usuario', 'administrador'],
        default: 'usuario',
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
},{
    // crea dos columnas más, una de creado y otra de actualizado.
    timestamps:true
});

// encriptar el password antes de guardarlo
usuarioSchema.pre('save', async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password,salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm,this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;