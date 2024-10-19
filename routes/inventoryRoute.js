// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const inventoryValidate = require("../utilities/inventory-validation");
const invModel = require("../models/inventory-model");

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
router.post('/choose-action', (req, res) => {
    const action = req.body.action;
    const modelId = req.body.model_id[0]; 
    console.log('modelId:',modelId);
    if (action === 'modify') {
        // Redirigir a la ruta para modificar        
        
    } else if (action === 'delete') {
        // Redirigir a la ruta para eliminar
        //res.redirect(`/inv/form-delete-inventory/${modelId}`);
        res.redirect(`/inv/delete/${modelId}`);
    } 
});



// Ruta para cargar el formulario de eliminación
router.get('/form-delete-inventory/:id', async function (req, res){
  
  const modelId =  parseInt(req.params.id);
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByDetId(modelId)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
 
});




module.exports = router;