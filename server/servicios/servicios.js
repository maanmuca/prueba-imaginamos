
const moment = require('moment');
const {drivers} = require('../modelos/driver');
const {pedidos} = require('../modelos/pedido');
let mongoose = require('mongoose');


let myFunctions ={
    chequearFechas:function (timeStampEntregaMin,timeStampEntregaMax)
        {
            let rightNow = new Date();
            let timestamp = rightNow.getTime();
            let maxTime = moment(parseInt(timeStampEntregaMin)).add(8, 'hours');
            let minTime = moment(parseInt(timeStampEntregaMin)).add(1, 'hours');
            return new Promise((resolve, reject) => 
            {
                    // console.log(timeStampEntregaMin+"..."+timeStampEntregaMax+"..."+maxTime+"..."+timestamp);   
                    if (timeStampEntregaMin > timestamp && timeStampEntregaMax<= maxTime && timeStampEntregaMax>=minTime ) resolve("Fechas son correctas");
                    if (timeStampEntregaMin<= timestamp || timeStampEntregaMax> maxTime || timeStampEntregaMax<minTime ) reject("Hay un problema con las fechas ingresadas");
            
            });
        },
        asignarDriver:function()
         {
            return new Promise((resolve, reject) => 
            {
                drivers.find({},function(err,allMyDrivers)
                {
                    if(err) reject();
                    // console.log("allMyDrivers..."+JSON.stringify(allMyDrivers));
                    let driversDisponibles = [];
                    for (let i = 0; i < allMyDrivers.length; i++) {
                    if(allMyDrivers[i].pedidos.length==0) driversDisponibles.push(allMyDrivers[i]);
                    }
                    // console.log("driversDisponibles..."+JSON.stringify(driversDisponibles));
                    if(driversDisponibles.length>0)
                    {
                        let conductorAleatorio = driversDisponibles[Math.floor(Math.random() * driversDisponibles.length)];
                        // console.log("conductorAleatorio..."+JSON.stringify(conductorAleatorio));
                        resolve(conductorAleatorio);
                    } 
                    if(driversDisponibles.length==0)
                    {
                        let numberOfOrders =[];
                        for (let i = 0; i < allMyDrivers.length; i++) {
                            numberOfOrders.push(allMyDrivers[i].pedidos.length);
                        }
                        var indexMenor = numberOfOrders.indexOf(Math.min(...numberOfOrders));
                        let conductorAleatorio = allMyDrivers[indexMenor];
                        resolve(conductorAleatorio);
        
                    }
                    else reject("Problemas asignando driver");
                });
           });
           
        },
        pedidosPorConductor:function(myDriverId){
            return new Promise((resolve, reject) => 
            {
                drivers.findOne({driverId:myDriverId},function(err,myDriver){
                    if(err) reject("Problemas obteniendo datos del driver");
                    let driverId = myDriver._id;
                    let misPedidos = myDriver.pedidos;
                    let misPedidosId =[];
                    for (let i = 0; i < misPedidos.length; i++) {
                        misPedidosId.push(mongoose.Types.ObjectId(misPedidos[i].idPedido));
                    }
            
                    pedidos.find({'_id': { $in: misPedidosId}}, function(err, pedidosPorConductor){
                         if(err) reject("Problemas obteniendo datos de los pedidos");
                         pedidosPorConductor.sort((a,b) => a.timeStampEntregaMin.localeCompare(b.timeStampEntregaMin));
            
                          for (let i = 0; i < pedidosPorConductor.length; i++) {
                            pedidosPorConductor[i].timeStampEntregaMin = moment.unix((pedidosPorConductor[i].timeStampEntregaMin)/1000).format("DD-MM-YYYY, HH:mm");
                            pedidosPorConductor[i].timeStampEntregaMax = moment.unix((pedidosPorConductor[i].timeStampEntregaMax)/1000).format("DD-MM-YYYY, HH:mm");
                          }
                        
                         let misPedidosPorConductor = {driverId:driverId,tareasPorDia:pedidosPorConductor};
                         resolve(misPedidosPorConductor);
                    });
             
                });
           });

        }
}

module.exports = myFunctions;