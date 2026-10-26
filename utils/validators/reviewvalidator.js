const { check } = require('express-validator')
const Review = require('../../models/reviewModels')
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createreviewValidator = [
    check('title').optional(),
    check('ratings')
        .notEmpty().withMessage('ratings value required')
        .isFloat({min: 1 , max: 5})
        .withMessage('ratings value must be between 1 to 5'),
    check('user')
        .isMongoId().withMessage('Invalid Reviwe id format'),
    check('product')
        .isMongoId().withMessage('Invalid Reviwe id format')
    .custom(async (val, { req }) => {
        const review = await Review.findOne({
            user: req.user._id,
            product: req.body.product
        });

        if (review) {
            throw new Error('You have already created a review before');
        }
    })
    ,validatorMiddleware
];



exports.getreviewValidator = [
    check('id').isMongoId().withMessage('Invalid review id format'),
    validatorMiddleware,
];



exports.updatereviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid review id format')
        .bail()
        // check review onwership before update
        .custom(async (id, { req }) => {
            const review = await Review.findById(id);

            if (!review) {
                throw new Error(`There is no review with this id ${id}`);
            }

            if (review.user.toString() !== req.user._id.toString()) {
                throw new Error(
                    'You are not allowed to access this review'
                );
            }
        }),

    validatorMiddleware,
];



exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid review id format')
        .bail()
        .custom(async (id, { req }) => {
            const review = await Review.findById(id);

            if (!review) {
                throw new Error(
                    `There is no review with this id ${id}`
                );
            }

            if (
                req.user.role === 'user' &&
                review.user.toString() !== req.user._id.toString()
            ) {
                throw new Error(
                    'You are not allowed to access this review'
                );
            }
            return true; 
                // مش ضروري هنا؛ لأن الـ express-validator بيعتبر الـ custom validator ناجحًا لو الـ Promise انتهى من غير rejection
        }),

    validatorMiddleware,
];
