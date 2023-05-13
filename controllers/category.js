/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Product = require('../models/Product');
const messages = require('../config/error_messages');

function getAllCategories(req, res) {
  Category.find()
    .exec()
    .then((categories) => res.json(categories))
    .catch((err) => res.json(err));
}

const createCategory = [
  body('name', 'Name is required')
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json(errors);
  },

  (req, res, next) => {
    Category.findOne({ name: req.body.name })
      .exec()
      .then((category) => {
        if (category === null) {
          return next();
        }
        return res.status(406).json({ message: messages.category.alreadyExists });
      })
      .catch((err) => (
        res.status(500).json({ message: messages.somethingWentWrong, err })
      ));
  },

  async (req, res) => {
    const category = new Category({
      name: req.body.name,
    });
    try {
      await category.save();
      res.json({ message: messages.category.created, category });
    } catch (err) {
      res.status(500).json({ message: messages.somethingWentWrong, err });
    }
  },
];

function getCategory(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: messages.idInvalid,
      id,
    });
  }

  return async.parallel(
    [
      function category(done) {
        Category.findById(id)
          .exec()
          .then((result) => (
            result === null
              ? done({ message: messages.category.notFound })
              : done(null, result)
          ))
          .catch((err) => res.status(500).json({ err }));
      },

      function products(done) {
        Product.find({ category: id })
          .select({ images: -1, description: -1, numberOfItems: -1 })
          .populate('Brand')
          .populate('Category')
          .populate('Type')
          .exec()
          .then((result) => done(null, result))
          .catch((err) => done({ message: messages.somethingWentWrong, err }));
      },
    ],

    (err, results) => {
      if (err) {
        if (err.message === messages.category.notFound) {
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

function deleteCategory(req, res) {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.idInvalid, id });
  }

  return async.series(
    {
      check(done) {
        Category.findById(id)
          .exec()
          .then((category) => {
            if (category === null) {
              done({ message: messages.category.notFound });
            } else {
              done(null);
            }
          });
      },
      products(done) {
        Product.deleteMany({ category: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
      category(done) {
        Category.deleteMany({ _id: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: 'messages.somethingWentWrong' }));
      },
    },

    (error, results) => {
      if (error) {
        if (error.message === messages.category.notFound) {
          res.status(400);
        } else {
          res.status(500);
        }
        return res.json(error);
      }
      return res.json({ message: messages.category.deleted });
    },
  );
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  deleteCategory,
};
