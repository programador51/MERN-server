// https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const conection = require('./config/db');
const cors = require('cors');

/* Create server */
const app = express();

/* Habilitar CORS */
app.use(cors());

/* Conectar la BD */
conection.conectionDB();


/* Habilitar JSON desde las peticiones front */
app.use(express.json({extended:true}));

/* Heroku waits this variable name on the deployment 
Server and client cant have the same port
*/
const port = process.env.PORT || 4000;

// ROUTER-ROUTES-ENDPOINTS
/* https://expressjs.com/en/starter/basic-routing.html */
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//////////////////////////////////////////

app.listen(port,'0.0.0.0',()=>{
    console.log(`Server on port ${port}`);
});