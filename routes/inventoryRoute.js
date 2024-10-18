// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const inventoryValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle's info
router.get("/detail/:detailId", invController.buildByDetailId);
//Route to edit by Inventory ID

//w4
router.get("/",  utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
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
  "/add-classification",  
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
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);
 
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addVehicle)
);

/*
W5
*/
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteView)
);

/*
W5
*/
router.post("/delete",utilities.handleErrors(invController.deleteItem));

// Ruta para manejar la selección de acción 
router.post('/inv/choose-action', (req, res) => {
    const action = req.body.action;
    const modelId = req.body.model_id; 
    if (action === 'modify') {
        // Redirigir a la ruta para modificar        
        
    } else if (action === 'delete') {
        // Redirigir a la ruta para eliminar
        res.redirect(`/inv/form-delete-inventory/${modelId}`);
    } 
});



// Ruta para cargar el formulario de eliminación
router.get('/inv/form-delete-inventory:id', (req, res) => {

  const modelId = req.params.id;
  // Aquí puedes cargar los datos necesarios para el formulario de eliminación
  res.render('delete-form', {  /* datos necesarios */ });
});




module.exports = router;