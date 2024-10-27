const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 on developing
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
    })
    
      module.exports = {
        async query(text, params) {
          try {
            const res = await pool.query(text, params)
            // console.log("executing a query", { text })
            return res
          } catch (error) {
            console.error("giving error on running query", { text })
            throw error
          }
        },
      }
} else {
  //on production.
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}