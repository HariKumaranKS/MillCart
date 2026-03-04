const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profilePhoto: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, default: 'Silver', enum: ['Silver', 'Gold', 'Platinum'] },
  purchaseFrequency: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
