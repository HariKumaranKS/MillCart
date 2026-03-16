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

        // Grant admin status if the email matches the predefined ADMIN_EMAIL in .env
        const isAdmin = email === process.env.ADMIN_EMAIL;

        const user = await User.create({ name, email, password: hashedPassword, isAdmin });

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
        // Predefined Admin Check
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            let adminUser = await User.findOne({ email });
            if (!adminUser) {
                adminUser = await User.create({
                    name: 'Admin',
                    email: email,
                    password: await bcrypt.hash(password, 10),
                    isAdmin: true
                });
            } else if (!adminUser.isAdmin) {
                adminUser.isAdmin = true;
                await adminUser.save();
            }

            const { password: _, ...userWithoutPassword } = adminUser.toObject();
            return res.json({
                success: true,
                user: userWithoutPassword,
                token: generateToken(adminUser._id)
            });
        }

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
