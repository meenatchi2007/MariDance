const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
   firstname: String,
    lastname: String,
    email: String,
    phone: Number,
    password: String,
    role:{
        type:String,
        default:"user",
    }
});
module.exports=mongoose.model("users",userSchema);