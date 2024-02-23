const express = require('express');
const { protect , allowedTo} = require('../services/authService');


const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utiles/validators/categoryValidators');



const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} = require('../services/categoryService');

const subcategoryRoutes=require('./subcategoryRoutes');




const router = express.Router();



router.use('/categoryId/subcategories',subcategoryRoutes)



router
  .route('/')
  .get(getAllCategories)
  .post(protect,allowedTo("admin","manger"),uploadCategoryImage,resizeImage,createCategoryValidator, createCategory);
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(protect,allowedTo("admin","manger"),uploadCategoryImage,resizeImage,updateCategoryValidator, updateCategory)
  .delete(protect,allowedTo("admin"),deleteCategoryValidator, deleteCategory);

module.exports = router;