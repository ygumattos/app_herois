const assert = require('assert');
const Passwordhelper = require('./../helpers/passwordHelper')

const SENHA = '123'
const HASH = '$2b$04$3lCKlOpHe2d.C41DDN5TUeIlLNKZ5pkjuRKUcjwD0dyqjzYhQ8Wii';

describe('UserHelper test suit', function () {
    it('Deve gerar um hash a parti de uma senha', async () => {
        const result = await Passwordhelper.hashPassword(SENHA);
        assert.ok(result.length > 10);
    })
    it('Deve validar a senha', async () => {
        const result = await Passwordhelper.comparePassword(SENHA, HASH);
        assert.ok(result);
    })
})