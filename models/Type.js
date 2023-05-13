const mongoose = require('mongoose');

const { Schema } = mongoose;

const TypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
});

// eslint-disable-next-line func-names
TypeSchema.virtual('url').get(function () {
  return `/shop/type/${this._id}`;
});

module.exports = mongoose.model('Type', TypeSchema);
