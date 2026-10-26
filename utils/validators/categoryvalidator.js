const { check } = require('express-validator')
const  slugify  = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')
exports.getcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id format'),
    validatorMiddleware,
]

exports.createcategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('category Required')
    .isLength({min: 3})
    .withMessage('Too Short Category name')
    .isLength({max : 32})
    .withMessage('Too long Category name')
    .custom((val , {req}) =>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
];

exports.updatecategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id format'),
    check('name')
    .optional()
    .custom((val , {req}) =>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];


exports.deletecategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id format'),
    validatorMiddleware,
];