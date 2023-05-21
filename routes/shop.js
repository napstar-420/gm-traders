const express = require('express');
const categoryController = require('../controllers/category');
const subCategoryController = require('../controllers/subcategory');
const typeController = require('../controllers/type');
const productController = require('../controllers/product');
const brandController = require('../controllers/brand');

const router = express.Router();

router.get('/category', categoryController.getAllCategories);
router.post('/category/', categoryController.createCategory);
router.delete('/category/', categoryController.deleteCategory);
router.get('/category/:id', categoryController.getCategory);

router.get('/subcategory', subCategoryController.getAllSubCategories);
router.post('/subcategory/', subCategoryController.createSubCategory);
router.delete('/subcategory/', subCategoryController.deleteSubCategory);
router.get('/subcategory/:id', subCategoryController.getSubCategory);

router.get('/type', typeController.getAllTypes);
router.post('/type/', typeController.createType);
router.delete('/type/', typeController.deleteType);
router.get('/type/:id', typeController.getType);

router.get('/product', productController.getAllProducts);
router.post('/product', productController.createProduct);
router.delete('/product', productController.deleteProduct);
router.get('/product/:id', productController.getProduct);

router.get('/brand', brandController.getAllBrands);
router.post('/brand', brandController.createBrand);
router.delete('/brand', brandController.deleteBrand);
router.get('/brand/:id', brandController.getBrand);

module.exports = router;
