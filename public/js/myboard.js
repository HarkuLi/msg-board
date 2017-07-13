var Mongo = require('mongodb'); //for ObjectId()
var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://msgBoardDB:27017/msgboard";
var collection_name = 'posts';

var getColle = MongoClient.connect(dbUrl)
    .then((db)=>{
        return db.collection(collection_name);
    });

var newPost = (data)=>{
    return getColle
        .then((colle)=>{
            colle.insert(data);
        });
};

var getPostCount = getColle
    .then((colle)=>{
        return colle.count();
    });

var getPostList = (page)=>{
    return getColle
        .then((colle)=>{
            return colle.find().sort({"_id" : -1}).skip(10*(page-1)).limit(10).toArray();
        });
};

var getPostByID = (id)=>{
    return getColle
        .then((colle)=>{
            return colle.find({_id: Mongo.ObjectId(id)}).toArray();
        })
        .then((items)=>{
            return items[0];
        });
};

var editByID = (id, data)=>{
    getColle.then((colle)=>{
        colle.updateOne(
            {_id: Mongo.ObjectId(id)},
            {
                $set: 
                {
                    title: data.title,
                    content: data.content
                }
            }
        );
    });
};

var remove = (id)=>{
    getColle.then((colle)=>{
        colle.remove({_id: Mongo.ObjectId(id)});
    });
};

module.exports = {newPost, getPostCount, getPostList, getPostByID, editByID, remove};