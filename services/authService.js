const crypto = require("crypto")
const expressAsyncHandler = require('express-async-handler')
const userService = require('./userService')
const User = require('../models/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const ApiError = require('../utiles/ApiError')
const sendEmail = require('../utiles/sendEmail')
const createToken = require('../utiles/createToken')





exports.signup = expressAsyncHandler(async(req,res,next)=>{

    // 1) create user

    const user = await User.create({

        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    })


    // 2) create token :

    const token = createToken(user._id)


    // 3) respose with token 
    res.status(201).json({
        data:user,
        token
    })
})




exports.login = expressAsyncHandler(async (req, res, next) => {
    // 1) check if password and email in the body (validation)
    // 2) check if user exist & check if password is correct
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // 3) generate token
    const token = createToken(user._id);
  
    // Delete password from response
    delete user._doc.password;
    // 4) send response to client side
    res.status(200).json({ data: user, token });
  });



  exports.protect = expressAsyncHandler(async(req,res,next)=>{

    //1) check if token is exist in body , if exist get 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token ){
        return next(new ApiError("You aren't login please login again",401))
    //401 => unauthorized
    }


    // 2) verify token (no changes - not expired)
    const decoded = jwt.verify(token,process.env.jwtSecretKey)



    // 3) check if user is exist 
    const currentUser = await User.findById(decoded.userId)
    if(!currentUser){return next(new ApiError("the user of this token is no longer exist " , 401))}

    if(!currentUser.active){
        return next(new ApiError("This account is deactivated ",401))
    }

    // 3) check if user changed password after the creation of token
    if(currentUser.passwordChangedAt){
        const passwordChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime()/1000)
        //
        if(passwordChangedTimeStamp > decoded.iat){
            return next(new ApiError("the password has been changed please , login again" , 401))
        }

    }

    req.user = currentUser
 
    next()

  })


exports.allowedTo = (...roles)=> expressAsyncHandler(async(req,res,next)=>{
    console.log(roles)
    if(!roles.includes(req.user.role)){
        return next(new ApiError("You aren't allowed to access this route",403))
    }
    next()

})



exports.forgotPassword = expressAsyncHandler(async(req,res,next)=>{


    //1)get user from body and check if user is exist 
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new ApiError(`there is no user with this email : ${req.body.email}`,404))   
     }


     //2) generate random 6-digit reset code and hash it 
     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
     const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

     //save into db   , EXP = 10 minutes (in config file)
     user.passwordResetCode = hashedResetCode;
     user.passwordResetExpire = Date.now() + process.env.passCodeExpire *60 * 1000;
     user.passwordResetVerified= false ; 

     user.save()

    //  3)send the reset code via email 
     try{
        await sendEmail({
            email:user.email,
            subject:"Your password reset code (valid for 10 minute)",
            message:`
    
            Hi,${user.name}
            
            You have requested a password reset for your reca-eshop account. Please use the following code to reset your password:
    
            Reset Code: [${resetCode}]
    
            This code will expire in [${process.env.passCodeExpire} minutes], so please use it promptly.
    
            If you did not request this password reset, please ignore this email. Your account security may have been compromised if you did not initiate this request.
    
            Thank you,
            [RECA] Team
            `,
    
        })
    
     }catch{

        user.passwordResetCode = undefined;
        user.passwordResetExpire = undefined;
        user.passwordResetVerified= undefined ; 

        await user.save()
        return next(new ApiError("There is an error !!",500))
     }

    res.status(200).json({
        status : "success",
        message : "reset code sent to email"
    })
})




exports.verifyPassResetCode = expressAsyncHandler(async(req,res,next)=>{

    // 1) get user based on resetcode (hash then get )
    const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

    const user = await User.findOne({passwordResetCode:hashedResetCode ,
                 passwordResetExpire:{$gt : Date.now()},
                }) 
    if (!user){
        return next(new ApiError("invalid or expired token !"))
    }


    // 2)reset code verified  
    user.passwordResetVerified = true ;
    await user.save()

    res.status(200).json({
        status : "success"
    })        
})




exports.resetPassword=expressAsyncHandler(async(req,res,next)=>{

    // 1) get user by email 
    const user = await User.findOne({email:req.body.email})

    if (!user){
        return next(new ApiError(`there is no user with this email : ${req.body.email}`))
    }


    // check if code is verified 
    if (!user.passwordResetVerified ){
        return next(new ApiError(`reset code is not verified`,404))
    }


    user.password = req.body.newPassword
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerified= undefined ; 
    user.active = true;

    await user.save()


    //if every thing is ok generate new token :

    const token = createToken(user._id);

    res.status(200).json({token})
})


