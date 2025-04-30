const transactionRepo = require("../repositories/transaction.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;
    if (quantity <= 0) return baseResponse(res, false, 400, "Quantity must be larger than 0");
    
    try {
        const total = 100000 * quantity; // Asumsikan harga item tetap untuk contoh ini
        const transaction = await transactionRepo.createTransaction(item_id, quantity, user_id, total);
        baseResponse(res, true, 200, "Transaction created", transaction);
    } catch (err) {
        baseResponse(res, false, 500, "Error creating transaction", err);
    }
};

exports.payTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await transactionRepo.payTransaction(id);
        if (!transaction) return baseResponse(res, false, 404, "Failed to pay");
        baseResponse(res, true, 200, "Payment successful", transaction);
    } catch (err) {
        baseResponse(res, false, 500, "Error processing payment", err);
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await transactionRepo.deleteTransaction(id);
        if (!transaction) return baseResponse(res, false, 404, "Transaction not found");
        baseResponse(res, true, 200, "Transaction deleted", transaction);
    } catch (err) {
        baseResponse(res, false, 500, "Error deleting transaction", err);
    }
};