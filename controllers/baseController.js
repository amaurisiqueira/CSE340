const utilities = require("../utilities/")
//
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();
  req.flash("notice","this is a flash message.");
  res.render("index", {title: "Homero", nav})
}

module.exports = baseController