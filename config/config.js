const { v4: uuid } = require('uuid');

module.exports = {
  product: {
    sizes: {
      XS: 'XS',
      S: 'S',
      M: 'M',
      L: 'L',
      XL: 'XL',
      XXL: 'XXL',
      XXXL: 'XXXL',
    },
    status: {
      inStock: 'in stock',
      outOfStock: 'out of stock',
    },
  },

  imageMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],

  cors: {
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  },
};
