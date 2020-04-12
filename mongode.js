var mongoose = require('mongoose');
var UserSchema = require('./models/userschema');
var config = require('./config/database');
mongoose.connect(config.database);


new UserSchema({
    firstname:"Jp",
    lastname:"Prakash",
    email:"prakashj1998@gmail.com",
    organisation:"CEG",
    mobile:"8973325865",
    password:"jayaprakash"
}).save(function(err,user){
    if(err) throw err;
    console.log("Registered Successfully");
    consolr.log(user);
});











// we create 'users' collection in newdb database
// var url = "mongodb://localhost:27017/newdb";
 
// // create a client to mongodb
// var MongoClient = require('mongoose').MongoClient;
 
// // make client connect to mongo service
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     // db pointing to newdb
//     console.log("Switched to "+db.databaseName+" database");
 
//     // document to be inserted
//     var doc = { name: "Jpppppp", age: "22" };
    
//     // insert document to 'users' collection using insertOne
//     db.collection("users").insertOne(doc, function(err, res) {
//         if (err) throw err;
//         console.log("Document inserted");
//         // close the connection to db when you are done with it
//         db.close();
//     });
// });