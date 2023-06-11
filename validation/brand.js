const { body } = require('express-validator');
const debug = require('debug')('*');
const messages = require('../config/error_messages');
const Brand = require('../models/Brand');
const config = require('../config');

const brandValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.brand.required)
    .isLength({ min: 1, max: 50 })
    .withMessage('Length should be equal or less than 50')
    .custom(
      (value) =>
        new Promise((resolve, reject) => {
          Brand.findOne({ name: value })
            .select({ name: 1, _id: 0 })
            .exec()
            .then((result) => {
              if (result === null) {
                resolve();
              } else {
                reject(messages.brand.alreadyExists);
              }
            })
            .catch((error) => {
              debug(error);
              reject(messages.somethingWentWrong);
            });
        }),
    ),

  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Length should be less than or equal to 1000'),

  body('logo', 'Logo is required')
    .custom((value, { req }) => {
      if (req.file && config.imageMimeTypes.includes(req.file.mimetype)) {
        return true;
      }
      return false;
    })
    .withMessage('Mimetype should be correct'),
];

module.exports = brandValidation;
