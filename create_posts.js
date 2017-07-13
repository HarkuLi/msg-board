var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://127.0.0.1:27017/msgboard";
var collection_name = "posts";
var genNum = 100;

var getColle = MongoClient.connect(dbUrl)
    .then((db)=>{
        return db.collection(collection_name);
    });

var genTitle = function(){
    var rst = "";
    var lenRange = 10;
    var titleLen = Math.floor(Math.random()*lenRange)+1;
    for(let i=0; i<titleLen; ++i){
        let ascii = Math.floor(Math.random()*26)+97;
        rst += String.fromCharCode(ascii);
    }
    return rst;
};

var genContent = function(){
    var rst = "";
    var lenRange = 20;
    var contentLen = Math.floor(Math.random()*lenRange)+1;
    for(let i=0; i<contentLen; ++i){
        let ascii = Math.floor(Math.random()*26)+97;
        rst += String.fromCharCode(ascii);
    }
    return rst;
};

var createPosts = function(){
    getColle.then((colle)=>{
        for(let i=0; i<genNum; i++){
            let title = genTitle();
            let content = genContent();
            let current_time = new Date().toISOString();
            let data = {
                title,
                content,
                author: "Harku",
                posted_time: current_time,
                comments: []
            };
            colle.insert(data);
        }
    });
};

createPosts();