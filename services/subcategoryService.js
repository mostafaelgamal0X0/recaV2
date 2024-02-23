const slugify=require('slugify');
const subCategoryModel=require('../models/subcategoryModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/ApiError');
const factory=require('./factoryHandellers');
const subcategoryModel = require('../models/subcategoryModel');



exports.getAllsubcategories=factory.getAll(subCategoryModel);
exports.getsubcategory=factory.getOne(subcategoryModel);
exports.updatesubcategory=factory.updateOne(subcategoryModel);
exports.createsubcategory=factory.createOne(subcategoryModel);
exports.deletesubcategory=factory.deleteOne(subCategoryModel);
