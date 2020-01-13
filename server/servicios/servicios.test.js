let myFunctions = require("./servicios");
const {drivers} = require('../modelos/driver');


test('Las fechas son correctas', () => {
    let usuarioToTest = {"nombres":"werwerre","apellidos":"Perez","email":"jhkhjkhj@gmail.com","telefono":"3122217854","direccion":"Calle 12 No 45-65","timeStampEntregaMin":"1581620400000","timeStampEntregaMax":"1581634800000"};
    let timeStampEntregaMin =usuarioToTest.timeStampEntregaMin;
    let timeStampEntregaMax =usuarioToTest.timeStampEntregaMax; 
    return myFunctions.chequearFechas(timeStampEntregaMin,timeStampEntregaMax).then(data => {
      expect(data).toBe('Fechas son correctas');
    });
  });

test('Las fechas son incorrectas', () => {

    let usuarioToTest = {"nombres":"werwerre","apellidos":"Perez","email":"jhkhjkhj@gmail.com","telefono":"3122217854","direccion":"Calle 12 No 45-65","timeStampEntregaMin":"1550113200000","timeStampEntregaMax":"1550113200000"};
    let timeStampEntregaMin =usuarioToTest.timeStampEntregaMin;
    let timeStampEntregaMax =usuarioToTest.timeStampEntregaMax; 
    return myFunctions.chequearFechas(timeStampEntregaMin,timeStampEntregaMax).then(data => {
        
    }).catch(function (rejection)
    {
        expect(rejection).toBe('Hay un problema con las fechas ingresadas');
    });
});

test('Se asigna driver al pedido', () => {
    drivers.find({},function(err,allMyDrivers)
    {

        return myFunctions.asignarDriver().then(data => {

            let index = allMyDrivers.map(function(e){ return e.driverId}).indexOf(data.driverId);
            
            expect(data).toMatchObject(allMyDrivers[index]);
        })
    });
    
    
});