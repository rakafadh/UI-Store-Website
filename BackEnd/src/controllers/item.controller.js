const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../utils/baseResponse.util');
const db = require('../database/pg.database');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // harus ada

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function untuk upload image ke Cloudinary
const uploadImage = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'items' }, // Folder di Cloudinary
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer);
    });

    return result.secure_url; // URL gambar yang diunggah
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Check if store exists
const checkStoreExists = async (storeId) => {
  try {
    const result = await db.query('SELECT * FROM stores WHERE id = $1', [storeId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking store existence:', error);
    throw new Error('Failed to check store existence');
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;

    // Validate required fields
    if (!name || !price || !store_id || !stock || !req.file) {
      return baseResponse(res, false, 400, "Missing required fields", null);
    }

    // Check if store exists
    const storeExists = await checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(req.file);

    // Create item in database
    const newItem = await itemRepository.createItem({
      name,
      price: parseFloat(price),
      store_id,
      image_url: imageUrl,
      stock: parseInt(stock),
    });

    return baseResponse(res, true, 201, "Item created", newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return baseResponse(res, false, 500, "Error creating item", null);
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error('Error getting items:', error);
    return baseResponse(res, false, 500, "Error retrieving items", null);
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await itemRepository.getItemById(id);
    
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    return baseResponse(res, true, 200, "Item found", item);
  } catch (error) {
    console.error('Error getting item by ID:', error);
    return baseResponse(res, false, 500, "Error retrieving item", null);
  }
};

// Get items by store ID
exports.getItemsByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;
    
    // Check if store exists
    const storeExists = await checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesnt exist", null);
    }
    
    const items = await itemRepository.getItemsByStoreId(store_id);
    
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error('Error getting items by store ID:', error);
    return baseResponse(res, false, 500, "Error retrieving items", null);
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;

    // Validate required fields
    if (!id || !name || !price || !store_id || !stock) {
      return baseResponse(res, false, 400, "Missing required fields", null);
    }

    // Check if item exists
    const existingItem = await itemRepository.getItemById(id);
    if (!existingItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    // Check if store exists
    const storeExists = await checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    // Prepare update data
    const updateData = {
      id,
      name,
      price: parseFloat(price),
      store_id,
      stock: parseInt(stock),
      image_url: existingItem.image_url,
    };

    // If file is present, upload new image
    if (req.file) {
      updateData.image_url = await uploadImage(req.file);
    }

    // Update item in database
    const updatedItem = await itemRepository.updateItem(updateData);

    return baseResponse(res, true, 200, "Item updated", updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return baseResponse(res, false, 500, "Error updating item", null);
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if item exists
    const existingItem = await itemRepository.getItemById(id);
    if (!existingItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    // Delete item from database
    const deletedItem = await itemRepository.deleteItem(id);
    
    return baseResponse(res, true, 200, "Item deleted", deletedItem);
  } catch (error) {
    console.error('Error deleting item:', error);
    return baseResponse(res, false, 500, "Error deleting item", null);
  }
};