const db = require('../util/init-DB')();

async function insertToken(userID, token, expirationDate) {
  try {
    await db.query(`INSERT INTO sessions (token, user_id, expiration_date) VALUES ('${token}', ${userID}, to_timestamp(${expirationDate}));`);
  } catch (e) {
    console.log('DB error occurred on insertToken');
    console.log(e);
  }
}

async function tokenIsValid(token) {
  try {
    const result = await db.query(`SELECT EXISTS(SELECT FROM sessions WHERE token='${token}')`);
    return result.rows[0].exists;
  } catch (e) {
    console.log('DB error occurred on tokenIsValid');
    console.log(e);
  }
}

async function deleteToken(token) {
  try {
    await db.query(`DELETE FROM sessions WHERE token='${token}'`);
  } catch (e) {
    console.log('DB error occurred on deleteToken');
    console.log(e);
  }
}

module.exports = {
  insertToken,
  tokenIsValid,
  deleteToken,
};
