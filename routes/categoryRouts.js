const express = require('express')


const CategoryServices = require('../services/CategoryServices');

const { 
    getcategoryValidator,
    createcategoryValidator,
    updatecategoryValidator,
    deletecategoryValidator
    } = require('../utils/validators/categoryvalidator')



const router = express.Router();

const subcategoriesRoute = require('./subCategoryRouts')
const authService = require('../services/authService')

router.use('/:categoryId/subcategories' , subcategoriesRoute)


router.route('/')
    .get( CategoryServices.getCategory)
    .post(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        CategoryServices.uploadCategoryImage,
        CategoryServices.resizeImage,
        createcategoryValidator,
        CategoryServices.creatCategory)
    
    //  Validation Error (Client Error)
router.route('/:id')
    .get(getcategoryValidator , CategoryServices.getCategoryById)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deletecategoryValidator , CategoryServices.deleteCategory)
    .patch(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        CategoryServices.uploadCategoryImage,
        CategoryServices.resizeImage,
        updatecategoryValidator, 
        CategoryServices.updatecategory)
module.exports = router;

