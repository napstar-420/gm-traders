/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const mongoose = require('mongoose');
const async = require('async');
const { validationResult } = require('express-validator');
const multer = require('multer');
const debug = require('debug')('*');
const Product = require('../models/Product');
const messages = require('../config/error_messages');
const { uploadImage, emptyTempFolder } = require('../utils');
const productValidation = require('../validation/product');

const upload = multer({ dest: 'uploads/temp/' });

function getAllProducts(req, res) {
  Product.find()
    .exec()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
}

const createProduct = [
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),

  ...productValidation,

  // Validation Error checking
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      emptyTempFolder();
      return res.status(400).json(errors);
    }
    return next();
  },

  // Checking if Product already exists
  (req, res, next) => {
    Product.findOne({ name: req.body.name })
      .exec()
      .then((result) => {
        if (result === null) {
          return next();
        }
        return res
          .status(406)
          .json({ message: messages.product.alreadyExists });
      })
      .catch((err) => res.status(500).json({ message: messages.somethingWentWrong, err }));
  },

  // Creating Product
  async (req, res) => {
    const {
      name,
      description,
      sizes,
      color,
      price,
      itemsInStock,
      brand,
      type,
      subCategory,
      category,
    } = req.body;

    const { thumbnail, images } = req.files;

    async.parallel(
      {
        thumbnail(done) {
          uploadImage(thumbnail[0], name)
            .then((thumbnailUrl) => {
              done(null, thumbnailUrl);
            })
            .catch((error) => {
              done(error);
            });
        },

        images(done) {
          if (images) {
            const imageTasks = images.map((image) => uploadImage(image, name));
            Promise.all(imageTasks)
              .then((imageUrls) => {
                done(null, imageUrls);
              })
              .catch((error) => {
                done(error);
              });
          } else {
            done(null, []);
          }
        },
      },

      async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: messages.somethingWentWrong,
            err,
          });
        }

        const product = new Product({
          name,
          description,
          sizes: sizes.split(','),
          color,
          thumbnail: result.thumbnail,
          images: result.images,
          price,
          itemsInStock,
          brand,
          type,
          subCategory,
          category,
        });

        try {
          await product.save();
          return res.json({ message: messages.product.created, product });
        } catch (error) {
          return res
            .status(500)
            .json({ message: messages.somethingWentWrong, error });
        }
      },
    );
  },
];

async function getProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: messages.idInvalid,
      id,
    });
  }

  try {
    const product = await Product.findById(id).exec();
    if (product === null) {
      return res.status(404).json({ message: messages.product.notFound, id });
    }
    return res.json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: messages.somethingWentWrong, error });
  }
}

function deleteProduct(req, res) {
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
        Product.findById(id)
          .exec()
          .then((result) => {
            if (result === null) {
              done({ message: messages.product.notFound });
            } else {
              done(null);
            }
          });
      },
      product(done) {
        Product.deleteOne({ _id: id })
          .exec()
          .then(() => done(null))
          .catch(() => done({ message: messages.somethingWentWrong }));
      },
    },

    (error) => {
      if (error) {
        if (error.message === messages.product.notFound) {
          res.status(400);
        } else {
          res.status(500);
        }
        return res.json(error);
      }
      return res.json({ message: messages.product.deleted });
    },
  );
}

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  deleteProduct,
};
