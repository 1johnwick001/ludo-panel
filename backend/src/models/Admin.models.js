import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_Admin_loggedIn :{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Admin = mongoose.model("Admin",adminSchema)

export default Admin