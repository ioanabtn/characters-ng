import http from './httpService';

export function findAllCharacters() {
    return http.get('/api/characters');
}