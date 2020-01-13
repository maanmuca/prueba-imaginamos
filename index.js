const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

let apiRutas = require("./server/rutas/api-rutas");
let config = require("./server/config/keys");

//**********************************RUTAS*********************************************//

const app = express();
// const history = require('connect-history-api-fallback');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "html");
// app.use(cors());
app.use("/api",apiRutas);
// app.use(history());
// app.use(express.static(__dirname +'/server/public'));
// app.get("/", (req, res) => res.sendFile(__dirname + '/server/public/index.html'));



const PORT  = process.env.PORT || 8080;

app.listen(PORT,()=>{
  console.log(`Servidor en puerto ${PORT}`);
});

// //**********************************CONNEXION BASE DE DATOS*********************************************//


  mongoose.connect(process.env.MONGO_DB_URL ||config.MONGO_DB_URL ,{ useNewUrlParser: true,dbName:process.env.MONGO_DB_NAME || config.MONGO_DB_NAME,useUnifiedTopology: true  } ,() => {
    console.log("conectado a la base de datos");
  });

mongoose.connection.on('error', err => {
  console.log(err);
});
