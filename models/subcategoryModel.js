const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');
const subcategorySchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:[true,"name of subcategory must be unique"],
        required:[true,"name of subcategory is required"],
        maxlength:30,
        minlength:3
    },
    slug:{
        type:String,
        lowercase:true},
        category:{
            type:mongoose.Schema.ObjectId,
            ref:"category",
            required:[true,"subcategory must be belong to category"],
        }
},{timestamps:true});

module.exports=mongoose.model('subcategory',subcategorySchema);