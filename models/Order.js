const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'shipped', 'cancelled'],
    required: true,
  },
});

// eslint-disable-next-line func-names
OrderSchema.virtual('total').get(function () {
  let total = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < this.items.length; i++) {
    const item = this.items[i];
    total += item.product.price * item.quantity;
  }
  return total;
});

// eslint-disable-next-line func-names
OrderSchema.virtual('url').get(function () {
  return `/shop/order/${this._id}`;
});

module.exports = mongoose.model('Order', OrderSchema);
