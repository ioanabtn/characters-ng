const express = require('express');
const router = express.Router();

const { router: charactersRouter } = require('./controllers/charactersController');

router.use('/characters', charactersRouter);

module.exports = { router };