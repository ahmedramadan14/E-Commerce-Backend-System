const express = require('express')

const ReviewServices = require('../services/reviewServices');
const authService = require('../services/authService')
const {
    getreviewValidator,
    createreviewValidator,
    updatereviewValidator,
    deletereviewValidator,
    getOnereviewValidator,
} = require('../utils/validators/reviewvalidator');
const router = express.Router();

router.route('/')
    .get( ReviewServices.getReview)
    .post(
        authService.protect,authService.allowedTo('user') ,
        createreviewValidator,
        ReviewServices.creatReview)
    
    //  Validation Error (Client Error)
router.route('/:id')
    .get( ReviewServices.getReviewById)
    .delete(authService.protect , authService.allowedTo('user' , 'manager' , 'admin'), ReviewServices.deleteReview)
    .patch(authService.protect , authService.allowedTo('user') , ReviewServices.updateReview)
        
module.exports = router;
