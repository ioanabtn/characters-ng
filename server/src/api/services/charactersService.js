const nano = require('nano')('http://admin:admin@localhost:5984');
const config = require('../../config');

const characters = nano.db.use('characters');

const viewUrl = 'all_characters/_view/all';

exports.insertCharacter = (character) => {
    return characters.insert(character);
};

exports.updateCharacter = (id, rev, character) => {
    return characters.insert({ _id: id, _rev: rev, name: character.name, side: character.side, lines: character.lines });
}

exports.destroyCharacter = (id, rev, ) => {
    return characters.destroy(id, rev);
}

exports.getCharacterById = (id) => {
    return characters.get(id);
}

exports.getCharacters = () => {
    return characters.view('all_characters', 'all');
}