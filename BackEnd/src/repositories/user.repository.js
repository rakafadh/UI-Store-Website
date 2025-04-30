const db = require('../database/pg.database');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (userData) => {
    try {
        const { id, name, email, password, balance } = userData;

        const query = `
        INSERT INTO users (id, name, email, password, balance, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, password, balance, created_at
      `;

        const values = [
            id || uuidv4(),
            name,
            email,
            password,
            balance || 0,
            new Date().toISOString()
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserById = async (id) => {
    try {
        const res = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateUser = async (userData) => {
    try {
        const { id, name, email, password } = userData;

        const query = `
        UPDATE users
        SET name = $2, email = $3, password = $4
        WHERE id = $1
        RETURNING id, name, email, balance, created_at
      `;

        const values = [
            id,
            name,
            email,
            password
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

exports.updateUserBalance = async (id, newBalance) => {
    try {
        const query = `
        UPDATE users
        SET balance = $2
        WHERE id = $1
        RETURNING id, name, email, password, balance, created_at
      `;

        const values = [id, newBalance];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating user balance:", error);
        throw error;
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};
