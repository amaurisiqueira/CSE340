// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

//w4 
  router.get("/login",  utilities.handleErrors (accountController.buildLogin) );
/************************* ***************
 W4 
modied W5
// Process the login attempt
***********************************/
router.post( 
   '/login',
   regValidate.loginRules(),
   regValidate.checkLoginData ,
   utilities.handleErrors(accountController.accountLogin)
);
// router.get("/login",  accountController.buildLogin  );




// w4    deliver registration view
router.get("/register",  utilities.handleErrors (accountController.buildRegister) );

// W4 register new users
router.post('/register',  regValidate.registationRules(),
                          regValidate.checkRegData,
                          utilities.handleErrors(accountController.registerAccount));


                        
module.exports = router;                         