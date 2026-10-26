const { check } = require('express-validator')

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const  slugify  = require('slugify');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleware,
]

exports.createBrandValidator = [
    check('name')
    .notEmpty()
    .withMessage('Brand Required')
    .isLength({min: 3})
    .withMessage('Too Short Brand name')
    .isLength({max : 32})
    .withMessage('Too long Brand name')
    .custom((val , {req}) =>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    check('name')
    .optional()
    .custom((val , {req}) =>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];


exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleware,
];