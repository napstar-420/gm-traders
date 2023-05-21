const { body } = require('express-validator');
const debug = require('debug')('*');
const config = require('../config/config');
const Type = require('../models/Type');
const Brand = require('../models/Brand');
const messages = require('../config/error_messages');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

const productValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name length should be minimum 1 and maximum 100'),

  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description length should be between 10 and 1000'),

  body('sizes')
    .optional()
    .custom((value) => {
      const sizes = value.split(',');
      if (Array.isArray(sizes)) {
        for (let i = 0; i < sizes.length; i++) {
          const isIncluded = Object.values(config.product.sizes).includes(sizes[i]);
          if (!isIncluded) {
            return false;
          }
        }
        return true;
      }
      return false;
    })
    .withMessage('Sizes should be appropriate'),

  body('color')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Color is required')
    .isLength({ max: 50 })
    .withMessage('Color length should be less than or equal to 50'),

  body('thumbnail', 'Thumbnail is required')
    .custom((value, { req }) => {
      if (
        req.files.thumbnail[0] &&
        config.imageMimeTypes.includes(req.files.thumbnail[0].mimetype)
      ) {
        return true;
      }
      return false;
    })
    .withMessage('Thumbnail should be in correct mimetype'),

  body('images')
    .optional()
    .custom((value, { req }) => {
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        if (!config.imageMimeTypes.includes(file.mimetype)) {
          return false;
        }
      }
      return true;
    })
    .withMessage('Images should be in correct mimetype'),

  body('price')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price should be a number')
    .isInt({ min: 50 })
    .withMessage('Price should be minimum 100'),

  body('itemsInStock')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Items in stock is required')
    .isNumeric()
    .withMessage('Items in stock should be a number')
    .isInt({ min: 0 })
    .withMessage('Minimum 0'),

  body('brand')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Brand is required')
    .custom(async (value) => {
      await Brand.findById(value)
        .exec()
        .then((result) => result !== null)
        .catch((err) => {
          debug(err);
          return false;
        });
    })
    .withMessage(messages.type.notFound),

  body('type')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.type.required)
    .isMongoId()
    .withMessage(messages.idInvalid)
    .custom(
      (value) => new Promise((resolve, reject) => {
        Type.findById(value)
          .exec()
          .then((result) => {
            if (result !== null) {
              resolve();
            } else {
              reject(messages.type.notFound);
            }
          })
          .catch((error) => {
            debug(error);
            reject(messages.somethingWentWrong);
          });
      }),
    )
    .withMessage(messages.type.notFound),

  body('subCategory')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.subCategory.required)
    .isMongoId()
    .withMessage(messages.idInvalid)
    .custom(
      (value) => new Promise((resolve, reject) => {
        SubCategory.findById(value)
          .exec()
          .then((result) => {
            if (result !== null) {
              resolve();
            } else {
              reject(messages.subCategory.notFound);
            }
          })
          .catch((error) => {
            debug(error);
            reject(messages.somethingWentWrong);
          });
      }),
    )
    .withMessage(messages.subCategory.notFound),

  body('category')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.category.required)
    .isMongoId()
    .withMessage(messages.idInvalid)
    .custom(
      (value) => new Promise((resolve, reject) => {
        Category.findById(value)
          .exec()
          .then((result) => {
            if (result !== null) {
              resolve();
            } else {
              reject(messages.category.notFound);
            }
          })
          .catch((error) => {
            debug(error);
            reject(messages.somethingWentWrong);
          });
      }),
    )
    .withMessage(messages.category.notFound),
];

module.exports = productValidation;
