/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.

 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const path = require('path');
const express = require("express");
//  const main = require("./routes/main.js");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const utilities = require("./utilities");
const baseController = require("./controllers/baseController");
const  inventoryRoute = require("./routes/inventoryRoute");

/******************
 Views
 *****************/

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root


/* ***********************
 * Routes
 *************************/
app.use(express.static(path.join(__dirname, 'public')))
//app.use(require("./routes/static")) ;
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", utilities.handleErrors(inventoryRoute))
// app.use(main);

app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Oh no! There was a crash. Maybe try a different route?",
  });
});
app.use(async (req, res, next) => {
  next({
    status: 500,
    message: "I am running away from my responsibilities. And it feels good.",
  });
});


 


/* ***********************
* Express Error Handler
* Place after all other middleware
* Error 404 
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
});

/*

Error 500
*/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error 500 at: "${req.originalUrl}": ${err.message}`);
  res.status(500).render("errors/error", {
    title: "Title",
    message: "I am running away from my responsibilities. And it feels good.",
    nav,
  });
});

 
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
