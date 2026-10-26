const reviewModel = require('../models/reviewModels')
const handlerFactory = require('./handlerfactory')
const asyncHandler = require('../middlewares/asyncHandler');


// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReview = handlerFactory.getAll(reviewModel);

// @desc    Create new reviews
// @route   POST /api/v1/review
// @access  Private / protect/User
exports.creatReview = handlerFactory.createOne(reviewModel);

// @desc    Get specific review by id
// @route   GET /api/v1/review/:id
// @access  Public
exports.getReviewById  = handlerFactory.getOne(reviewModel);

// @desc    Update specific review
// @route   PUT /api/v1/review/:id
// @access  Private / protect/User
exports.updateReview  = handlerFactory.updateOne(reviewModel);

// @desc    Delete specific review
// @route   DELETE /api/v1/review/:id
// @access  Private / protect/User-Admin-manager
exports.deleteReview = handlerFactory.deleteOne(reviewModel);