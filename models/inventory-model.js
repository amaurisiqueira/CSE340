const pool = require("../database/")

/* ***************************
 *  Get all classification data
 unit 3 
 * ************************** */
async function getClassifications(){
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name")
}

// exports function
module.exports = {
  getClassifications ,
};