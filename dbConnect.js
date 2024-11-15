const { Pool,Client } = require('pg')
//const { user } = require('pg/lib/defaults')

const client = new Client(
    {
        user:process.env.DB_USER,
        host:process.env.DB_HOST,
        database:process.env.DATABASE,
        password:process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        //ssl: false
        ssl:{ rejectUnauthorized: false }
      }
  )
  client.connect()
module.exports = client
 