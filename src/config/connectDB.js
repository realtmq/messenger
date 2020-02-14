import mongoose from "mongoose";
import bluebird from "bluebird";

let connectDB=()=>{
    mongoose.Promise = bluebird;
    let URI='mongodb://localhost/messenger';
    return mongoose.connect(URI,{useMongoClient:true});
};

module.exports = connectDB;