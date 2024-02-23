const { check } = require('express-validator');
const { default: slugify } = require('slugify');
const User = require('../../models/userModel');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const bcrypt = require('bcrypt');




exports.createuserValidator = [
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
    )
    
    ,
    check('password').notEmpty().withMessage("Password is required !").custom((password,{req})=>{
      if (password != req.body.passwordConfirm){
        throw new Error("password and password confirm aren't the same")
      }
      return true;
    })
    .isLength({min:6}).withMessage("the password must be at least 6 cahrs"),
    check('role').optional(),
    check('phone').isMobilePhone(["ar-EG",]).withMessage("Enter a valid Egyption number"),

    check('passwordConfirm').notEmpty().withMessage("Password confirm is required !")

    ,
  validatorMiddleware,
];

exports.getuserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validatorMiddleware,
];



// exports.updateuserValidator = [
//   check('id').isMongoId().withMessage('Invalid user id format'),
//   validatorMiddleware,
// ];

exports.deleteuserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validatorMiddleware,
];

exports.updateuserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format ss'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];


exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  check("currentPassword").notEmpty().withMessage("you must enter your currentPassword"),
  check("passwordConfirm").notEmpty().withMessage("you must enter your passwordConfirm"),

  check("password").notEmpty().withMessage("you must enter your new password").custom(async(val,{req})=>{
    // verify passsword is current password

    const user = await User.findById(req.params.id)

    if (!user){
      throw new Error("there is no user with this id !!")
    }


    const isCorrectPassword = await bcrypt.compare(req.body.currentPassword , user.password)

    if (!isCorrectPassword){
      throw new Error("the current password is wrong !! ")
    }


    //verify password=passwordconfirm
    if (val != req.body.passwordConfirm){
      throw new Error("password and password confirm aren't the same")
    }

    return true;
  }),
  validatorMiddleware





]



exports.updateLoggeduserValidator = [
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email').optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];
