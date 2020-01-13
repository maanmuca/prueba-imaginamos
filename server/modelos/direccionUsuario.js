let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let direccionUsuarioSchema = new Schema({
    idUsuario:
    {
        type: String,
        required:true,
        trim:true,
        unique:false
    },
    direccion:{
        type: String,
        required:true,
        trim:true,
        unique:false
    },
    
});


let direccionesUsuarios = mongoose.model('direccionesUsuarios',direccionUsuarioSchema);

module.exports ={direccionesUsuarios};