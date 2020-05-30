function init(expressApp) {
  const express = require('express');
  const cookieParser = require('cookie-parser');
  const cors = require('cors');

  if (!expressApp) {
    throw new Error('expressApp must be provided');
  }

  expressApp.use(express.json());
  expressApp.use(cookieParser());
  process.env.NODE_ENV === 'production' ?
  expressApp.use(cors({
    origin: 'https://yael-auth-server-api.herokuapp.com/',
    credentials: true,
  }))
  : 
  expressApp.use(cors({
    origin: `http://localhost:${process.env.PORT || 3333}`,
    credentials: true,
  }))
}

module.exports = {
  init,
};