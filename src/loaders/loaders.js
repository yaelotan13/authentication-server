function init(expressApp) {
  const express = require('express');
  const cookieParser = require('cookie-parser');
  const cors = require('cors');

  if (!expressApp) {
    throw new Error('expressApp must be provided');
  }

  expressApp.use(express.json());
  expressApp.use(cookieParser());
  expressApp.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
}

module.exports = {
  init,
};