const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePicture: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.default.isEmail,
      message: '{VALUE} is not a valid email address',
    },
  },
  mobileNumber: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 11,
  },
  // Shipping address
  address: {
    Country: {
      type: String,
      required: true,
      enum: ['Pakistan'],
    },
    state: {
      type: String,
      required: true,
      enum: ['Punjab', 'Sindh', 'Khyber Pakhutun khawan', 'Balochistan'],
    },
    city: {
      type: String,
      required: true,
    },
    local: {
      type: String,
      required: true,
    },
  },
  // Inventory
  inventory: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      checkoutDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  // Order History
  orderHistory: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
  ],
});

// eslint-disable-next-line func-names
CustomerSchema.virtual('url').get(function () {
  return `/shop/customer/${this._id}`;
});

module.exports = mongoose.model('Customer', CustomerSchema);
