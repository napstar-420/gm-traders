/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const SubCategory = require('../models/SubCategory');
const Type = require('../models/Type');
const messages = require('../config/error_messages');
const Category = require('../models/Category');

function getAllSubCategories(req, res) {
  SubCategory.find()
    .exec()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
}

const createSubCategory = [
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
        .then((result) => result !== null);
    })
    .withMessage(messages.category.notFound),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json(errors);
  },

  (req, res, next) => {
    SubCategory.findOne({ name: req.body.name })
      .exec()
      .then((result) => {
        if (result === null) {
          return next();
        }
        return res
          .status(406)
          .json({ message: messages.subCategory.alreadyExists });
      })
      .catch((err) => (
        res.status(500).json({ message: messages.somethingWentWrong, err })
      ));
  },

  async (req, res) => {
    const subCategory = new SubCategory({
      name: req.body.name,
      category: req.body.category,
    });
    try {
      await subCategory.save();
      res.json({ message: messages.subCategory.created, subCategory });
    } catch (err) {
      res.status(500).json({ message: messages.somethingWentWrong, err });
    }
  },
];

function getSubCategory(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: messages.idInvalid,
      id,
    });
  }

  return async.parallel(
    [
      function subCategory(done) {
        SubCategory.findById(id)
          .exec()
          .then((result) => (
            result === null
              ? done({ message: messages.subCategory.notFound })
              : done(null, result)
          ))
          .catch((err) => res.status(500).json({ err }));
      },

      function products(done) {
        Product.find({ subCategory: id })
          .select({ images: -1, description: -1, numberOfItems: -1 })
          .populate('Brand')
          .populate('Category')
          .populate('SubCategory')
          .populate('Type')
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

function deleteSubCategory(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.idInvalid, id });
  }

  return async.series(
    {
      check(done) {
        SubCategory.findById(id)
          .exec()
          .then((result) => {
            if (result === null) {
              done({ message: messages.subCategory.notFound });
            } else {
              done(null);
            }
          });
      },
      products(done) {
        Product.deleteMany({ subCategory: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
      types(done) {
        Type.deleteMany({ subCategory: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
      subCategory(done) {
        SubCategory.deleteOne({ _id: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
    },

    (error) => {
      if (error) {
        if (error.message === messages.subCategory.notFound) {
          res.status(400);
        } else {
          res.status(500);
        }
        return res.json(error);
      }
      return res.json({ message: messages.subCategory.deleted });
    },
  );
}

module.exports = {
  getAllSubCategories,
  createSubCategory,
  getSubCategory,
  deleteSubCategory,
};
