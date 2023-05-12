const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  description: { type: String, required: true, minLength: 10 },
  size: { type: String, required: true, enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  color: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: Array, required: true },
  price: { type: Number, required: true, min: 100 },
  status: { type: String, required: true, enum: ["in stock", "out of stock"] },
  itemsInStock: { type: Number, required: true, min: 0 },
  brand: { type: Schema.Types.ObjectId, ref: "Brand" },
  subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
});

// eslint-disable-next-line func-names
ProductSchema.virtual("url").get(function () {
  return `/shop/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
