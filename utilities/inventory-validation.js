const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};
/*
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};
*/


/* ****************************
 * Check data and return errors or continue to login
 * *************************** */
validate.addClassificationRules =  () => {


  //const { body, validationResult } = require("express-validator");
  //const { classification_name } = req.body ;


  //console.log( "classification_name");
  // console.log(classification_name );
  //  console.log( body("classification_name").toString());
 
  return [    
    
    body("classification_name")
      .trim()
      .isAlpha()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("A valid classification name is required.")     
      .custom(async (classification_name) => {
        console.log(classification_name);
        const classificationExists = await invModel.checkClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error("Classification name exists, please try again.");
        }
      }),
  ];
};


validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
  
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,       
    });
    return;
  }
  next();
};


/***********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // firstname is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .escape()
      .isNumeric().withMessage("Please enter just numbers")
      .notEmpty()
      .withMessage("Please provide a year."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a image."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail."),

    body("inv_price")
      .trim()
      .escape()
      .isNumeric().withMessage("Please enter just numbers")
      .notEmpty()
      .withMessage("Please provide a price."),

    body("inv_miles")
      .trim()
      .escape()
      .isNumeric().withMessage("Please enter just numbers")
      .notEmpty()
      .withMessage("Please provide a miles."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),

    body("classification_id")
      .trim()
      .escape()
      .isNumeric()
      .notEmpty()
      .withMessage("Please select a classification."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // const view = utilities.buildRegistrationView();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      // view,
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
    });
    return;
  }
  next();
};


module.exports = validate;