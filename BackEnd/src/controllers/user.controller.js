const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


exports.register = async (req, res) => {
    try {
        // Get parameters from request (supporting both query params and request body)
        const email = req.query.email || req.body.email;
        const password = req.query.password || req.body.password;
        const name = req.query.name || req.body.name;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required",
                payload: null
            });
        }

        // Validate email with regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                payload: null
            });
        }

        // Validate password (minimal 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
                payload: null
            });
        }

        // Check if email already exists
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already used",
                payload: null
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with UUID
        const userId = uuidv4();
        const newUser = await userRepository.createUser({
            id: userId,
            name,
            email,
            password: hashedPassword,
            balance: 0, // Initial balance is 0
            created_at: new Date().toISOString()
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "User created",
            payload: newUser
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            payload: null
        });
    }
};

exports.login = async (req, res) => {
    try {
        // Get parameters from request (supporting both query params and request body)
        const email = req.query.email || req.body.email;
        const password = req.query.password || req.body.password;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                payload: null
            });
        }

        // Find user by email
        const user = await userRepository.getUserByEmail(email);

        // If user not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                payload: null
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                payload: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            payload: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                balance: user.balance,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            payload: null
        });
    }
};

exports.topUp = async (req, res) => {
    try {
        // Get parameters from request (supporting both query params and request body)
        const id = req.query.id || req.body.id;
        const amount = req.query.amount || req.body.amount;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
                payload: null
            });
        }

        // Validate amount
        if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be larger than 0",
                payload: null
            });
        }

        // Check if user exists
        const user = await userRepository.getUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }

        // Parse amount as integer and calculate new balance
        const parsedAmount = parseInt(amount);
        const newBalance = parseInt(user.balance) + parsedAmount;

        // Update user balance
        const updatedUser = await userRepository.updateUserBalance(id, newBalance);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Top up successful",
            payload: updatedUser
        });
    } catch (error) {
        console.error("Error during top up:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            payload: null
        });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userRepository.getUserByEmail(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found");
        }
        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "Server error", error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
                payload: null
            });
        }

        // Validate email with regex if provided
        if (email) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                    payload: null
                });
            }

            // Check if email already used by another user
            const existingUser = await userRepository.getUserByEmail(email);
            if (existingUser && existingUser.id !== id) {
                return res.status(400).json({
                    success: false,
                    message: "Email already used",
                    payload: null
                });
            }
        }

        // Check if user exists
        const user = await userRepository.getUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }

        // Hash password if provided
        let hashedPassword = user.password;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters",
                    payload: null
                });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Prepare update data
        const updateData = {
            id,
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword
        };

        // Update user in database
        const updatedUser = await userRepository.updateUser(updateData);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User updated",
            payload: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            payload: null
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userRepository.deleteUser(req.params.id);
        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found");
        }
        baseResponse(res, true, 200, "User deleted successfully", deletedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Server error", error);
    }
};
