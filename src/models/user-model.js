const db = require('../util/init-DB')();

async function insertUser(name, email, password) {
  try {
    await db.query(`INSERT INTO users (user_name, user_email, user_password) VALUES ('${name}', '${email}', '${password}')`);
    const result = await db.query('SELECT MAX(user_id) FROM users');
    return result.rows[0].max;
  } catch (e) {
    console.log('DB error occurred on insert new user'); 
    console.log(e);
  }
}

async function emailExists(email) {
  try {
    const result = await db.query(`SELECT EXISTS (SELECT * FROM users WHERE user_email = '${email}')`);
    return result.rows[0].exists;
  } catch (e) {
    console.log('DB error occurred on get user by email');
    console.log(e);
  }
}

async function getUserByEmail(email) {
  try {
    const result = await db.query(`SELECT user_id, user_name, user_password FROM users WHERE user_email='${email}'`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by email');
    console.log(e);
  }
}

module.exports = {
  insertUser,
  emailExists,
  getUserByEmail
}