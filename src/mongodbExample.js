// npm install mongoose

// *** Conectando no banco ***
const Mongoose = require('mongoose');

Mongoose.connect('mongodb://ygormattos:123456@localhost:27017/herois', 
                { useNewUrlParser: true, useUnifiedTopology: true }, function(error) {
                    if(!error) return ;
                    console.log('Falha na conexão !', error);
                });

const connection = Mongoose.connection;
connection.once('open', () => console.log('database rodando !!') );
// setTimeout( () => {
//     const state = connection.readyState;
//     console.log('State: ' , state)
// }, 1000)

/** Stages:
 *  0 = Disconectado
 *  1 = Conectado
 *  2 = Conectando
 *  3 = Disconectando
 */

 const heroiSchema = new Mongoose.Schema({
     nome: {
         type: String,
         required: true
     },
     poder: {
        type: String,
        required: true
     },
     insertedAt: {
         type: Date,
         default: new Date()
     }
 })

 const model = Mongoose.model('herois', heroiSchema);

 async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })
    console.log('Result Cadastrar: ', resultCadastrar);

    const listItens = await model.find();
    console.log('items', listItens);
 }

 main();