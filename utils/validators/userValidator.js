const { check  , body} = require('express-validator')
const userModel = require('../../models/userModel')
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const  slugify  = require('slugify');
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel');


exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
]

exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Required')
        .isLength({min: 3})
        .withMessage('Too Short User name')
        .isLength({max : 32})
        .withMessage('Too long User name')
        .custom((val , {req}) =>{
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage('Email is Required')
        .isEmail()
        .withMessage('Invalid Email Format')
        .custom((val) => {
            return userModel.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject('E-mail is already in use')
                }
            })
        }),
check('password')
    .notEmpty()
    .withMessage('Password Required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
        if (password != req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect')
        }
        return true;
    }),
// مش محتاج اضيفها في ال سكيما عندي انا بس بستقبلها وبتشيك 
check('passwordConfirm')
    .notEmpty()
    .withMessage('Password Confirmation is Required')
    ,check('profileimage')
            .optional(),
    check('phone')
            .optional()
            .isMobilePhone('ar-EG')
            .withMessage('invalid phone must be only accepted by Egy and SA phone numbers')
    ,validatorMiddleware
    ];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),
    validatorMiddleware,
];


exports.changeUserPasswordValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format'),

    check('currentpassword')
        .notEmpty()
        .withMessage('Enter current password')
        .custom(async (val, { req }) => {

            // 1) check user exists
            const user = await userModel.findById(req.params.id);
            if (!user) {
                throw new Error('There is no user for this id');
            }

            // 2) check current password
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentpassword,
                user.password
            );

            if (!isCorrectPassword) {
                throw new Error('Incorrect current password');
            }

      return true;
  }),

    check('confirmpassword')
        .notEmpty()
        .withMessage('You must enter your confirm password')
            // 3) check new password === confirm password
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    check('password')
        .notEmpty()
        .withMessage('You must enter your new password'),

        validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];