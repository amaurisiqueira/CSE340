const inventoryModel = require("../models/inventory-model")
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


module.exports = Util;