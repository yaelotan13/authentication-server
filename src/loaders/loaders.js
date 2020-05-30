function init(expressApp) {
  const express = require('express');
  const cookieParser = require('cookie-parser');
  const cors = require('cors');

  if (!expressApp) {
    throw new Error('expressApp must be provided');
  }

  expressApp.use(express.json());
  expressApp.use(cookieParser());

  if (process.env.NODE_ENV === 'production') {
    console.log('running in production mode');
    expressApp.use(cors({
      origin: 'https://yael-auth-server-api.herokuapp.com/',
      credentials: true,
    }))
  } else {
    console.log('running in development mode');
    expressApp.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }))
  }
}

module.exports = {
  init,
};