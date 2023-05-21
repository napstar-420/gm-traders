const mongoose = require('mongoose');
const config = require('../config/config');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  sizes: [
    { type: String, enum: Object.values(config.product.sizes) },
  ],
  color: { type: String, required: true, maxLength: 50 },
  thumbnail: { type: String, required: true },
  images: { type: Array, required: true },
  price: { type: Number, required: true, min: 100 },
  itemsInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

// eslint-disable-next-line func-names
ProductSchema.virtual('isInStock').get(function () {
  return this.itemsInStock > 0;
});

// eslint-disable-next-line func-names
ProductSchema.virtual('url').get(function () {
  return `/shop/product/${this._id}`;
});

module.exports = mongoose.model('Product', ProductSchema);
