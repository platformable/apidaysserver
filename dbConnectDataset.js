const { Pool, Client } = require("pg")
//const { user } = require('pg/lib/defaults')

const clientDataset = new Client({
  user: process.env.DB_USER_DATASET,
  host: process.env.DB_HOST_DATASET,
  database: process.env.DATABASE_DATASET,
  password: process.env.DB_PASSWORD_DATASET,
  port: process.env.DB_PORT_DATASET,
  //ssl: false
  ssl: { rejectUnauthorized: false },
})
clientDataset.connect()
module.exports = clientDataset
