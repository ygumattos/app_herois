const assert = require('assert');
const api = require('./../api');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU3MDIyMzA3OH0.UtoqIay4OsO_m1_WpZftXVSemcHqd4znNI0mnU_AvEY';
const headers = {
    Authorization: TOKEN
}

let app = { };

const MOCK_HEROI_CADASTRAR = {
    nome: `Chapolin Colorado-${Date.now()}`,
    poder: 'Marreta Bionica'
}

const MOCK_HEROI_Incial = {
    nome: `Gavião Negro`,
    poder: 'Flechas top'
}
let MOCK_ID = '';

describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_Incial)
        })
        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id;
    })

    it('Listar GET /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        })
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    })
    it('Listar /herois - deve retornar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    })
    it('Listar /herois - deve filtrar um item', async () => {
        const NAME = 'Batman'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(dados[0].nome, NAME);
    })
    it ('Cadastrar POST - /herois', async () => {

        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })

        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, "Heroi cadastrado com sucesso");

    })
    it('Atualizar PATCH - /herois/:id', async () => {
        const _id = MOCK_ID;
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(dados.message, "Heroi atualizado com sucesso");

    })
    it('Atualizar PATCH - /herois/:id - NÃO DEVE ATUALIZAR', async () => {
        const _id = `5d97561b529b620a20d1e33c`; // <<- Esse ID não existe
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify({
                poder: 'Super Mira'
            })
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID Não encontrado no banco !'
        }

        assert.ok(statusCode === 412);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(dados, expected);

    })
    it('Remover DELETE - /herois/:id', async () => {
        const _id = MOCK_ID;

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepEqual(dados.message, 'Heroi removido com sucesso !');
    })
    it('Remover DELETE - /herois/:id - NÃO DEVE REMOVER', async () => {
        const _id = '5d97561b529b620a20d1e33c';

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID Não encontrado no banco !'
        }
        assert.ok(statusCode === 412);
        assert.deepEqual(dados, expected);
    })

})