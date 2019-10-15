const nano = require('nano')('http://admin:admin@localhost:5984');
const config = require('../../config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const users = nano.db.use('users');

const viewUrl = 'all_characters/_view/all';

exports.insertUser = async (user) => {
    return bcrypt.hash(user.password, saltRounds, function (err, hash) {
        user.password = hash;
        return users.insert(user);
    });
};

exports.findUsersByEmail = (email) => {
    return users.view('all_user_email', 'email', { 'keys': [email], "include_docs": true });
}

exports.verifyPassword = (passwordToCompare, userPassword) => {
    return bcrypt.compare(passwordToCompare, userPassword);
}

exports.getUserById = (id) => {
    return users.get(id);
}