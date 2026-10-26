const express = require('express')

const AuthServices = require('../services/authService');

const { 
    signupValidator,
    loginValidator
    } = require('../utils/validators/authValidator')

const router = express.Router();



router.route('/signup').post(signupValidator,AuthServices.signup)


router.route('/login').post(loginValidator,AuthServices.login)
    
router.route('/forgotpassword').post(AuthServices.forgotPassword)


router.route('/verifyPassResetCode').post(AuthServices.verifyPassResetCode)


router.route('/resetPassword').put(AuthServices.resetPassword)



// router.put('/changePassword/:id', changeUserPasswordValidator,AuthServices.ChangeuserPassword);

//     //  Validation Error (Client Error)
// router.route('/:id')
//     .get(
//          getUserValidator , 
//          AuthServices.getUserById)
//     .delete(
//         deleteUserValidator , 
//         AuthServices.deleteUser)
//     .patch(AuthServices.uploadUserImage,
//         AuthServices.resizeImage,
//         updateUserValidator,
//         AuthServices.updateUser)
    

module.exports = router;
