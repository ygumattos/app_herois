class NotImplementedException extends Error {
    constructor() {
        super("Not Implemented Expection") //invocar o construtor da classe extends
    }
}

class ICrud {
    create(item) {
        throw new NotImplementedException();
    }
    read(query) {
        throw new NotImplementedException();
    }
    update(id, item) {
        throw new NotImplementedException();
    }
    delete(id) {
        throw new NotImplementedException();
    }
}

class MongoDB extends ICrud {
    constructor() {
        super();
    }
    create(item) {
        console.log('O item foi salvo em MongoDB');
    }
}

class Postgres extends ICrud {
    constructor() {
        super();
    }
    create(item) {
        console.log('O item foi salvo em Postgres');
    }
}

class ContextStrategy {
    constructor(strategy) {
        this._database = strategy;
    }

    create(item) {
        return this._database.create(item);
    }

    read(item) {
        return this._database.read(item);
    }

    update(id, item) {
        return this._database.update(id, item);
    }

    delete(id) {
        return this._database.delete(id);
    }

}

const contextMongo = new ContextStrategy(new MongoDB());
const contextPost = new ContextStrategy(new Postgres());
contextMongo.create();
contextPost.create();



[1,
    [
        { 
            id: 60, nome: 'Mulher Maravilha', poder: 'Dinheiro' 
        }
    ]
]