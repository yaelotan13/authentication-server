const dotenv = require('dotenv');
dotenv.config();

async function init() {
  const { Client } = require('pg');
  const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });

  await client.connect().then(console.log('blog DB is connected!'));
  return client;
};

module.exports = init;