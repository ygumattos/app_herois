const assert = require('assert');
const Mongodb = require('../db/strategies/mongodb/mongodb');
const HeroisSchema = require('./../db/strategies/mongodb/schemas/heroisSchema');
const Context = require('../db/strategies/base/contextStrategy');

let context = {};

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço da verdade'
};
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super teia'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Speed'
}
let MOCK_HEROI_ID = null;

describe('MongoDB Suite de testes', function () {
    this.beforeAll(async function () {
        const connection = Mongodb.connect();
        context = new Context(new Mongodb(connection, HeroisSchema));
        await context.create(MOCK_HEROI_DEFAULT);
        const result = await context.create(MOCK_HEROI_ATUALIZAR);
        MOCK_HEROI_ID = result._id;
    })
    it('Verificar conexão', async () => {
        const result = await context.isConnected();
        const expected = 'Conectado';

        assert.deepEqual(result, expected);
    })
    it('Cadastrar usuario', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    })
    it('Listar', async () => {
        //objeto abaixo vai extrair a 1ª posição e dessa vai pegar somente nome e poder;
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome });
        const result = { nome, poder };

        assert.deepEqual(result, MOCK_HEROI_DEFAULT);
    })
    it('Atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, { nome: 'Pernalonga ' });
        assert.deepEqual(result.nModified, 1);
    })
    it('Remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID);
        assert.deepEqual(result.n, 1);
    })
})