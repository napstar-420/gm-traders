/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('*');
const Product = require('../models/Product');
const SubCategory = require('../models/SubCategory');
const Type = require('../models/Type');
const messages = require('../config/error_messages');
const Category = require('../models/Category');

function getAllTypes(req, res) {
  Type.find()
    .exec()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
}

const createType = [
  body('name', 'Name is required')
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 }),

  body('category')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.category.required)
    .custom(async (value) => {
      await Category.findById(value)
        .exec()
        .then((result) => result !== null)
        .catch((err) => {
          debug(err);
          return false;
        });
    })
    .withMessage(messages.category.notFound),

  body('subCategory')
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.subCategory.required)
    .custom(async (value) => {
      await SubCategory.findById(value)
        .exec()
        .then((result) => result !== null)
        .catch((err) => {
          debug(err);
          return false;
        });
    })
    .withMessage(messages.subCategory.notFound),

  // Validation Error checking
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json(errors);
  },

  // Checking if type already exists
  (req, res, next) => {
    Type.findOne({ name: req.body.name })
      .exec()
      .then((result) => {
        if (result === null) {
          return next();
        }
        return res
          .status(406)
          .json({ message: messages.type.alreadyExists });
      })
      .catch((err) => (
        res.status(500).json({ message: messages.somethingWentWrong, err })
      ));
  },

  // Creating type
  async (req, res) => {
    const type = new Type({
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
    });
    try {
      await type.save();
      res.json({ message: messages.type.created, type });
    } catch (err) {
      res.status(500).json({ message: messages.somethingWentWrong, err });
    }
  },
];

function getType(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: messages.idInvalid,
      id,
    });
  }

  return async.parallel(
    [
      function type(done) {
        Type.findById(id)
          .exec()
          .then((result) => (
            result === null
              ? done({ message: messages.type.notFound })
              : done(null, result)
          ))
          .catch((err) => res.status(500).json({ err }));
      },

      function products(done) {
        Product.find({ type: id })
          .exec()
          .then((result) => done(null, result))
          .catch((err) => done({ message: messages.somethingWentWrong, err }));
      },
    ],

    (err, results) => {
      if (err) {
        if (err.message === messages.subCategory.notFound) {
          res.status(404);
        } else {
          res.status(500);
        }
        return res.json(err);
      }
      return res.json(results);
    },
  );
}

function deleteType(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: messages.idRequired });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.idInvalid, id });
  }

  return async.series(
    {
      check(done) {
        Type.findById(id)
          .exec()
          .then((result) => {
            if (result === null) {
              done({ message: messages.type.notFound });
            } else {
              done(null);
            }
          });
      },
      products(done) {
        Product.deleteMany({ type: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
      types(done) {
        Type.deleteMany({ _id: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
    },

    (error) => {
      if (error) {
        if (error.message === messages.type.notFound) {
          res.status(400);
        } else {
          res.status(500);
        }
        return res.json(error);
      }
      return res.json({ message: messages.type.deleted });
    },
  );
}

module.exports = {
  getAllTypes,
  createType,
  getType,
  deleteType,
};
