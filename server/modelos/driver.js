let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let driverSchema = new Schema({
    driverId:{
        type: String,
        required:false,
        trim:true,
        unique:true
    },
    pedidos:
    [
        
        { 
            idPedido:{
                type: String,
                required:false,
                trim:true,
            }

        }
         
        
    ],
    
});


var drivers = mongoose.model('drivers',driverSchema);

module.exports ={drivers};