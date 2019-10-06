const assert = require('assert');
const api = require('../api');
const Context = require('./../db/strategies/base/contextStrategy');
const Postgres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schema/usuarioSchema')
let app = {};

const USER =  {
    username: 'xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$3lCKlOpHe2d.C41DDN5TUeIlLNKZ5pkjuRKUcjwD0dyqjzYhQ8Wii'
}

describe ('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
        const postgres = new Context(new Postgres(connectionPostgres, model));
        await postgres.update(null, USER_DB, true);

    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
    })
});