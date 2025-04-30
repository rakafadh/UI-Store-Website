const { v4: uuidv4 } = require('uuid');
const db = require('../database/pg.database'); 

exports.createTransaction = async (item_id, quantity, user_id, total) => {
    const id = uuidv4();
    const status = "pending";
    const created_at = new Date().toISOString();
    const query = `INSERT INTO transactions (id, item_id, quantity, user_id, total, status, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [id, item_id, quantity, user_id, total, status, created_at];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.payTransaction = async (id) => {
    const query = `UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

exports.deleteTransaction = async (id) => {
    const query = `DELETE FROM transactions WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

