
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const config = require('./config');
const api = require('./api/index');

const app = express();

module.exports = async function main() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.set('config', config);

    app.use('/api', api.router);

    app.use(express.static('static'));

    app.use((customError, req, res, next) => {
        console.error(customError);
        res.status(customError.status).json({ error: { message: customError.message } });
    });

    return app;
}

