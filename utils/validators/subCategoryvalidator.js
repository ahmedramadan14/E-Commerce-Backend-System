const { check } = require('express-validator')
const  slugify  = require('slugify');

const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.getsubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id format'),
    validatorMiddleware,
]

exports.createsubCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('subCategory Required')
    .isLength({min: 2})
    .withMessage('Too Short subCategory name')
    .isLength({max : 32})
    .withMessage('Too long subCategory name')
    .custom((val , {req}) =>{
    req.body.slug = slugify(val);
    return true;
}),
    check('category')
    .notEmpty()
    .withMessage('SubCategory must be belong to Category')
    .isMongoId()
    .withMessage('Invalid subCategory id format'),
    validatorMiddleware
];

exports.updatesubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id format'),
    check('name').custom((val , {req}) =>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];


exports.deletesubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id format'),
    validatorMiddleware,
];