require('dotenv').config();

const init = () => {
  const { Pool } = require('pg');

  const isProduction = process.env.NODE_ENV === 'production';
  
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
  
  const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
  })
  console.log(connectionString);
  console.log('got new pool');
  return pool;
}


module.exports = init;
  