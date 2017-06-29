var Mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://msgBoardDB:27017/msgboard";
var colle = 'posts';

var newPost = function(data){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.insert(data);
        db.close();
    });
};

var getPostList = function(cbfn){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.find().toArray(function(err,items){
            cbfn(items);
        });
        db.close();
    });
};

var getPostByID = function(id, cbfn){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.find({_id: Mongo.ObjectId(id)}).toArray(function(err,items){
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

var remove = function(id){
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection(colle);
        collection.remove({_id: Mongo.ObjectId(id)});
        db.close();
    });
};

// var newPost = function(data)
// {
//     POST.post_lists.push(data);
// };

module.exports = {newPost, getPostList, getPostByID, editByID, remove};