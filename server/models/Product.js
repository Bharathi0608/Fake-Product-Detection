const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productSN: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  productBrand: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  manufacturerId: {
    type: String,
    required: true
  },
  manufacturerWallet: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['manufactured', 'with_seller', 'sold', 'verified', 'fake'],
    default: 'manufactured'
  },
  currentOwner: {
    type: String, // wallet address of current owner
    default: ''
  },
  sellerCode: {
    type: String,
    default: ''
  },
  consumerCode: {
    type: String,
    default: ''
  },
  transactionHistory: [{
    from: String,
    to: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    transactionType: {
      type: String,
      enum: ['manufacture', 'sell_to_seller', 'sell_to_consumer', 'verification']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);