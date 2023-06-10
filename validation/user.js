const { body } = require('express-validator');
const User = require('../models/User');
const messages = require('../config/error_messages');

const userValidation = [
  body('firstName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('First name should be less than or equal to 50 characters'),

  body('lastName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name should be less than or equal to 50 characters'),

  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not correct')
    .custom((value) => new Promise((resolve, reject) => {
      User.findOne({ email: value })
        .select({ email: 1 })
        .exec()
        .then((result) => {
          if (result === null) {
            resolve();
          }
          reject();
        })
        .catch(() => {
          reject(messages.somethingWentWrong);
        });
    }))
    .withMessage('Email already taken'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*\d)(?=.*[!@#$%^_&-*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .withMessage('Password must include at least one number, one special character, one lowercase letter, one uppercase letter, and be at least 8 characters long'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage('Password and confirm password does not matches'),
];

module.exports = userValidation;
