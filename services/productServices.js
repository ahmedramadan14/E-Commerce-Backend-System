const ProductModel = require('../models/productModel')
const handlerFactory = require('./handlerfactory')
const productModel = require('../models/productModel')
const asyncHandler = require('../middlewares/asyncHandler');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware')
const multer = require('multer')
const ApiError = require('../utils/ApiError')
const sharp = require('sharp');
const {v4 : uuidv4} = require('uuid');




exports.uploadProductImages = uploadMixOfImages([
    {
        name:'imageCover',
        maxCount: 1 
},
    {
        name:'images',
        maxCount : 5
    }
])

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1️⃣ imageCover
  if (req.files && req.files.imageCover) {
    const fileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${fileName}`);

    req.body.imageCover = fileName;
  }

    // 2 - Image processing for images 
    if(req.files && req.files.images){
        req.body.images = [];
        
        await Promise.all(
        req.files.images.map( async (img , index)=>{
            const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${fileName}`);

            req.body.images.push(fileName)
        })
    )};
    //console.log(req.files.imageCover)
    //console.log(req.files.images)
    next();
})

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getproduct = handlerFactory.getAll(productModel , 'product');

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
exports.createproduct = handlerFactory.createOne(ProductModel);

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getproductById  = handlerFactory.getOne(ProductModel);

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateproduct = handlerFactory.updateOne(ProductModel);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteproduct = handlerFactory.deleteOne(ProductModel);