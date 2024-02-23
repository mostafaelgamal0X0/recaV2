const mongoose = require('mongoose')
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

    name : {

        type : String ,
        trim:true,
        required : [true,"The username is required !!"],
    },

    slug:{
        type:String,
        lowercase:true
    },
    email : {
        type : String ,
        required : [true,"The email is required !!"],
        uniqee:true,
        lowercase:true,

    },
    phone:String,
    profileImg:String,

    password:{
        type:String,
        required:true,
        minlength:[6,"too short password"]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    active : {
        type:Boolean,
        default : true
    },
    passwordChangedAt : Date,
    passwordResetCode:String,
    passwordResetExpire:Date,
    passwordResetVerified:Boolean,
    

},{timestamps:true})



userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

const User = mongoose.model('User',userSchema)

module.exports = User