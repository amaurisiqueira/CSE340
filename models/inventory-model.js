const pool = require("../database/")

/* ***************************
 *  Get all classification data
 unit 3 
 * ************************** */
async function getClassifications(){
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleByDetId(detail_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [detail_id]
    )
    return data.rows
  }catch(error){
    console.error("getdetailsbyid error " + error)
  }
}
// exports function
module.exports = {
  getClassifications , 
  getInventoryByClassificationId,
  getVehicleByDetId,
};