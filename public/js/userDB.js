var Mongo = require('mongodb'); //for ObjectId()
var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://msgBoardDB:27017/msgboard";
var colle = 'user';

var newUser = function(data){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.insert(data);
        db.close();
    });
};

var getUserByName = function(name, cbfn){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.find({name: name}).toArray(function(err,items){
            cbfn(items[0]);
        });
        db.close();
    });
}

var editByID = function(id, data){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.updateOne({_id: Mongo.ObjectId(id)},
                             {
                                $set: {
                                        title: data.title,
                                        content: data.content,
                                      }
                             }
        ).then(()=>{
            db.close()
        });
    });
}

// var remove = function(id){
//     MongoClient.connect(dbUrl, function(err, db){
//         var collection = db.collection(colle);
//         collection.remove({_id: Mongo.ObjectId(id)});
//         db.close();
//     });
// };

module.exports = {newUser, getUserByName};