const express = require('express')

const UserServices = require('../services/userService');
const authService = require('../services/authService')

const { 
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator
    } = require('../utils/validators/userValidator')

const router = express.Router();
router.use(authService.protect)
router.get('/getMe' , UserServices.getLoggedUserData , UserServices.getUserById)

router.put('/changeMyPassword' , UserServices.updateLoggedUserPassword)

router.put('/updateMe'  ,updateLoggedUserValidator , UserServices.updateLoggedUserData)
router.put('/deleteMe' , UserServices.deleteLoggedUserData)

router.use(  authService.allowedTo('admin' , 'manager'))

router.route('/')
    .get(UserServices.getUsers)
    .post(UserServices.uploadUserImage,
        UserServices.resizeImage,
        createUserValidator,
        UserServices.creatUsers)
    
// هيطبقوا علي اي راوت يجي بعدها 
router.put('/changePassword/:id', changeUserPasswordValidator,UserServices.ChangeuserPassword);

    //  Validation Error (Client Error)
router.route('/:id')
    .get(
         getUserValidator , 
         UserServices.getUserById)
    .delete(
        deleteUserValidator , 
        UserServices.deleteUser)
    .patch(
        UserServices.uploadUserImage,
        UserServices.resizeImage,
        updateUserValidator,
        UserServices.updateUser)
    

module.exports = router;
