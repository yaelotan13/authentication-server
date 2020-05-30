const express = require('express');
const loaders = require('./loaders/loaders');
const userService = require('./services/user-service');
const tokenService = require('./services/token-service');

let app;

function startServer() {
  app = express();
  loaders.init(app);
  app.listen(process.env.PORT || 3333, () => console.log(`Server is listening on port ${process.env.PORT || 3333}!`));
}

startServer();

app.post('/users', async (req, res) => {
  console.log('got a request to sign up');
  console.log(req.body);
  const { userID, clientError } = await userService.signUp(req.body);
  if (clientError) {
    console.log('has error, sending 409 response');
    res.status(409).send(clientError);
  } else {
    console.log('no errors, setting a new token');
    const { token } = await tokenService.setNewToken(userID);
    res.cookie('token', token, { maxAge: 90000000, httpOnly: true, path:'/' });
    console.log('sending status 201');
    res.status(201).send('new user created')
  }
});

app.post('/signin', async (req, res) => {
  console.log('got a request to sign in');
  const { userId, clientError } = await userService.validateUser(req.body);
  if (clientError) {
    res.status(400).send(clientError);
  } else {
    const { token } = await tokenService.setNewToken(userId);
    res.cookie('token', token, { maxAge: 90000000, httpOnly: true, path:'/' });
    res.send('is logged in!');
  }
});

app.use('/', async (req, res, next) => {
  console.log('checking the token validity...');
  const { token, clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    req.body.userToken = token;
    next();
  }
});

app.post('/signout', async (req, res) => {
  console.log('got a request to sign out');
  await tokenService.deleteToken(req.body.userToken);
  res.clearCookie('token');
  res.status(202).send('is logged out');
});
