const express = require('express');
const categoryController = require('../controllers/category');

const router = express.Router();

router.get('/category', categoryController.getAllCategories);
router.post('/category/', categoryController.createCategory);
router.delete('/category/', categoryController.deleteCategory);
router.get('/category/:id', categoryController.getCategory);

module.exports = router;
