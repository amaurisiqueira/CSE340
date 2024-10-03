/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const path = require('path');
const express = require("express");
const main = require("./routes/main.js");
const env = require("dotenv").config();
const app = express();
/******************
 Views
 *****************/

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

/* ***********************
 * Routes
 *************************/
app.use(express.static(path.join(__dirname, 'public')))
//app.use(require("./routes/static")) ;
app.use(main);

 
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {

  console.log(`app listening on ${host}:${port}`);

})
