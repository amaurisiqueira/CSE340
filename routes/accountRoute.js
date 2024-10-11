// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

//w4 
router.get("/login",  utilities.handleErrors (accountController.buildLogin) );

// w4    deliver registration view
router.get("/register",  utilities.handleErrors (accountController.buildRegister) );


module.exports = router;