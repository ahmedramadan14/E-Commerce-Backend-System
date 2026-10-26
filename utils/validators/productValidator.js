const { check, body } = require('express-validator');
const slugify = require('slugify');
const mongoose = require('mongoose');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const categoryModel = require('../../models/categoryModel');
const subcategoryModel = require('../../models/subCategoryModel');

exports.createProductValidator = [
  //  TITLE
  check('title')
    .notEmpty()
    .withMessage('Product required')
    .bail() // لو في ايرور هيوقف مش هيكمل الي بعده 
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .bail()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  //  DESCRIPTION
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .bail()
    .isLength({ max: 2000 })
    .withMessage('Too long description'),

  //  QUANTITY
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .bail()
    .isNumeric()
    .withMessage('Product quantity must be a number'),

  //  SOLD
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Sold must be a number'),

  //  PRICE
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .bail()
    .isFloat()
    .withMessage('Product price must be a number'),

  //  PRICE AFTER DISCOUNT
  check('priceAfterDiscount')
    .optional()
    .isFloat()
    .withMessage('priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      const price = parseFloat(req.body.price);
      if (price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  //  COLORS
  check('colors')
    .optional()
    .isArray()
    .withMessage('colors should be array of string'),

  //  IMAGE COVER
  check('imageCover')
    .notEmpty()
    .withMessage('Product imageCover is required'),

  //  IMAGES
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),

  //  CATEGORY
  check('category')
    .notEmpty()
    .withMessage('Product must be belong to a category')
    .bail()
    .isMongoId()
    .withMessage('Invalid ID format')
    .bail()
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No Category For this Id : ${categoryId}`);
      }
      return true;
    }),

  //  SUBCATEGORIES
  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array')
    .bail()

    //  check duplicates
    .custom((subcategoryIds) => {
      const uniqueIds = new Set(subcategoryIds);
      if (uniqueIds.size !== subcategoryIds.length) {
        throw new Error('Duplicate subcategory IDs are not allowed');
      }
      return true;
    })
    .bail()

    //  check valid MongoId
    .custom((subcategoryIds) => {
      const allValid = subcategoryIds.every(id =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!allValid) {
        throw new Error('Invalid subcategory ID format');
      }
      return true;
    })
    .bail()

    //  check existence in DB
    .custom(async (subcategoryIds) => {
      const found = await subcategoryModel.find({
        _id: { $in: subcategoryIds }
      });
      if (found.length !== subcategoryIds.length) {
        throw new Error('One or more subcategory IDs do not exist');
      }
      return true;
    })
    .bail()

    //  check belong to category
    .custom(async (val, { req }) => {
      if (!req.body.category) return true;

      const subcategories = await subcategoryModel.find({
        category: req.body.category
      });

      const subcategoriesIds = subcategories.map(sc =>
        sc._id.toString()
      );

      const allValid = val.every(id =>
        subcategoriesIds.includes(id)
      );

      if (!allValid) {
        throw new Error(
          'One or more subcategory IDs do not belong to the selected category'
        );
      }

      return true;
    }),

  //  BRAND
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID format'),

  //  RATINGS AVERAGE
  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  //  RATINGS QUANTITY
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

  validatorMiddleware,
];


//  GET PRODUCT
exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];

//  UPDATE PRODUCT
exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),

  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  validatorMiddleware,
];

//  DELETE PRODUCT
exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];