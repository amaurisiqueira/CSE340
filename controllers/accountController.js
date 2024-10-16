const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// w4 
async function buildLogin(req, res, next) {
      let nav = await utilities.getNav();

      console.log('antes cargar login');
      res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
    console.log('despues cargar login');
  };

// w4 
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
      res.render("account/register", {
      title: "Register",
      nav,
      errors:null,
    });
  };
  

/* ****************************************
*  Process Registration
* ****************************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body ;

  let hashedPasword;

  try {
    hashedPasword= await bcrypt.hashSync( account_password,10);
  } catch (error) {

    req.flash("notice"
    ,"Sorry, there was an error processing the registration.");
    res.status(500).render("account/register", { title:"Registration", nav, errors: null,})
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPasword
  );


  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
  }
};


/************************************************************
 Process login request
 W5, login process activity
 **************************************************************/
 async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600*1000 });
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.redirect("/account/");
    }
    
  } catch (error) {
    return new Error('Access forbidden');
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  //try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Invalid password. Please try again.")
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
/*  } catch (error) {
    req.flash("notice", "An error occurred. Please try again later.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }*/
}


module.exports = { buildLogin , buildRegister , registerAccount , accountLogin , accountLogin };