const UserModel = require('../models/userModel')
const handlerFactory = require('./handlerfactory')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError')
const bcrypt = require('bcryptjs')
const {v4 : uuidv4} = require('uuid');
const sharp = require('sharp');
const createToken = require('../utils/createToken');
const { token } = require('morgan');




// Upload Single Image
exports.uploadUserImage = uploadSingleImage('profileimage');

// Image Processing 
exports.resizeImage = asyncHandler( async (req , res , next)=>{

    if (!req.file) return next();
    
    const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600 , 600)
        .toFormat('jpeg')
        .jpeg({quality: 90 })
        .toFile(`uploads/Users/${filename}`);


    req.body.profileimage = filename;
        next();
})

// @desc    Get list of Users
// @route   GET /api/v1/Users
// @access  Private/Admin
exports.getUsers = handlerFactory.getAll(UserModel);

// @desc    Create new User
// @route   POST /api/v1/Users
// @access  Private/Admin
exports.creatUsers = handlerFactory.createOne(UserModel);

// @desc    Get specific User by id
// @route   GET /api/v1/Users/:id
// @access  Private/Admin
exports.getUserById  = handlerFactory.getOne(UserModel);

// @desc    Update specific User
// @route   PUT /api/v1/Users/:id
// @access  Private/Admin
exports.updateUser  = asyncHandler(async (req , res , next)=> {
    const document = await UserModel.findByIdAndUpdate(
        req.params.id , 
        {
            // This is a list of properties that I will allow him to modify by this route 
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileimage: req.body.profileimage,
            role: req.body.role,
        },
        {new : true , runValidations:true})
        // new :true : return category after update (without new:true -> return category before update)
    if(!document){ 
        return next(new ApiError(`documnet with ${req.params.id} Not found` , 404))
    }
    res.status(200).json({msg:'documnet Updated Succesfully',
        data:{
            document
        }
    })
});

exports.ChangeuserPassword = asyncHandler(async (req , res , next)=> {
    const document = await UserModel.findByIdAndUpdate(
        req.params.id , 
        {
            // This is a list of properties that I will allow him to modify by this route 
            password: await bcrypt.hash(req.body.password , 12),
            passwordChangedAt:Date.now(),
        },
        {new : true , runValidations:true})
        // new :true : return category after update (without new:true -> return category before update)
    if(!document){ 
        return next(new ApiError(`documnet with ${req.params.id} Not found` , 404))
    }
    res.status(200).json({msg:'documnet Updated Succesfully',
        data:{
            document
        }
    })
});

// @desc    Delete specific User
// @route   DELETE /api/v1/Users/:id
// @access  Private/Admin
exports.deleteUser = handlerFactory.deleteOne(UserModel);

// @desc    Get Logged user data
// @route   GET /api/v1/Users/getMy
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler( async (req, res , next) => {
    req.params.id = req.user._id;
    next();
})


// @desc    Update Logged user Password
// @route   PUT /api/v1/Users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async(req , res , next)=>{
    // 1) update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            password:await bcrypt.hash(req.body.password , 12),
            passwordChangedAt: Date.now(),
        },
        {
            new:true
        }
    );
    // 2) Generate Token
    const token = createToken(user._id);
    res.status(200).json({data:user , token})
})


// @desc    Update Logged user data (without password, role)
// @route   PUT /api/v1/Users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async(req , res , next)=>{
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
        },
        {new : true}
    );
    res.status(200).json({data:updatedUser})
})

// @desc    Deactive Logged user
// @route   PUT /api/v1/Users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async(req , res , next)=>{
    await UserModel.findByIdAndUpdate(req.user._id , {active  : false});

    res.status(200).json({status:'Success'})
})