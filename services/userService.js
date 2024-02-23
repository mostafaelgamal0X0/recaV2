const asyncHandler = require('express-async-handler');
// const { v4: uuidv4 } = require('uuid');
// const sharp = require('sharp');
const bcrypt = require('bcrypt');
// bcrypt
const factory = require('./factoryHandellers');
const ApiError = require('../utiles/ApiError');
// const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utiles/createToken');
const User = require('../models/userModel');

// Upload single image
// exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat('jpeg')
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/users/${filename}`);

//     // Save image into our db
//     req.body.profileImg = filename;
//   }

//   next();
// });


exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);


exports.createUser = factory.createOne(User);


exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.deleteUser = factory.deleteOne(User);







exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  console.log(req.user)

  req.params.id = req.user._id;
  next();
});


exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  console.log(req.user)

  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});



exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  console.log(req.user)

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  
  
  res.status(200).json({ data: updatedUser });
  
});



exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Account deactivated successfully' });
});



exports.reactiveMe = asyncHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id, { active: true });


  res.status(204).json({ status: 'Account reactivated successfully' });

})