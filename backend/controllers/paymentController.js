const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: Math.round(amount * 100), // convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };

    try {
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Invalid payment amount' });
        }

        console.log(`Creating Razorpay Order for amount: ${options.amount} paise`);
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error('Razorpay Error Details:', error);
        res.status(500).json({ success: false, message: 'Could not create order: ' + (error.error?.description || error.message) });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
};

module.exports = { createOrder, verifyPayment };
