const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const { password, ...userWithoutPassword } = user.toObject();
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.profilePhoto = req.body.profilePhoto || user.profilePhoto;

            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            // Loyalty logic: Update tier based on frequency
            if (user.purchaseFrequency > 20) user.loyaltyTier = 'Platinum';
            else if (user.purchaseFrequency > 10) user.loyaltyTier = 'Gold';
            else user.loyaltyTier = 'Silver';

            const updatedUser = await user.save();
            const { password, ...userWithoutPassword } = updatedUser.toObject();
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, getUsers };
