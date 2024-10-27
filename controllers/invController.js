const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const ejs = require('ejs');


const invCont = {};
/* **************************************** *
 *  Build inventory by classification view  *
 * **************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  console.log('enter on invCont.buildByClassificationId ');
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();

  if(data == undefined ||  data.length <1){
    console.log('Data empty');
    res.status(500).render("errors/error", {
     title: 'Internal Server Error!',
     message:"Internal server error resolving the route!",
     nav
   })
    return;
  }

  const className = data[0].classification_name;
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* **************************************** *
 *  Build inventory by single vehicle view  *
 * **************************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const detail_id = req.params.detailId;
  const data = await invModel.getVehicleByDetId(detail_id);
  const grid = await utilities.buildVehicleDet(data);
  let nav = await utilities.getNav();
  if(data == undefined ||  data.length <1){
    console.log('Data empty');
    res.status(500).render("errors/error", {
     title: 'Internal Server Error!',
     message:"Internal server error resolving the route!",
     nav
   })
    return;
 }

  const vehicleInfo =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    res.render("inventory/views", {
    title: vehicleInfo,
    nav,
    grid,
  });
};


invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Vehicle Management";
  
  let classificationList = await utilities.buildAllInventoryList();

  res.render("inventory/management", {
    title: title,
    nav,     
    classification: classificationList,
    errors: null,
  });
};

//W4

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Add New Classification";
  res.render("inventory/add-classification", {
    title: title,
    nav,
    errors: null,
  });
};


/* ****************************************
 *  addClassification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  
  const { classification_name } = req.body ;

  /*console.log('******************************************************');
  console.log('classification_name');
  console.log(classification_name);
  console.log('******************************************************');*/
  const addResult = await invModel.addClassification(classification_name);
 console.log('addResult',addResult);
  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added  ${classification_name}.`
    );


     
    // const view = utilities.buildLoginView();
    let classificationList = await utilities.buildAllInventoryList();
    let nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classification: classificationList,
      errors: null,
       
    });
  } else {
    req.flash("notice", "Sorry, the classification was invalid."); 
    res.status(501).render("inventory/add-classification", {  
      title: "Add New Classification",
      nav,
      errors: null,
       
    });
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Add New Vehicle";
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: title,
    nav,
    classificationList,
    errors: null,
  });
};


/* ****************************************
 *  addVehicle
 * *************************************** */
invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const addResult = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added  ${inv_make} ${inv_model}.`
    );

    /*  let classificationList = await utilities.buildAllInventoryList();

  res.render("inventory/management", {
    title: title,
    nav,     
    classification: classificationList,
    errors: null,
  }); */
    // const view = utilities.buildLoginView();
    //let classificationList = await utilities.buildClassificationList();
    let classificationList = await utilities.buildAllInventoryList();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classification: classificationList,
      errors: null,
      // view,
    });
  } else {
    req.flash("notice", "Sorry, the vehicle was invalid.");
    // const view = utilities.buildRegistrationView();
    let classificationList = await utilities.buildClassificationList();
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      // view,
    });
  }
};


/* ***************************
 *  Build delete confirmation view
W5
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  console.log(inv_id);
  let nav = await utilities.getNav();
  const Datas = await invModel.getVehicleByDetId(inv_id);
  const itemData =Datas [0];
  console.log('itemData',itemData.inv_make);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
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
}


/* ***************************
 *  Delete Inventory item
W5
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav();



  console.log('DeleteItem enter');


console.log('req.body.inv_id:',req.body.inv_id);

  const inv_id = parseInt(req.body.inv_id);
console.log('inv_id :',inv_id);
  
  const deleteResult = await invModel.deleteInventoryItem(
    inv_id
  )

  if (deleteResult) {    
    req.flash("notice", `The deletion was successfully.`)
    res.redirect("/inv/")
  } else {
    
    req.flash("notice", "Sorry, the deletion was failed.");
    res.redirect("/inv/delete/inv_id");
    
  }


}//--------------


invCont.chooseAction =  async function (req, res){
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
}//-------------------



invCont.formDeleteInventory = async function (req, res){
  
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
 
}


/*

W6 Final 
*/
invCont.inventoryOnSales = async function (req, res){
    
  let nav = await utilities.getNav() ;
  let classificationList = await utilities.buildAllInventoryList();

  res.render("./inventory/inventory-on-sales", {
    title: "Inventory on Sale ",
    nav,
    errors: null,
    classification: classificationList,
  })
 
}




invCont.inventoryOnSalesCheckOnSale = async function (req, res){
  //let nav = await utilities.getNav() ;  
  //console.log('ENTRA ----> invCont.inventoryOnSalesCheckOnSale = async function (req, res)');
  const vehicleId = req.params.id;


  console.log('invCont.inventoryOnSalesCheckOnSale = async function (req, res)     vehicleId: ', vehicleId );
  
  let classificationList = await utilities.getVehicleIsOnSale(vehicleId);
  console.log( ' classificationList:',  classificationList );
  

    //res.render('inventory/vehicle-with-discount', { vehicleId ,  layout: 'false' } );
  if (classificationList.isOnSale) {
      res.render('inventory/vehicle-with-discount', { inv_id : vehicleId  , inv_discount: classificationList.discount ,  layout: false } );
  } else {
      res.render('inventory/vehicle-without-discount', { inv_id : vehicleId , inv_discount:0 , layout: false});
  }

}//



invCont.inventoryOnSalesSetDiscount = async function (req, res){
    
  // let nav = await utilities.getNav() ;
  const inv_id = parseInt(req.body.inv_id);  
  const inv_discount =  parseInt(req.body.inv_discount);

  console.log('invCont.inventoryOnSalesSetDiscount = async function (req, res)    inv_id:', inv_id , '  inv_discount:', inv_discount );
      
  let result = await utilities.inventoryOnSalesSetDiscount(inv_id,inv_discount );

  console.log(result.rowCount);
  
  if(result.rowCount){// .  
    req.flash(
        "notice",
          "Discount added successfull "
      );
  }else{

    req.flash(
      "notice",
        "ERROR adding Discount"
    );

  }
  
  
///inventory/inventory-on-sales
  res.redirect("/inv/inventory-on-sales");
//`Congratulations, you\'ve added  ${result.resp}.`
  


 }

 



invCont.inventoryOnSalesDelDiscount = async function (req, res){
    
  // let nav = await utilities.getNav() ;
  const inv_id = parseInt(req.body.inv_id);  
 

  console.log('invCont.inventoryOnSalesDelDiscount = async function (req, res)  inv_id:', inv_id  );
      
  let result = await utilities.inventoryOnSalesDelDiscount(inv_id );

  console.log(result.rowCount);
  
  if(result.rowCount){// .  
    req.flash(
        "notice",
          "Discount was delete successfull "
      );
  }else{

    req.flash(
      "notice",
        "ERROR deleting Discount"
    );

  }
  res.redirect("/inv/inventory-on-sales");  

 }



module.exports = invCont;

