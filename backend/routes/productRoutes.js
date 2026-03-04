const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.post('/', protect, admin, addProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/upload-img', protect, admin, upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true, imgUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ success: false, message: 'No image uploaded' });
    }
});

module.exports = router;
