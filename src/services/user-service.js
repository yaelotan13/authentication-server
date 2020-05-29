const userModel = require('../models/user-model');
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

const requiredParamsForSignUpAreValid = (user) =>
  (user.firstName && user.lastName && user.email && user.password);

const requiredParamsForSignInAreValid = (user) => (user.email && user.password);

async function signUp(user) {
  if (!requiredParamsForSignUpAreValid(user)) {
    return { clientError: 'please specify first name, last name, email and password with the request' };
  }

  const hash = crypto.createHash("sha256")
    .update(user.password)
    .digest('base64');
  user.password = hash;
  const userID = await userModel.insertUser(user);

  return { userID }
}

async function validateUser(user) {
  if (!requiredParamsForSignInAreValid(user)) {
    return { clientError: 'required params not valid' };
  }

  const userFromDB = await userModel.getUserByEmail(user.email);
  if (!userFromDB) {
    return { clientError: 'email is not correct' }
  }

  const hashedPassword = crypto.createHash("sha256")
    .update(user.password)
    .digest('base64');

  if (hashedPassword !== userFromDB.password) {
    return { clientError: 'password is not correct' }
  }

  return { userId : userFromDB.userid, userName : `${userFromDB.firstname} ${userFromDB.lastname}` }
}

async function getUserNameByToken(token) {
  const { firstname, lastname } = await userModel.getUserNameByToken(token);
  return { userName : `${firstname} ${lastname}`};
}

async function getUserIdByToken(token) {
  const { userid } = await userModel.getUserIdByToken(token);
  return { userId: userid };
}

async function getUserByToken(token) {
  const user = await userModel.getUserByToken(token);
  if (!user) {
    return { clientError: `${token} not found` };
  }

  return { user };
}

async function getUserByID(userID) {
  const user = await userModel.getUserById(userID);
  if (!user) {
    return { clientError: `${userID} not found` };
  }

  return { user };
}

module.exports = {
  signUp,
  validateUser,
  getUserNameByToken,
  getUserIdByToken,
  getUserByID,
  getUserByToken,
};