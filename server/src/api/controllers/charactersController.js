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

const charactersService = require('../services/charactersService');

async function handleGetAllCharacters(req, res, next) {
    try {
        await charactersService.getCharacters().then(characters => {
            // console.log(characters.rows);
            // const allCharacters = characters.rows.map(character => character.doc);
            // console.log(allCharacters)
            return res.status(200).send(characters.rows)
        })
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
    try {
        await charactersService.insertCharacter(req.body).then(character => {
            res.status(201).send(character);
        });
    } catch (error) {
        const customError = {
            message: "Error while trying to insert character",
            status: 500,
            error: error
        }
        return next(customError);
    }
}

async function handleDeleteCharacter(req, res, next) {
    const { id, rev } = req.params;

    try {
        await charactersService.destroyCharacter(id, rev).then(character => {
            res.status(200).json(character);
        });
    } catch (error) {
        const customError = {
            message: "Error while trying to delete the character",
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
        await charactersService.updateCharacter(id, rev, req.body).then(character => {
            res.status(200).send(character);
        })
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
        charactersService.getCharacterById(id).then(character => {
            res.status(200).send(character);
        })
    } catch (error) {
        const customError = {
            message: "Error while trying to get the character",
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