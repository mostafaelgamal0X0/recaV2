const mongoose=require('mongoose');


const CategorySchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title of category is required"],
        unique:[true,"title of category must be unique"],
        maxlength:30,
        minlength:3
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:String
},{timestamps:true});


const CategoryModel=mongoose.model('category',CategorySchema);

module.exports=CategoryModel;