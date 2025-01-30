const mongoose=require("mongoose");
require("dotenv").config();
exports.connectDb=()=>{
    mongoose.connect(process.env.MongoDbUrl).then(()=>{
        console.log("Database Connected Successfully");
    })
    .catch((err)=>{
        console.log("Something went wrong while connecting database");
        console.error(err);
        process.exit(1);
    })
}