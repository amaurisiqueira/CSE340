// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const inventoryValidate = require("../utilities/inventory-validation");
const invModel = require("../models/inventory-model");



// Route to build inventory by classification view
router.get("/type/:classificationId",   invController.buildByClassificationId);
// Route to build vehicle's info
router.get("/detail/:detailId",   invController.buildByDetailId);
//Route to edit by Inventory ID

//w4
router.get("/", utilities.checkAuthorization, utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification));
/*
// W4 register new users
router.post('/register',  regValidate.registationRules(),
                          regValidate.checkRegData,
                          utilities.handleErrors(accountController.registerAccount));

                          // W4 register new users
router.post('/register',  regValidate.registationRules(),
                          regValidate.checkRegData,
                          utilities.handleErrors(accountController.registerAccount));

*/
router.post(
  "/add-classification",  utilities.checkAuthorization,
  (req, res, next) => {
    const {classification_name} = req.body;

    console.log("Antes de  addClassificationRules",classification_name);
    next();
  },
  inventoryValidate.addClassificationRules(),
  /*(req, res, next) => {
    console.log("La ruta /add-classification ha sido llamada");
    next();
  },*/
  inventoryValidate.checkClassificationData,
 
  utilities.handleErrors(invController.addClassification)
);


router.get(
  "/add-inventory", utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddInventory)
);
 
router.post(
  "/add-inventory", utilities.checkAuthorization,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addVehicle)
);

/*
W5
*/
router.get(
  "/delete/:inv_id",utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteView)
);

/*
W5
*/
router.post("/delete", utilities.checkAuthorization, utilities.handleErrors(invController.deleteItem));

// Ruta para manejar la selección de acción 
router.post('/choose-action', utilities.checkAuthorization,     utilities.handleErrors( invController.chooseAction ));
  
  
// Ruta para cargar el formulario de eliminación
router.get('/form-delete-inventory/:id',utilities.checkAuthorization,   utilities.handleErrors ( invController.formDeleteInventory));




// final
router.get('/inventory-on-sales', utilities.checkAuthorization,   utilities.handleErrors ( invController.inventoryOnSales) );





module.exports = router;