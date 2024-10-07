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
  res.render("./inventory/classification", {
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
  res.render("./inventory/views", {
    title: vehicleInfo,
    nav,
    grid,
  });
};

module.exports = invCont;