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
        await couch.get(dbName, viewUrl).then(
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

async function handleCreateCharacter(req, res, next) {
    const character = req.body;

    try {
        await couch.insert(dbName, {
            name: character.name,
            side: character.side,
            lines: character.lines
        }).then(
            function (data, headers, status) {
                res.send(data.data)
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

async function handleDeleteCharacter(req, res, next) {
    const { id, rev } = req.params;

    try {
        await couch.del(dbName, id, rev).then(
            function (data, headers, status) {
                res.send(data.data)
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

async function handleUpdateCharacter(req, res, next) {
    const { id, rev } = req.params;

    console.log(req.body.name, req.body.side, req.body.lines)
    try {
        await couch.update(dbName, {
            _id: id, 
            _rev: rev, 
            name: req.body.name, 
            side: req.body.side, 
            lines: req.body.lines
        }).then(
            function (data, headers, status) {
                res.send(data.data)
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

async function handleGetCharacterById(req, res, next) {
    const { id } = req.params;
    
    try {
        await couch.get(dbName, id).then(
            function (data, headers, status) {
                res.send(data.data)
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
router.get('/:id', handleGetCharacterById);
router.post('/', handleCreateCharacter);
router.delete('/:id/:rev', handleDeleteCharacter);
router.put('/:id/:rev', handleUpdateCharacter);

module.exports = { router };