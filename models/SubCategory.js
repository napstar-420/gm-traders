const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

// eslint-disable-next-line func-names
SubCategorySchema.virtual('url').get(function () {
  return `/shop/subcategory/${this._id}`;
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);
