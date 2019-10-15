const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../auth');
const { router: charactersRouter } = require('./controllers/charactersController');
const { router: usersRouter } = require('./controllers/usersController');

router.use('/characters', charactersRouter);
router.use('/users', usersRouter);

module.exports = { router };