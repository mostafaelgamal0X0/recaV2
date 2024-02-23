const { check } = require("express-validator");
const Coupon = require("../../models/couponModel");
const expressAsyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");






exports.createCouponValidator = [
    check('name').notEmpty().withMessage('Coupon name is required')
    .custom(expressAsyncHandler(async(val , req)=>{
        
        const coupon= await Coupon.findOne({name:val})
        if(coupon){
            throw new Error('Coupon name must be unique');
        }

        return true
    })),
    
    check('expire').notEmpty().withMessage('Coupon expire date is required'),

    check('discount').notEmpty().withMessage('Coupon discount  is required'), 


    validatorMiddleware,
  ];


  exports.getCouponValidator = [
    check('id').isMongoId().withMessage('Invalid ID format'),
    validatorMiddleware,
  ];



  exports.deleteCouponValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
  ];


  exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    check('name').optional().custom(expressAsyncHandler(async(val , req)=>{
        
        const coupon= await Coupon.findOne({name:val})
        if(coupon){
            throw new Error('Coupon name must be unique');
        }})),


    validatorMiddleware,
  ];