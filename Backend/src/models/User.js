const mongoose = require('mongoose');
const {Schema} = mongoose;


const UserSchema = new Schema({
      firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String, 
        minLength:3,
        maxLength:20
    },
    age:{
        type:Number,
        min:10,
        max:80
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    role:{
        type:String,
        enum:['User', 'Admin'],
        default:"User",
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
    },
    password:{
        type:String,
        minLength:8,
        required:true,
    }
},{
    timestamps:true
})


const User = mongoose.model("user",UserSchema)
module.exports = User;
 