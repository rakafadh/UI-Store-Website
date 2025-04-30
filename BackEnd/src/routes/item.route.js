const express = require('express');
const router = express.Router();
const multer = require('multer');
const itemController = require('../controllers/item.controller');

// Multer memory storage (tidak simpan file di disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.get('/', itemController.getAllItems);
router.post('/create', upload.single('image'), itemController.createItem);
router.get('/:id', itemController.getItemById);
router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);
router.put('/', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
