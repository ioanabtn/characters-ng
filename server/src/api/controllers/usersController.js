const express = require('express');
const router = express.Router();

const NodeCouchDb = require('node-couchdb');
const config = require('../../config');

const usersService = require('../services/usersService');

const passport = require('passport');

const couch = new NodeCouchDb({
    auth: {
        user: config.couchUser,
        password: config.couchPassword
    }
});

const dbName = 'users';
const viewUrl = '_design/all_users/_view/all';

async function handleCreateUser(req, res, next) {
    try {
        const users = [];
        await usersService.findUsersByEmail(req.body.email).then(users => {
            this.users = users.rows;
        })

        if (this.users.length > 0) {
            const customError = {
                message: `The email: ${req.body.email} is already used`,
                status: 400
            }
            return next(customError);
        }

        await usersService.insertUser(req.body).then( () => {
            res.status(201).json("User was added");
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

async function handleLogin(req, res, next) {
    const { email, password } = req.body;
    const users = [];
    await usersService.findUsersByEmail(req.body.email).then(users => {
        this.users = users.rows;
    })

    if (this.users.length <= 0) {
        const customError = {
            message: `The email: ${req.body.email} was not found`,
            status: 404
        }
        return next(customError);
    }

    const isMatch = await usersService.verifyPassword(password, this.users[0].doc.password);

    if(!isMatch) {
        const customError = {
            message: `Wrong password`,
            status: 401
        }
        return next(customError);
    }

    return res.status(201).send("You logged in!");

}

async function findUserByEmail(req, res, next) {
    try {
        await usersService.findUserByEmail(req.body).then(user => {
            res.status(201).send(user);
        });
    } catch (error) {
        const customError = {
            message: "Error while trying to get user by email",
            status: 500,
            error: error
        }
        return next(customError);
    }
}

router.post('/', handleCreateUser);
// router.post('/login', handleLogin);

//login handle
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.json("you logged in");
});

router.get('/logout', (req, res) => {
    req.logout();
});

module.exports = { router };