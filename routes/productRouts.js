const express = require('express')

const ProductServices = require('../services/productServices');
const authService = require('../services/authService')

const { 
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
    } = require('../utils/validators/productValidator')

const router = express.Router();



router.route('/')
    .get( ProductServices.getproduct)
    .post(
        authService.protect,
        authService.allowedTo('admin' , 'manager'),
        ProductServices.uploadProductImages,
        ProductServices.resizeProductImages,
        createProductValidator, 
        ProductServices.createproduct)
    

router.route('/:id')
    .get(getProductValidator , ProductServices.getproductById)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteProductValidator , ProductServices.deleteproduct)
    .patch(
        authService.protect,
        authService.allowedTo('admin'),
        ProductServices.uploadProductImages,
        ProductServices.resizeProductImages,
        updateProductValidator, 
        ProductServices.updateproduct)

    module.exports = router;
