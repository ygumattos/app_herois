const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroiSchema = require('./../db/strategies/postgres/schema/heroisSchema')
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'Flechas'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

let context = {};

describe('Postgres Strategy', function() {
    this.timeout(Infinity);
    this.beforeAll(async function() {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, HeroiSchema);
        context = new Context(new Postgres(connection, model));
        await context.delete();
        await context.create(MOCK_HEROI_ATUALIZAR);
    })
    it('PostgresSQL Connection', async function() {
        const result = await context.isConnected();
        assert.equal(result, true);
    })

    it('Cadastrar usuário', async function() {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    })

    it('Listar usuarios', async function(){
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        delete result.id;
        assert .deepEqual(result, MOCK_HEROI_CADASTRAR);
    })

    it('Atualizar usuarios', async function(){
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
        const novoItem = {...MOCK_HEROI_ATUALIZAR, nome: 'Mulher Maravilha'}

        const [qtd, [result]] = await context.update(itemAtualizar.id, novoItem);
        assert.deepEqual(result.nome, novoItem.nome);
    })
    it('Remover usuario', async function() {
        const [item] = await context.read({});
        const result = await context.delete(item.id);

        assert.deepEqual(result, 1);
    })

})