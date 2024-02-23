const { check } = require('express-validator');
const { default: slugify } = require('slugify');
const User = require('../../models/userModel');
const validatorMiddleware = require('../../middleware/validatorMiddleware');





exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('user required')
    .isLength({ min: 3 })
    .withMessage('Too short user name')
    .isLength({ max: 32 })
    .withMessage('Too long user name').custom((val,{req})=>{
      req.body.slug = slugify(val);
      return true ; 
    }),


    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("invakid email address")
    .custom((val)=>
      User.findOne({email:val}).then((user)=>{
        if (user){return Promise.reject(new Error('email already in use'))}
      })
    ),

    check('password').notEmpty().withMessage("Password is required !").custom((password,{req})=>{
      if (password != req.body.passwordConfirm){
        throw new Error("password and password confirm aren't the same")
      }
      return true;
    }).isLength({min:6}).withMessage("the password must be at least 6 cahrs"),

    check('passwordConfirm').notEmpty().withMessage("Password confirm is required !")

    ,
  validatorMiddleware,
];




exports.loginValidator = [

    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("invakid email address"),

    check('password').notEmpty().withMessage("Password is required !")
    .isLength({min:6}).withMessage("the password must be at least 6 cahrs"),
  validatorMiddleware,
];

