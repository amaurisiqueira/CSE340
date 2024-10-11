const utilities = require("../utilities/");


// w4 
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
      res.render("account/login", {
      title: "Login",
      nav,
    });
  }

// w4 
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
      res.render("account/register", {
      title: "Register",
      nav,
      errors:null,
    });
  }
  

  
module.exports = { buildLogin , buildRegister }