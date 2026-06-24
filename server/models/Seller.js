const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  sellerCode: {
    type: String,
    required: true,
    unique: true
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerBrand: {
    type: String,
    required: true
  },
  sellerPhoneNumber: {
    type: String,
    required: true
  },
  sellerManager: {
    type: String,
    required: true
  },
  sellerAddress: {
    type: String,
    required: true
  },
  manufacturerId: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  products: [{
    productSN: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Seller', SellerSchema);