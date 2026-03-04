const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, customerDetails, total } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ success: false, message: 'No order items' });
    }

    try {
        let calculatedTotal = 0;
        let totalProfit = 0;
        const finalItems = [];

        // Validate items and calculate profit
        for (const item of orderItems) {
            const product = await Product.findById(item.productId || item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }

            const itemProfit = (product.price - product.costPrice) * item.quantity;
            totalProfit += itemProfit;
            calculatedTotal += product.price * item.quantity;

            finalItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                costPrice: product.costPrice,
                profit: itemProfit
            });

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user._id,
            items: finalItems,
            customerDetails,
            total,
            totalProfit
        });

        const createdOrder = await order.save();

        // Update user loyalty points & frequency
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { loyaltyPoints: Math.floor(total / 100), purchaseFrequency: 1 }
        });

        res.status(201).json({ success: true, order: createdOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updated = await order.save();
            res.json(updated);
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
