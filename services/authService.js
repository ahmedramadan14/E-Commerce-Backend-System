const jwt = require('jsonwebtoken')
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const createToken = require('../utils/createToken')

// @desc    signup
// @route   GET /api/v1/signup
// @access  Public
exports.signup = asyncHandler(async(req , res)=>{
    // 1 create user
    const user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
    });
    // 2  generate token
    const token = jwt.sign({userId: user._id} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(201).json({data: user , token})
})


// @desc    login
// @route   GET /api/v1/login
// @access  Public
exports.login = asyncHandler(async(req , res , next)=>{
    // 1 check if passsword and email in the body (validation)
    // 2 check if user exist & check if password is correct 
    const user = await User.findOne({email:req.body.email})
    if(!user || !(await bcrypt.compare(req.body.password , user.password))){
        return next(new ApiError('Incorrect Email or password' , 401))
    }
    // 3 generate token
    const token = jwt.sign({userId: user._id} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    // send response to client side
        res.status(201).json({data: user , token})
})

// @desc    make sure the user is logged in
exports.protect = asyncHandler(async(req , res, next)=>{
    //1 check if token exist , if exist get 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new ApiError('You are not login, please login to get access this route',401))
    }
    //2 verify token (no change happens , expired token)
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    //3 check if user exist 
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
        return next(new ApiError('the user that belong to this token does no longer exist' , 401))
    } 
    //4 check if user change his passsword after token created
    if(currentUser.passwordChangedAt){
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10);
        // password changed after token created (Error)
        if(passChangedTimestamp > decoded.iat){
            return next(new ApiError('User recently changed his password , please login again...' , 401))
        }
    }
    req.user = currentUser;
    next();
})

// @desc    Authorization [user permissions]
// ['admin', 'manager']
exports.allowedTo = (...role) => asyncHandler(async(req , res , next)=>{
    // 1 access role
    // 2 access registered user (req.user.role)
    if(!role.includes(req.user.role)){
        return next(new ApiError('You are not allowed to access this route' , 403));
    }
    next();
})

// الطريقه دي لو عايز ابعتله لينك يخش فيه يعدل الباسورد 
// exports.forgotPassword = asyncHandler(async(req , res, next)=>{
//     //1 Get user by email
//     const user = await User.findOne({email:req.body.email});
//     if(!user){
//         return next(new ApiError(`There is no user with that email ${req.body.email}` , 404))
//     }
//     // Generate a token
//     const plainResetToken = user.generateResetToken();
//     await user.save();

//     // Send an email to user with password reset link
//     const resetTokenLink = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${plainResetToken}`
//     const body = `we have received a password reset request. please use below link to reset your password\n\n${resetTokenLink}\n\nThis password reset link is valid for 10 minutes. `; 

//     try{
//     console.log("Before send email");
//         await sendEmail({
//             email: user.email,
//             subject: 'Password Change Request Received',
//             message:body
//         });
//     console.log("After send email");
//     // sned Response
//     res.status(200).json({
//         status:'success',
//         message:'A password reset link has been sent to your email.'
//     })
//     }catch(error){
//         user.resetToken = undefined;
//         user.resetTokenExpiresAt = undefined;
//         await user.save({ validateBeforeSave: false });

//         // const err = new ApiError('There was an error sending password reset email. Please try again later.' , 500)
//         // return next(err);
//         return next(error);
//     }

// })
// -------------------------------------------------------------------------------------------------
// دي يبعتله 6 ارقام يدخلهم 

//  @desc       ForgotPassword
//  @route      POST  /api/v1/auth/forgotpassword
//  @access     Pablic
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

  await user.save({ validateBeforeSave: false });
  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ApiError('There is an error in sending email', 500));
//     console.error('Email error details:', err);
// return next(new ApiError(`Email error: ${err.message}`, 500));
  }

  res.status(200).json({
     status: 'Success', message: 'Reset code sent to email' 
    });
});


// Reset Password 
//  @desc       Verify Pass Reset Code
//  @route      POST     /api/v1/auth/verifyPassResetCode
//  @access     Pablic 
exports.verifyPassResetCode = asyncHandler(async(req , res ,next)=>{
    // 1)  Get user based on recet code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex')

    const user = await  User.findOne({
        passwordResetCode:hashedResetCode,
        passwordResetExpires: {$gt: Date.now() },
    });
    if(!user){
        return next(new ApiError('Reset code invalid or expired'));
    }
    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();
    
    res.status(200).json({
        status:'Success',
    });
});



// Reset Password 
//  @desc       Verify Pass Reset Code
//  @route      POST     /api/v1/auth/verifyPassResetCode
//  @access     Pablic 
exports.resetPassword = asyncHandler(async(req , res ,next)=>{
    // 1) Get user based on email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ApiError(`There is no user with email ${req.body.email}` , 404))
    }

    // 2) check if reset password Verified
    if(!user.passwordResetVerified){
        return next(new ApiError('Reset Code not Verified' , 404))
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    //  3) if evrything in ok , generate token   

    const token = createToken(user._id);
    res.status(200).json({token});
})




    // const restCode = Math.floor(100000 + Math.random() * 900000).toString();
    // const hashedResetCode = crypto
    //     .createHash('sha256')
    //     .update(restCode)
    //     .digest('hex')
    // // save hashed passsword reset code into db
    // user.passwordResetCode = hashedResetCode;
    // // add expiration time for password reset code (10 min)
    // user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // user.passwordResetVerified = false;
    // await user.save(); 