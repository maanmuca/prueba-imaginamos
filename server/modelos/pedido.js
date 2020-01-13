let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let pedidoSchema = new Schema({
    idUsuario:
    {
        type: String,
        required:true,
        trim:true,
        unique:false
    },
    nombres:
    {
        type: String,
        required:true,
        trim:true,
        unique:false
    },
    apellidos:
    {
        type: String,
        required:true,
        minlength:1,
        trim:true,
        unique:false
    },
    telefono:{
        type: String,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:false
    },
    direccion:
    {
        type: String,
        required:true,
        trim:true,
        unique: false
    },
    timeStampEntregaMin:
    {
        type:String,
        required:true,
        trim:true,
    },
    timeStampEntregaMax:
    {
        type:String,
        required:true,
        trim:true,
    },  
    
});



let pedidos = mongoose.model('pedidos',pedidoSchema);

module.exports ={pedidos};