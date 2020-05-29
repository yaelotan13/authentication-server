const userModel = require('../models/user-model');
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

const requiredParamsForSignUpAreValid = user => user.name && user.email && user.password;

const requiredParamsForSignInAreValid = user => user.email && user.password;

async function signUp(user) {
  if (!requiredParamsForSignUpAreValid(user)) {
    return { clientError: 'required params not valid' };
  }

  const emailAlreadyExists = await userModel.emailExists(user.email);

  if (emailAlreadyExists) {
    return { clientError: 'email exists' };
  }

  const hash = crypto.createHash("sha256")
    .update(user.password)
    .digest('base64');
  user.password = hash;
  const userID = await userModel.insertUser(user.name, user.email, user.password);

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

  if (hashedPassword !== userFromDB.user_password) {
    return { clientError: 'password is not correct' }
  }

  return { userId : userFromDB.user_id }
}

module.exports = {
  signUp,
  validateUser,
};