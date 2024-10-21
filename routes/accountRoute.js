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
router.post(    '/login',
   regValidate.loginRules(),
   regValidate.checkLoginData ,
   utilities.handleErrors(accountController.accountLogin)
);
// router.get("/login",  accountController.buildLogin  );


router.get(
   '/logout',
   utilities.handleErrors(accountController.logout)
);


// w4    deliver registration view
router.get("/register",  utilities.handleErrors (accountController.buildRegister) );

// W4 register new users
router.post('/register',  regValidate.registationRules(),
                          regValidate.checkRegData,
                          utilities.handleErrors(accountController.registerAccount));

/************************************************
Deliver account Management View
W5  JWT Authorization activity
**************************************************/
router.get(
   '/',
    utilities.checkLogin ,
     utilities.handleErrors(accountController.buildManagement));


router.get(
      '/update',
       utilities.checkLogin ,
        utilities.handleErrors(accountController.buildUpdate));
   

      
//W5 update user data
router.post('/updatePartUser',  
      regValidate.UpdatePartUserRules(),
      regValidate.checkUpdatePartUserData,
      utilities.handleErrors(accountController.updatePartUserData));                       

// UpdatePartPasswordRules

router.post('/updatePartPassword',  
   regValidate.UpdatePartPasswordRules(),
   regValidate.checkUpdatePartPasswordData,
   utilities.handleErrors(accountController.updatePartPasswordData));  




module.exports = router;                         