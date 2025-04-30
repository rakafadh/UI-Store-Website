const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:email', userController.getUserByEmail);
router.put('/', userController.updateUser);  // Changed from '/' to '/update' for clarity
router.delete('/:id', userController.deleteUser);
router.post('/topup', userController.topUp);

module.exports = router;
