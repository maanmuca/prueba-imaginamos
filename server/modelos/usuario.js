let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
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
    email:
    {
        type: String,
        unique: true,
        required:true,
        trim:true,
        
    },
    telefono:{
        type: String,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:false
    },
    
});

usuarioSchema.path('email').validate(function (email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
 }, 'No es un email valido');


let usuarios = mongoose.model('usuarios',usuarioSchema);

module.exports ={usuarios};