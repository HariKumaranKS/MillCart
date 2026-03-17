const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);

router.post('/upload-photo', protect, upload.single('photo'), (req, res) => {
    if (req.file) {
        res.json({ success: true, photoUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ success: false, message: 'No file uploaded' });
    }
});

module.exports = router;
