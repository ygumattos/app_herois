const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');
const Boom = require('boom');

const Jwt = require('jsonwebtoken');
const Passwordhelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, error) => { throw error; };


const USER =  {
    username: 'xUxAdasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute{
    constructor(secret, db){
        super();
        this.secret = secret; 
        this.db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async request => {
                const { username, password } = request.payload;

                // if(username.toLowerCase() !== USER.username.toLowerCase() || password !== USER.password){
                //     return Boom.unauthorized();
                // }

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })
                if(!usuario) return Boom.unauthorized('O usuário informado não existe !');

                const match = await Passwordhelper.comparePassword(password. usuario.password);

                if(!match) return Boom.unauthorized('O usuário ou senha invalidos !');


                const token = Jwt.sign({
                    username: username,
                    id: usuario,
                }, this.secret);
                
                return {
                    token
                }

            }

        }
    }
}

module.exports = AuthRoutes;