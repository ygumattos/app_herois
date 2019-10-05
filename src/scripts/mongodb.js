// docker ps 
// docker exec -it b8f2024dcbe1 mongo -u ygormattos -p 123456 --authenticationDatabase herois

// show db

// use herois

// show collections

// db.herois.insert({
//     nome: 'Flash',
//     poder: 'Velocidade',
//     dataNascimento: ' 1998-01-01'
// })

// db.herois.find();
// db.herois.find().pretty();

// for(let i=0; i <= 1000; i++){
//     db.herois.insert({
//         nome: `Clone-${i}`,
//         poder: 'Velocidade',
//         dataNascimento: '1998-01-01'
//     })
// }

// db.herois.count();
// db.herois.findOne();
// db.herois.find().limit(500).sort({nome: 1})
// db.herois.find({}, { poder: 1, _id: 0})

// //create

// for(let i=0; i <= 1000; i++){
//     db.herois.insert({
//         nome: `Clone-${i}`,
//         poder: 'Velocidade',
//         dataNascimento: '1998-01-01'
//     })
// }

// // read
// db.herois.find();

// // update
// //OBS.: Se não deixar o updtate bem explicado, é possivel que perca dados

// // db.herois.update({ _id: ObjectId("5d8d18bc52ec595dd254e99f") }, <<- não especificado
// //                 { nome: 'Mulher maravilha' });
// db.herois.update({ _id: ObjectId("5d8d19c352ec595dd254ea12") },
//                 { $set: {name: 'Lanterna Verde'} });

//  db.herois.update({ poder: 'Velocidade' },
//                 { $set: {poder: 'Super força'} });

// // delete
// db.herois.remove({}) // <<- Remove todos os dados da base
// db.herois.remove({ nome: "Lanterna verde " })// <<- remove alguem especifico