const express = require('express')

const BrandServices = require('../services/brandServices');
const authService = require('../services/authService')

const { 
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
    } = require('../utils/validators/brandvalidator')

const router = express.Router();



router.route('/')
    .get( BrandServices.getBrands)
    .post(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        BrandServices.uploadBrandImage,
        BrandServices.resizeImage,
        createBrandValidator,
        BrandServices.creatBrands)
    
    //  Validation Error (Client Error)
router.route('/:id')
    .get(getBrandValidator , BrandServices.getBrandById)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteBrandValidator , BrandServices.deleteBrand)
    .patch(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        BrandServices.uploadBrandImage,
        BrandServices.resizeImage,
        updateBrandValidator,
        BrandServices.updateBrand)
        
module.exports = router;
