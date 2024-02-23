const express = require('express');


const {createCouponValidator ,getCouponValidator,updateProductValidator,deleteCouponValidator} =  require('../utiles/validators/copounValidators')
const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../services/couponService');

const {protect,allowedTo} = require('../services/authService');

const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'));

router.route('/').get(getCoupons)
      .post(createCouponValidator,createCoupon);


router.route('/:id').get(getCouponValidator, getCoupon)
      .put(updateProductValidator,updateCoupon)
      .delete(deleteCouponValidator,deleteCoupon);

module.exports = router;