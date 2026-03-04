const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// @desc    Get dashboard metrics and profit charts
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const { start, end } = req.query;
        let query = {};
        if (start && end) {
            query.createdAt = { $gte: new Date(start), $lte: new Date(end) };
        }

        const orders = await Order.find(query);
        const users = await User.countDocuments();

        // Calculate metrics
        const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
        const totalProfit = orders.reduce((acc, order) => acc + (order.totalProfit || 0), 0);
        const orderCount = orders.length;

        // Group by day for charts (last 7 days or selected range)
        const dateRangeFilter = start ? { $gte: new Date(start), $lte: new Date(end) } : { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        const salesByDate = await Order.aggregate([
            { $match: { createdAt: dateRangeFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$total" },
                    profit: { $sum: "$totalProfit" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Get frequent buyers
        const frequentBuyers = await User.find({ purchaseFrequency: { $gt: 0 } })
            .sort({ purchaseFrequency: -1 })
            .limit(5)
            .select('name email loyaltyPoints purchaseFrequency loyaltyTier');

        // Recent activity logs
        const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(10).populate('user', 'name');

        res.json({
            metrics: { totalSales, totalProfit, orderCount, users },
            charts: salesByDate,
            frequentBuyers,
            logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Store activity log
// @route   POST /api/admin/logs
// @access  Private
const storeLog = async (req, res) => {
    try {
        const { action, details } = req.body;
        await ActivityLog.create({
            user: req.user._id,
            action,
            details,
            ip: req.ip
        });
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Log error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAnalytics, storeLog };
