const mongoose = require('mongoose');
const async = require('async');
const { validationResult } = require('express-validator');
const debug = require('debug')('*');
const multer = require('multer');
const Brand = require('../models/Brand');
const messages = require('../config/error_messages');
const brandValidation = require('../validation/brand');
const { uploadImage, emptyTempFolder } = require('../utils');
const Product = require('../models/Product');

const upload = multer({ dest: 'uploads/temp' });

function getAllBrands(req, res) {
  Brand.find()
    .exec()
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json({
      message: messages.somethingWentWrong,
      err,
    }));
}

const createBrand = [
  upload.single('logo'),
  ...brandValidation,

  // Validation Error Checking
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      emptyTempFolder();
      return res.status(400).json(errors);
    }
    return next();
  },

  // Creating Brand
  async (req, res) => {
    try {
      const logoUrl = await uploadImage(req.file, req.body.name);
      const brand = new Brand({
        name: req.body.name,
        description: req.body.description,
        logo: logoUrl,
      });
      await brand.save();
      return res.json({ message: messages.brand.created, brand });
    } catch (error) {
      debug('Error while creating brand', error);
      return res
        .status(500)
        .json({ message: messages.somethingWentWrong, error });
    }
  },
];

async function getBrand(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: messages.idInvalid,
      id,
    });
  }

  try {
    const brand = await Brand.findById(id).exec();
    if (brand === null) {
      return res.status(404).json({ message: messages.brand.notFound, id });
    }
    return res.json(brand);
  } catch (error) {
    return res
      .status(500)
      .json({ message: messages.somethingWentWrong, error });
  }
}

function deleteBrand(req, res) {
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
        Brand.findById(id)
          .exec()
          .then((result) => {
            if (result === null) {
              done({ message: messages.brand.notFound });
            } else {
              done(null);
            }
          });
      },
      products(done) {
        Product.deleteMany({ brand: id })
          .exec()
          .then(() => done(null))
          .catch((error) => done({ message: messages.somethingWentWrong, error }));
      },
      brand(done) {
        Brand.deleteOne({ _id: id })
          .exec()
          .then(() => done(null))
          .catch((error) => done({ message: messages.somethingWentWrong, error }));
      },
    },

    (error) => {
      if (error) {
        if (error.message === messages.brand.notFound) {
          res.status(400);
        } else {
          res.status(500);
        }
        return res.json(error);
      }
      return res.json({ message: messages.brand.deleted });
    },
  );
}

module.exports = {
  getAllBrands,
  createBrand,
  getBrand,
  deleteBrand,
};
