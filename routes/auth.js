const express = require('express');

const authController = require('../controllers/auth');

const { check ,body } = require('express-validator/check')

const router = express.Router();

const User = require('../models/user');
const { text } = require('body-parser');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);
  
router.get('/signup', authController.getSignup);


router.post('/signup',
[
 check('email')
 .isEmail()
 .withMessage("Please Enter a valid email")
.custom((value,{req}) => {
    // if(value === 'test@test.com'){
    //     throw new Error("This email address is forbidden ")
    // }
    // return true
    return User.findOne({
        email: value
    })
    .then(userDoc => {
        if(userDoc){
            return Promise.reject('Email exists already , please pick a diffent one ')
        }
    })
}),
body(
    'password',
    'Please Enter a password with only numbers and text and at least 5 characters. '
)
.isLength({min: 5})
.isAlphanumeric(),
body('confirmPassword').custom((value,{req}) => { 
    if(value !== req.body.password) {
        throw new Error('Password have match')
    }
    return true;
})
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassowrd)

module.exports = router;