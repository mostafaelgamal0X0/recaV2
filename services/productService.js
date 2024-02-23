const slugify=require('slugify');
const productModel=require('../models/productModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/ApiError');
const factory=require('./factoryHandellers');
const { uploadMixOfImages } = require('../middleware/uplaodImagesMiddleware');
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const multer  = require("multer")







exports.uploadProductImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  
  exports.resizeProductImages = asyncHandler(async (req, res, next) =>{
    //1- Image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);
  
      // Save image into our db
      req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(

        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
  
          // Save image into our db
          req.body.images.push(imageName);
        })
      );
  
      next();
    }
  });
  
  






exports.getProduct=factory.getOne(productModel);
exports.getAllProducts=factory.getAll(productModel,'User');

exports.updateProduct=factory.updateOne(productModel);
exports.createProduct=factory.createOne(productModel);
exports.deleteProduct=factory.deleteOne(productModel);