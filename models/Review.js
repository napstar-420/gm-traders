const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
