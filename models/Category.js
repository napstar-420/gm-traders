const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
});

// eslint-disable-next-line func-names
CategorySchema.virtual("url").get(function () {
  return `/shop/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
