const handlerFactory = require('./handlerfactory')
const subCategoryModel = require('../models/subCategoryModel');


exports.SetCategoryIdToBody = (req , res , next) =>{
    // Nested route
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

// Nested route
// GET  /api/v1/categories/:id/subcategories
exports.CreateFilterObject = (req , res , next) =>{
        let filterObject = {};
    // console.log(req.params)
    if(req.params.categoryId){
        filterObject =  {category : req.params.categoryId};
    }
    req.filterObj = filterObject;
    next();
}

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getsubCategory  = handlerFactory.getAll(subCategoryModel);

// @desc    Create new subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = handlerFactory.createOne(subCategoryModel);

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getsubCategoryById = handlerFactory.getOne(subCategoryModel);

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updatesubCategory = handlerFactory.updateOne(subCategoryModel);

// @desc    Delete specific subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deletesubCategory = handlerFactory.deleteOne(subCategoryModel);