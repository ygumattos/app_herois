docker ps = mostra tudo que esta rodando
docker ps -a = mostra tudo

npm i hapi
npm i vision inert hapi-swagger

npm i jsonwebtoken

npm i hapi-auth-jwt2

npm i bcrypt

***  Criando imagem do postgress definindo todos os parametros  ***
docker run  --name post_heroes  -e POSTGRES_USER=ygormattos -e POSTGRES_PASSWORD=123456  -e POSTGRES_DB=heroes -p 5432:5432 -d postgres 

docker exec -t post_heroes /bin/bash

***  Imagem de interface para acesso ao postgress ***
docker run --name adminer -p 8080:8080 --link post_heroes:postgres -d adminer

##  Criando imagem do MongoDB e o usuário ADMIN  ##
docker run --name mongo_heroes -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4

OBS.: ":4" está indicando a versão do mongo.

## Imagem de interface para acesso ao mongodb ##
docker run --name mongoclient -p 3000:3000 --link mongo_heroes:mongodb -d mongoclient/mongoclient

## Com autenticação de admin, criamos um BD e um usuário com permissões limitadas (roles) ##
docker exec -it mongo_heroes mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({ user: 'ygormattos', pwd: '123456', roles: [{role: 'readWrite', db: 'herois'}]})"

@@ Desing Pattern Strategy @@