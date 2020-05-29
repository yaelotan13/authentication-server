const tokenModel = require('../models/token-model');
const randtoken = require('rand-token');

const ONE_DAY = 86400000;

async function setNewToken(userId) {
  const token = randtoken.generate(16);
  const currentDate = new Date();
  let expirationDate = currentDate.getTime() + ONE_DAY;
  await tokenModel.insertToken(userId, token, expirationDate);
  return { token };
}

async function tokenIsValid(cookie) {
  if (!cookie || !cookie.token) {
    return { clientError: 'authority error - no cookie' };
  }

  const tokenIsValid = await tokenModel.tokenIsValid(cookie.token);
  if (!tokenIsValid) {
    return { clientError: 'authority error - token not valid' }
  }

  return { token : cookie.token };
}

async function deleteToken(token) {
  await tokenModel.deleteToken(token);
}

module.exports = {
  setNewToken,
  tokenIsValid,
  deleteToken,
};