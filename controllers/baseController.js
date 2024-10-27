const utilities = require("../utilities/")
//
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();

  // console.log( "this is a flash message. Now");
    req.flash("notice","this is a flash message. Now");

  res.render("index", {title: "Home", nav})
}

module.exports = baseController