const CategoryModel = require('../models/categoryModel')
const sharp = require('sharp');
const handlerFactory = require('./handlerfactory')
const {v4 : uuidv4} = require('uuid');
const asyncHandler = require('../middlewares/asyncHandler');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')


// Upload Single Image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image Processing 
exports.resizeImage = asyncHandler( async (req , res , next)=>{

    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600 , 600)
        .toFormat('jpeg')
        .jpeg({quality: 90 })
        .toFile(`uploads/categories/${filename}`);
    
        req.body.image = filename;
    }
next();
})


// @desc    GET List Of Category
// @route   GET /api/v1/categories
// @access  Public

// Bulid query
exports.getCategory = handlerFactory.getAll(CategoryModel);

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private/Admin-Manager
exports.creatCategory = handlerFactory.createOne(CategoryModel);
// @desc    Get specific Category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategoryById  = handlerFactory.getOne(CategoryModel);

// @desc    Update specific Category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updatecategory  = handlerFactory.updateOne(CategoryModel);

// @desc    Delete specific Category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = handlerFactory.deleteOne(CategoryModel);
