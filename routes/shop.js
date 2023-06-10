const express = require('express');
const categoryController = require('../controllers/category');
const subCategoryController = require('../controllers/subcategory');
const typeController = require('../controllers/type');
const productController = require('../controllers/product');
const brandController = require('../controllers/brand');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.get('/category', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategory);
router.get('/subcategory', subCategoryController.getAllSubCategories);
router.get('/subcategory/:id', subCategoryController.getSubCategory);
router.get('/type', typeController.getAllTypes);
router.get('/type/:id', typeController.getType);
router.get('/product', productController.getAllProducts);
router.get('/product/:id', productController.getProduct);
router.get('/brand', brandController.getAllBrands);
router.get('/brand/:id', brandController.getBrand);

// Routes below this will require access token
router.use(verifyJWT);

router.post('/category/', categoryController.createCategory);
router.post('/subcategory/', subCategoryController.createSubCategory);
router.post('/type/', typeController.createType);
router.post('/product', productController.createProduct);
router.post('/brand', brandController.createBrand);

router.delete('/category/', categoryController.deleteCategory);
router.delete('/subcategory/', subCategoryController.deleteSubCategory);
router.delete('/type/', typeController.deleteType);
router.delete('/product', productController.deleteProduct);
router.delete('/brand', brandController.deleteBrand);

module.exports = router;
