const db = require('../database/pg.database');

// Get all items
exports.getAllItems = async () => {
  try {
    const result = await db.query('SELECT * FROM items');
    return result.rows; // Mengembalikan semua item
  } catch (error) {
    console.error('Error fetching all items:', error);
    throw new Error('Failed to fetch all items');
  }
};

// Get item by ID
exports.getItemById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0]; // Mengembalikan item berdasarkan ID
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    throw new Error('Failed to fetch item by ID');
  }
};

// Get items by store ID
exports.getItemsByStoreId = async (storeId) => {
  try {
    const result = await db.query('SELECT * FROM items WHERE store_id = $1', [storeId]);
    return result.rows; // Mengembalikan semua item berdasarkan store_id
  } catch (error) {
    console.error('Error fetching items by store ID:', error);
    throw new Error('Failed to fetch items by store ID');
  }
};

// Create item
exports.createItem = async (itemData) => {
  try {
    const result = await db.query(
      'INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [itemData.name, itemData.price, itemData.store_id, itemData.image_url, itemData.stock]
    );
    return result.rows[0]; // Mengembalikan item yang baru dibuat
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Failed to create item');
  }
};

// Update item
exports.updateItem = async (itemData) => {
  try {
    const result = await db.query(
      'UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *',
      [itemData.name, itemData.price, itemData.store_id, itemData.image_url, itemData.stock, itemData.id]
    );
    return result.rows[0]; // Mengembalikan item yang diperbarui
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Failed to update item');
  }
};

// Delete item
exports.deleteItem = async (id) => {
  try {
    const result = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0]; // Mengembalikan item yang dihapus
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error('Failed to delete item');
  }
};