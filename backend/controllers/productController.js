const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = async (req, res) => {
    const { name, riceType, category, quantityPerUnit, stock, price, costPrice, img } = req.body;

    try {
        const product = await Product.create({
            name, riceType, category, quantityPerUnit, stock, price, costPrice, img
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const saved = await product.save();
            res.json(saved);
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) res.json({ success: true, message: 'Product deleted' });
        else res.status(404).json({ success: false, message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
