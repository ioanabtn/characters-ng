const express = require('express');
const router = express.Router();

const NodeCouchDb = require('node-couchdb');
const config = require('../../config');

const couch = new NodeCouchDb({
    auth: {
        user: config.couchUser,
        password: config.couchPassword
    }
});

const dbName = 'characters';
const viewUrl = '_design/all_characters/_view/all';

async function handleGetAllCharacters(req, res, next) {
    try {
        couch.get(dbName, viewUrl).then(
            function (data, headers, status) {
                console.log(data.data.rows);
                res.send(data.data.rows);
            },
            function (err) {
                res.send(err);
            }
        )
    } catch (error) {
        const customError = {
            message: "Error while trying to get all characters",
            status: 500,
            error: error
        }
        return next(customError);
    }
}

router.get('/', handleGetAllCharacters);

module.exports = { router };