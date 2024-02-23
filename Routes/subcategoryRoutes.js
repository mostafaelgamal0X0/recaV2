const express = require('express');

const { protect , allowedTo} = require('../services/authService');


const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
  } = require('../utiles/validators/subcategoryValidators');

const {
    getAllsubcategories,
    getsubcategory,
    createsubcategory,
    updatesubcategory,deletesubcategory
    
  } = require('../services/subcategoryService');
  //mergeparams:allow us to access  parameters on other routes
  const router = express.Router({mergeParams:true});


  router
  .route('/')
  .post(protect,allowedTo("admin","manger"),createSubCategoryValidator,createsubcategory).get(getAllsubcategories);
  router
  .route('/:id')
  .post(getSubCategoryValidator,getsubcategory)
  .put(protect,allowedTo("admin","manger"),updateSubCategoryValidator,updatesubcategory)
  .delete(protect,allowedTo("admin","manger"),deleteSubCategoryValidator,deletesubcategory);


  module.exports = router;