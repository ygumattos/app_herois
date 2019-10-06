const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev";
ok(env == "prod" || env == "dev", " env é invalida, ou dev ou prod");

const configPath = join(__dirname, './config', `.env.${env}`)
config({
    path: configPath
})
const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const Mongodb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const Postgres = require('./db/strategies/postgres/postgres');
const UsuarioSchema = require('./db/strategies/postgres/schema/usuarioSchema')

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwT = require('hapi-auth-jwt2');

const UtilRoutes  = require('./routes/utilRoutes');

const JWT_SECRET = process.env.JWT_KEY;

const app = new Hapi.Server({
    port: process.env.PORT
});

function mapRoutes(instance, methods) {

    return methods.map(method => instance[method]());
}

async function main() {
    const connection = Mongodb.connect();
    const context = new Context(new Mongodb(connection, HeroiSchema));

    const connectionPostgres = await Postgres.connect();
    const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema));

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR - By Ygor Mattos',
            version: 'v1.0',
        }
    };
    await app.register([
        HapiJwT,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (dado, request) => {
            // verificar no banco se o usuario continua ativo
            // verifica no banco se usuario continua pagando

            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ]);

    await app.start();
    console.log('Servidor rodando na porta', app.info.port);

    return app;
}

module.exports = main();