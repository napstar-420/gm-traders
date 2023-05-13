const express = require('express');
const categoryController = require('../controllers/category');
const subCategoryController = require('../controllers/subcategory');

const router = express.Router();

router.get('/category', categoryController.getAllCategories);
router.post('/category/', categoryController.createCategory);
router.delete('/category/', categoryController.deleteCategory);
router.get('/category/:id', categoryController.getCategory);

router.get('/subcategory', subCategoryController.getAllSubCategories);
router.post('/subcategory/', subCategoryController.createSubCategory);
router.delete('/subcategory/', subCategoryController.deleteSubCategory);
router.get('/subcategory/:id', subCategoryController.getSubCategory);

module.exports = router;
