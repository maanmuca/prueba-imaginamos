const router = require('express').Router();
const {usuarios} = require('../modelos/usuario');
const {pedidos} = require('../modelos/pedido');
const {drivers} = require('../modelos/driver');
const {direccionesUsuarios} = require('../modelos/direccionUsuario');
const myFunctions = require('../servicios/servicios');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
let mongoose = require('mongoose');
/////////////////////////////////////////API USUARIOS/////////////////////////////////////

// https://localhost:8080/api/usuarios/

router.get('/usuarios',(req,res)=>{
    let usuarioEmail = req.query.email;
    usuarios.findOne({email:usuarioEmail},function(err,usuario){
        if(err) res.status(400).send(err);
        res.status(200).send(usuario);
        res.end();
    });
});

router.post('/usuarios',(req,res)=>{
    usuarios.create({nombres:req.body.nombres,apellidos:req.body.apellidos,email:req.body.email,telefono:req.body.telefono}, 
    function (err,usuario) 
    {
        if(err)  res.status(400).send(err); 
        else res.status(200).send("Se ha creado el usuario");
    });
    
});

router.put('/usuarios',(req,res)=>{
    let emailUsuario = req.query.email;
    usuarios.updateOne({email:emailUsuario},{nombres:req.body.nombres,apellidos:req.body.apellidos,telefono:req.body.telefono},function(err,usuarioUpdated){

        if(err)  res.status(400).send(err);
        res.status(200).send(usuarioUpdated);

    });
    
});

/////////////////////////////////////////API PEDIDOS/////////////////////////////////////

// https://localhost:8080/api/pedidos/

// Ruta para crear pedidos
router.post('/pedidos',(req,res)=>{

        let timeStampEntregaMin = req.body.timeStampEntregaMin;
        let timeStampEntregaMax = req.body.timeStampEntregaMax;

        myFunctions.chequearFechas(timeStampEntregaMin,timeStampEntregaMax).then(function(resolved){ 
                console.log(resolved);
                usuarios.create(
                    {   
                        nombres:req.body.nombres,
                        apellidos:req.body.apellidos,
                        email:req.body.email,
                        telefono:req.body.telefono,
                        
                    }, 
                    function (err,usuario) 
                    {
                        if(err)  res.status(400).send(err); 
                        else
                        {
                            direccionesUsuarios.create({idUsuario:usuario._id,direccion:req.body.direccion},
                                function(err,myDireccion){

                                if(err)  res.status(400).send(err); 

                                pedidos.create(
                                    {   
                                        idUsuario:usuario._id,
                                        nombres:req.body.nombres,
                                        apellidos:req.body.apellidos,
                                        telefono:req.body.telefono,
                                        direccion:myDireccion.direccion,
                                        timeStampEntregaMin:timeStampEntregaMin,
                                        timeStampEntregaMax:timeStampEntregaMax
                                    },
                                    function(err,pedido){

                                    if(err)  res.status(400).send(err); 
                                
                                    myFunctions.asignarDriver().then(function(myDriver){
                                        console.log(JSON.stringify(myDriver));
                                         let pedidosDriver = myDriver.pedidos;
                                         pedidosDriver.push({idPedido:pedido._id});
                                         drivers.updateOne({driverId:myDriver.driverId},{pedidos:pedidosDriver},
                                         function(err,driveUpdated){

                                            if(err) res.status(400).send("Error asignando pedido a driver");

                                            console.log("Driver was updated..."+JSON.stringify(driveUpdated));

                                            res.status(200).send(pedido);
                                         });
                                         
                                    }).catch(function (rejection)
                                    {
                                        // console.log("Promise Rejected..."+rejection);
                                        res.status(400).send("Hay problemas de asignacion con el driver");
                                    });
                                   
                                });
                            })
                        }
                    }); 
            
           
        }).catch(function (rejection)
        {
            // console.log("Promise Rejected..."+rejection);
            res.status(400).send("Hay problemas con la fecha y hora de entrega");
        });
});






/////////////////////////////////////////API DRIVERS/////////////////////////////////////

// https://localhost:8080/api/drivers/

router.get('/drivers',(req,res)=>{
    let myDriverId = req.query.driverId;
    // console.log("myDriverId..."+myDriverId);
    myFunctions.pedidosPorConductor(myDriverId).then(function(misPedidosPorConductor){ 
        res.status(200).send(misPedidosPorConductor);
    })
    .catch(function (rejection)
    {
        res.status(400).send(rejection);
    });
    
});

router.get('/allDrivers',(req,res)=>{
    drivers.find({},function(err,allDrivers){
        if(err) res.status(400).send(err);
        res.status(200).send(allDrivers);
    });
});

// Ruta para crear drivers
// router.get('/drivers',(req,res)=>{
//     let driversArray=[];
//     for (let i = 0; i < 5; i++) {
//         driversArray.push({driverId:uuidv1()});
//     }
//     drivers.insertMany(driversArray,function (err,drivers) 
//     {
//         if(err)  res.status(400).send(err); 
//         res.send(drivers);
//     }); 

// });





module.exports =router;