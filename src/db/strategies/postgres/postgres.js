const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');
const driver = new Sequelize (
    'heroes',
    'ygormattos',
    '123456',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)


class Postgres extends ICrud{
    constructor(connection, schema){
        super();
        this._connection = connection;
        this._schema = schema;
    }
    static async connect(){
        const connection = new Sequelize (process.env.POSTGRES_URL, {
                quoteIdentifiers: false,
                operatorsAliases: false,
                logging: false,
                ssl: process.env.SSL_DB,
                dialectOptions: {
                    ssl: process.env.SSL_DB
                }
            
        });
        return connection;
    }
    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );
        await model.sync(); 
        return model;
    }
    async isConnected(){
        try {
            await this._connection.authenticate();
            return true;
        } catch (error) {
            console.log('fail !', error);
            return false; 
        }
    }

    async create(item){
        const { dataValues } = await this._schema.create(item);
        return dataValues;
    }

    async read(item = {}){
       return this._schema.findAll({where: item, raw: true});
    }

    async update(id, item, upsert = false){
        const fn = upsert ? 'upsert' : 'update';

       const result =  await this._schema[fn](item, { where: { id }, returning: true, raw: true })
       return result;
    }

    async delete(id){
        const query = id ? { id } : {};
        const result = await this._schema.destroy({where: query});
        return result;
    }
}

module.exports = Postgres;