const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

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
  res.render("inventory/management", {
    title: title,
    nav,     
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
    let nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
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
    // const view = utilities.buildLoginView();
    let classificationList = await utilities.buildClassificationList();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
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



module.exports = invCont;