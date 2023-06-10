const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 100,
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
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    minLength: 0,
    maxLength: 11,
  },
  // Shipping address
  address: {
    Country: {
      type: String,
      enum: ['Pakistan'],
    },
    state: {
      type: String,
      enum: ['Punjab', 'Sindh', 'Khyber Pakhutun khawan', 'Balochistan'],
    },
    city: {
      type: String,
    },
    local: {
      type: String,
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

  // Refresh token
  refreshToken: {
    type: String,
    default: '',
  },
});

// eslint-disable-next-line func-names
UserSchema.virtual('url').get(function () {
  return `/shop/customer/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
