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
    update(id, item){
        throw new NotImplementedException();
    }
    delete(id){
        throw new NotImplementedException();
    }
    isConnected(){
        throw new NotImplementedException();
    }
    connect() {
        throw new NotImplementedException();
    }
}

module.exports = ICrud;