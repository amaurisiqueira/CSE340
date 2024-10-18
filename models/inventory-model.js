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

/* *****************************
*   Register new account
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    console.log('***************************************');
    console.log(sql);

    console.log('***************************************');

    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}
/* **********************
*   Check for existing Classification
* ********************* */
async function checkClassification(classification_name){
try {
  const sql = "SELECT * FROM classification WHERE classification_name = $1";
// console.log('Entro en check');

  const classification = await pool.query(sql, [classification_name]);
  return classification.rowCount;
} catch (error) {
  return error.message;
}
}    

/* **********************
*   Check for existing inventory
* ********************* */
async function checkVehicle(inv_make, inv_model){
  try {
    const sql = "SELECT * FROM inventory WHERE inv_make =$1 AND inv_model = $2"
    const vehicle = await pool.query(sql, [inv_make, inv_model])
    return vehicle.rowCount
  } catch (error) {
    return error.message
  }
  }   
/* *****************************
*   Register new Vehicle
* *************************** */
async function addVehicle(inv_make, inv_model, inv_year, 
	inv_description, inv_image, inv_thumbnail,
	inv_price, inv_miles, inv_color, classification_id){

    const inv_imageUrl     = inv_image.replace(/&#x2F;/g, '/');
    const inv_thumbnailUrl = inv_thumbnail.replace(/&#x2F;/g, '/');
    


  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, 
      inv_description, inv_imageUrl, inv_thumbnailUrl,
      inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}  


async function deleteInventoryItem(inv_id){
  try{
      const sql= "DELETE FROM inventory WHERE inv_id = $1";
      const data = await pool.query(sql,[inv_id]);
      return data;
  }catch(error){
    new Error("Delete inventory error");
  }

}


// exports function
module.exports = {
  getClassifications , 
  getInventoryByClassificationId,
  getVehicleByDetId,
  addClassification,
  checkClassification,
  checkVehicle,
  addVehicle,
  deleteInventoryItem,
};