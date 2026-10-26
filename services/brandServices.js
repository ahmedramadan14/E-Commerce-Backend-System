const BrandModel = require('../models/brandModel')
const handlerFactory = require('./handlerfactory')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const asyncHandler = require('../middlewares/asyncHandler');
const {v4 : uuidv4} = require('uuid');
const sharp = require('sharp');




// Upload Single Image
exports.uploadBrandImage = uploadSingleImage('image');

// Image Processing 
exports.resizeImage = asyncHandler( async (req , res , next)=>{

    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600 , 600)
        .toFormat('jpeg')
        .jpeg({quality: 90 })
        .toFile(`uploads/brands/${filename}`);
    next();

    req.body.image = filename;
})

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = handlerFactory.getAll(BrandModel);

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private
exports.creatBrands = handlerFactory.createOne(BrandModel);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrandById  = handlerFactory.getOne(BrandModel);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand  = handlerFactory.updateOne(BrandModel);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = handlerFactory.deleteOne(BrandModel);