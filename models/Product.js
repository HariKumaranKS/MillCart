const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  riceType: { type: String, required: true }, // e.g., Basmati, Sona Masoori, Ponni, etc.
  category: { type: String, default: 'Rice' },
  quantityPerUnit: { type: String, required: true }, // e.g., "1kg", "5kg", "25kg", "50kg"
  stock: { type: Number, required: true, default: 0 }, // Available stock quantity
  price: { type: Number, required: true }, // Selling price
  costPrice: { type: Number, required: true, default: 0 }, // Cost price for profit tracking
  img: { type: String, default: '' }, // Optional image URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
