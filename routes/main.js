const {Router} = require('express');
const main = Router();
const utilities = require("../utilities/");
// Static Routes
// Set up "public" folder / subfolders for static files



// utilities.handleErrors(baseController.buildHome)


main.get('/',(req,res)=>{
  // console.log('enter');
  res.render('index');
});
module.exports = main;
