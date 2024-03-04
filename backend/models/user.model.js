import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profilePicture:{
        type:String,
        default:"",
    },
    gender:{
        type:String,
        enum:["male","female"]
    }
},{timestamps:true})


const User = mongoose.model("user",userSchema)

export default User