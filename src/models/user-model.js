const db = require('../util/init-DB')();

async function insertUser(user) {
  try {
    await db.query({
      text: 'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3)',
      values: Object.values(user),
    });

    const result = await db.query('SELECT MAX(user_id) FROM users');
    return result.rows[0].max;
  } catch (e) {
    console.log('DB error occurred on insert new user'); 
    console.log(e);
  }
}

async function emailExists(email) {
  console.log(`SELECT EXISTS (SELECT * FROM users WHERE user_email = '${email}')`)
  try {
    const result = await db.query(`SELECT EXISTS (SELECT * FROM users WHERE user_email = '${email}')`);
    console.log(result.rows[0].exists);
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

async function getUserById(userID) {
  try {
    const result = await db.query(`SELECT user_name, user_email
    FROM users WHERE user_id=${userID}`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by id');
    console.log(e);
  }
}

async function getUserByToken(token) {
  try {
    const result = await db.query(`SELECT user_name, user_email
    FROM users WHERE user_id=(SELECT user_id FROM sessions WHERE token='${token}')`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by token');
    console.log(e);
  }
}

async function getUserNameByToken(token) {
  try {
    const result = await db.query(`select user_name from users where user_id=(select user_id from sessions where token='${token}')`);
    return result.rows[0];

  } catch (e) {
    console.log('DB error occurred on get user by token');
    console.log(e);
  }
}

async function getUserIdByToken(token) {
  try {
    const result = await db.query(`select user_id from users where user_id=(select user_id from sessions where token='${token}')`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by token');
    console.log(e);
  }
}

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  getUserNameByToken,
  getUserIdByToken,
  getUserByToken,
  emailExists
}