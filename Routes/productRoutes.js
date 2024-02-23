const express = require('express');

const { protect , allowedTo} = require('../services/authService');


const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utiles/validators/productValidators');

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require('../services/productService');
// const subcategoryRoutes=require('./subcategoryRoutes');
const router = express.Router();
// router.use('/categoryId/subcategories',subcategoryRoutes)




router
  .route('/')
  .get(getAllProducts)
  .post(protect,allowedTo("admin","manger"),uploadProductImages,resizeProductImages,createProductValidator, createProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(protect,allowedTo("admin","manger"),uploadProductImages,resizeProductImages,updateProductValidator, updateProduct)
  .delete(protect,allowedTo("admin"),deleteProductValidator, deleteProduct);

module.exports = router;