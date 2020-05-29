const db = require('../util/init-DB')();

async function insertUser(user) {
  try {
    await db.query({
      text: 'INSERT INTO users (firstname, lastname, status, email, password) VALUES ($1, $2, $3, $4, $5)',
      values: Object.values(user),
    });

    console.log('after query');
    const result = await db.query('SELECT MAX(userId) FROM users');
    return result.rows[0].max;
  } catch (e) {
    console.log(`DB error occurred on insert new user: ${e}`); 
  }
}

async function getUserByEmail(email) {
  try {
    const result = await db.query(`SELECT userid, firstname, lastname, password FROM users WHERE email='${email}'`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by email');
  }
}

async function getUserById(userID) {
  try {
    const result = await db.query(`SELECT firstname, lastname, status, email
    FROM users WHERE userid=${userID}`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by id');
  }
}

async function getUserByToken(token) {
  try {
    const result = await db.query(`SELECT firstname, lastname, status, email
    FROM users WHERE userid=(SELECT userid FROM sessions WHERE token='${token}')`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by token');
  }
}

async function getUserNameByToken(token) {
  try {
    const result = await db.query(`select firstname, lastname from users where userid=(select userid from sessions where token='${token}')`);
    return result.rows[0];

  } catch (e) {
    console.log('DB error occurred on get user by token');
  }
}

async function getUserIdByToken(token) {
  try {
    const result = await db.query(`select userid from users where userid=(select userid from sessions where token='${token}')`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on get user by token');
  }
}

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  getUserNameByToken,
  getUserIdByToken,
  getUserByToken,
}