const config = require('./config');

const messages = {
  idInvalid: 'ID is not valid',
  idRequired: 'ID is required',
  somethingWentWrong: 'Something went wrong',
  category: {
    notFound: 'Category not found',
    alreadyExists: 'Category already exists',
    created: 'Category created',
    deleted: 'Category deleted',
    required: 'Category is required',
  },
  subCategory: {
    notFound: 'SubCategory not found',
    alreadyExists: 'SubCategory already exists',
    created: 'SubCategory created',
    deleted: 'SubCategory deleted',
    required: 'SubCategory is required',
  },
  type: {
    notFound: 'Type not found',
    alreadyExists: 'Type already exists',
    created: 'Type created',
    deleted: 'Type deleted',
    required: 'Type is required',
  },
  product: {
    notFound: 'Product not found',
    alreadyExists: 'Product already exists',
    created: 'Product created',
    deleted: 'Product deleted',
    required: 'Product is required',
  },
  brand: {
    notFound: 'Brand not found',
    alreadyExists: 'Brand already exists',
    created: 'Brand created',
    deleted: 'Brand deleted',
    required: 'Brand is required',
  },
  user: {
    notFound: 'User not found',
    alreadyExists: 'User already exists',
    created: 'User created',
    deleted: 'User deleted',
    required: 'User is required',
  },
  validation: {
    name: {
      isRequired: 'Name is required',
      length: 'Length should be in less than or equal to 100',
    },
    description: {
      isRequired: 'Description is required',
    },
    size: {
      correct: `Size should be from the following values ${Object.values(config.product.sizes)}`,
    },
    color: {
      isRequired: 'Color is required',
      length: 'Color length should be less than or equal to 50',
    },
    thumbnail: {
      isRequired: 'Thumbnail is required',
      correctMimetype: `Image mimetype should be correct. Acceptable mimetype are ${Object.values(config.imageMimeTypes)}`,
    },
  },
};

module.exports = messages;
