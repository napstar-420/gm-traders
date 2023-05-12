const mongoose = require("mongoose");

const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
  description: { type: String, required: true, maxLength: 100 },
  logo: { type: String },
});

// eslint-disable-next-line func-names
BrandSchema.virtual("url").get(function () {
  return `/shop/brand/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
