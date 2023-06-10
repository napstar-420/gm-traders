/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/refresh', userController.handleRefreshToken);
router.get('/logout', userController.logout);

module.exports = router;
