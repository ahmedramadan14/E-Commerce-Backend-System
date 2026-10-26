const express = require('express')

const subCategoryServices = require('../services/subCategoryServices');
const authService = require('../services/authService')

const { 
    createsubCategoryValidator,
    getsubCategoryValidator,
    updatesubCategoryValidator,
    deletesubCategoryValidator,
    
}= require('../utils/validators/subCategoryvalidator');
const subCategoryModel = require('../models/subCategoryModel');

const router = express.Router({mergeParams:true});


router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin' , 'manager'), 
        subCategoryServices.SetCategoryIdToBody , createsubCategoryValidator , subCategoryServices.createSubCategory)
    .get( subCategoryServices.CreateFilterObject ,subCategoryServices.getsubCategory)
    

router.route('/:id')
    .get(getsubCategoryValidator , subCategoryServices.getsubCategoryById)
    .patch(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        updatesubCategoryValidator , subCategoryServices.updatesubCategory)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deletesubCategoryValidator , subCategoryServices.deletesubCategory)

module.exports = router;
