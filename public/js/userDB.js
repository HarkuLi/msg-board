var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://msgBoardDB:27017/msgboard";
var collection_name = 'user';

var getColle = MongoClient.connect(dbUrl)
    .then((db)=>{
        return db.collection(collection_name);
    });

var newUser = (data)=>{
    getColle.then((colle)=>{
        colle.insert(data);
    });
};

var getUserByName = (name)=>{
    return getColle
        .then((colle)=>{
            return colle.find({name: name}).toArray();
        })
        .then((items)=>{
            return items[0];
        });
};

module.exports = {newUser, getUserByName};