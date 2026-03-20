const mongoose=require("mongoose")
require('dotenv').config()

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to DB")
    }catch(err){
        console.error("data base connection error",err)
    }
}

module.exports=connectDB