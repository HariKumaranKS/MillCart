const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'millcart_secret_123', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        if (user) {
            const { password: _, ...userWithoutPassword } = user.toObject();
            res.status(201).json({
                success: true,
                user: userWithoutPassword,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            // Check if password matches (handle both hashed and plain text for migration)
            const isPasswordValid = user.password.startsWith('$2')
                ? await bcrypt.compare(password, user.password)
                : user.password === password;

            if (isPasswordValid) {
                const { password: _, ...userWithoutPassword } = user.toObject();
                return res.json({
                    success: true,
                    user: userWithoutPassword,
                    token: generateToken(user._id)
                });
            }
        }
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { signup, login };
