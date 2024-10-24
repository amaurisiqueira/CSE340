const inventoryModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken");
//require("dotenv").config()  ;

let Util = {};



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  
  let data = await inventoryModel.getClassifications()
  let list = '<ul class="mainnav__ul">';
  list += '<li class="mainnav__ul-li"><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += '<li class="mainnav__ul-li">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>";
  })
  list += "</ul>";

 // console.log('Util.getNav   List' , list);  
  return list;
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul class="grid_classification" id="inv-display">'
      data.forEach(vehicle => { 
        
        grid += '<li class="grid_classification_item">'
        
        grid +=  '<a class="grid_classification_item-a" href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"> <img  class="grid_classification_item-image" src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors"> </a>'
        
        grid += ' <div class="grid_classification_item-namePrice">'
        
        grid += ' <h2 class="grid_classification_item-model" >'
        grid += ' <a  class="grid_classification_item-a" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span class="grid_classification_item-price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div> </li> '
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildVehicleDet = async function(data){
    let grid
    if(data.length > 0){
      grid = '<div class="vehicle_detail">'
      data.forEach(vehicle => {
        grid += '<img class="vehicle_detail-image" src="' + vehicle.inv_image + '" alt="Image of '
        + vehicle.inv_make + ' ' + vehicle.inv_model+'">'
        grid += '<div class="vehicle_detail-container">'
        grid += '<h2 class="vehicle_detail-title">' + vehicle.inv_make + ' ' + vehicle.inv_model + " Details" +'</h2>'
        grid += '<div class="vehicle_detail-descriptions">'
        grid += '<p class="vehicle_detail-descriptions-back"><strong>Price: ' +'$ '+ new Intl.NumberFormat('en-US').format(vehicle.inv_price) +'</strong></p>'
        grid += '<p><strong>Description:</strong> ' + vehicle.inv_description +'</p>'
        grid += '<p class="vehicle_detail-descriptions-back"><strong>Color:</strong> ' + vehicle.inv_color +'</p>'
        grid += '<p><strong>Miles:</strong> ' +new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        grid += '</div>'
        grid += '</div>'
      })
      grid += '</div>'
    }else {
      grid += '<p class="notice">Sorry, We do not have the car that you are looking for.</p>'
    }
    return grid
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


Util.buildClassificationList = async function (classification_id = null) {
  let data = await inventoryModel.getClassifications()

  console.log( "Util.buildClassificationList.data: " ,data) ;

  let classificationList =

  '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


Util.buildAllInventoryList = async function (selectedModelId = null) {
  let data = await inventoryModel.getAllInventory(); // Obtener todos los vehículos
  let inventoryList =
      '<select name="model_id" id="modelList" required>';
  inventoryList += "<option value=''>Choose a Model</option>";
  
  data.forEach((row) => {
      inventoryList += '<option value="' + row.inv_id + '"';
      if (selectedModelId != null && row.inv_id == selectedModelId) {
          inventoryList += " selected ";
      }
      inventoryList += ">" + row.inv_model + "</option>";
  });
  
  inventoryList += "</select>";
  return inventoryList;
}


/* ****************************************
* W5 middleware to check JWT Token
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }

     
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
  W5 jwt
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
     req.flash("notice", "Please log in.")
     return res.redirect("/account/login")
  }
 }


/* ****************************************
 *  Check   user authorization
  W5 jwt
 * ************************************ */
  Util.checkAuthorization = (req, res, next) => {
   // console.log('res.locals.accountData.account_type',res.locals.accountData.account_type);

    // console.log('res.locals.accountData.account_type', res.locals.accountData.account_type.toUpperCase());
    if(res.locals.accountData==undefined){
      req.flash("notice", "Sorry, you don't have access.")
      res.redirect("/account/login")
    }else{
      if('EMPLOYEE,ADMIN'.includes( res.locals.accountData.account_type.toUpperCase()) ){
        next()
      } else {
         req.flash("notice", "Sorry, you don't have access.")
          res.redirect("/account/login")
      }
    }
   
  }
   

  Util.getAuthorizedName = (res) => {

    if (!res.locals.accountData) {
      return { 'name': 'Unknown', 'isAdmin':false};
    }
         
    return { 'name': res.locals.accountData.account_firstname
        , 'isAdmin':  'EMPLOYEE,ADMIN'.includes( res.locals.accountData.account_type.toUpperCase())
    }
    ;
  };
  




  /*

W6
  */
    Util.getVehicleIsOnSale = async function (vehicleId) {

      let data = await inventoryModel.getVehicleIsOnSale(vehicleId);
      return data
    }
      
      


module.exports = Util;