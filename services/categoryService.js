const slugify=require('slugify');
const CategoryModel=require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/ApiError');
const factory=require('./factoryHandellers');
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const multer  = require("multer")


const multerStorage=multer.memoryStorage();

  const multerFilter=function(req,file,cb){
    //file.minetype
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new ApiError("only images allowed",400),false);
    }
  };
const upload = multer({ storage:multerStorage,fileFilter:multerFilter});

exports.resizeImage=asyncHandler(async(req,res,next)=>{
    console.log(req.file)
    filename=`category-${uuidv4()}-${Date.now()}.jpeg`;
     await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/categories/${filename}`)
    //save image into db (only name)
    req.body.image=filename;


    // to saver image  url
    // req.body.image=hostname+filename;
    
    next();
});


exports.uploadCategoryImage=upload.single('image')
exports.getAllCategories=factory.getAll(CategoryModel);
exports.getCategory=factory.getOne(CategoryModel);
exports.updateCategory=factory.updateOne(CategoryModel);
exports.createCategory=factory.createOne(CategoryModel);
exports.deleteCategory=factory.deleteOne(CategoryModel);