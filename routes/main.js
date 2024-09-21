const {Router} = require('express');
const main = Router();
// Static Routes
// Set up "public" folder / subfolders for static files
main.get('/',(req,res)=>{
  console.log('enter');
  res.render('index');
});
module.exports = main;
