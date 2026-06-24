const mongoose = require('mongoose');

const ConsumerSchema = new mongoose.Schema({
  consumerCode: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  purchasedProducts: [{
    productSN: String,
    sellerCode: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consumer', ConsumerSchema);