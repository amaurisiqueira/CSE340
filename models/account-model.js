const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
W4
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
W5  login activity
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* *****************************
*  W5  Update User account
* *************************** */
async function updatePartUserAccount(account_firstname, account_lastname, account_email , account_id){
  try {
    const sql = "UPDATE  account  set account_firstname = $1 , account_lastname = $2 , account_email = $3 WHERE account_id = $4 RETURNING *"
  

    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]) 
  } catch (error) {
    return error.message
  }
}

/* *****************************
*  W5  Update password account
* *************************** */
// account_id , hashedPasword
async function updatePartPasswordAccount( account_id , hashedPasword){
  try {
    const sql = "UPDATE  account  set account_password = $1 WHERE account_id = $2 RETURNING *";
    return await pool.query(sql, [hashedPasword, account_id]) 
  } catch (error) {
    return error.message
  }
}


module.exports={registerAccount , checkExistingEmail , 
  getAccountByEmail , updatePartUserAccount , 
  updatePartPasswordAccount }; 