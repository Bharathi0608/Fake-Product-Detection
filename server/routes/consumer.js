const express = require('express');
const router = express.Router();
const Consumer = require('../models/consumer.js');
const Product = require('../models/product.js');


// Add a new consumer
router.post('/add', async (req, res) => {
  try {
    const { consumerCode, walletAddress } = req.body;
    
    // Check if consumer already exists
    const existingConsumer = await Consumer.findOne({ 
      $or: [{ consumerCode }, { walletAddress }] 
    });
    
    if (existingConsumer) {
      return res.status(400).json({ error: 'Consumer with this code or wallet already exists' });
    }
    
    // Create new consumer
    const consumer = new Consumer({
      consumerCode,
      walletAddress
    });
    
    await consumer.save();
    res.status(201).json({ message: 'Consumer added successfully', consumer });
  } catch (error) {
    console.error('Error adding consumer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sell product to consumer
router.post('/:consumerCode/purchase', async (req, res) => {
  try {
    const { productSN, sellerCode } = req.body;
    
    const consumer = await Consumer.findOne({ consumerCode: req.params.consumerCode });
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    
    const product = await Product.findOne({ productSN });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product is with the specified seller
    if (product.sellerCode !== sellerCode || product.status !== 'with_seller') {
      return res.status(400).json({ error: 'Product not available with this seller' });
    }
    
    // Add product to consumer's purchased products
    consumer.purchasedProducts.push({
      productSN,
      sellerCode
    });
    
    await consumer.save();
    
    // Update product status
    const oldOwner = product.currentOwner; // store old owner
    product.status = 'sold';
    product.consumerCode = req.params.consumerCode;
    product.currentOwner = consumer.walletAddress;
    product.transactionHistory.push({
      from: oldOwner,
      to: consumer.walletAddress,
      transactionType: 'sell_to_consumer'
    });
    
    await product.save();
    
    res.json({ message: 'Product sold to consumer', consumer });
  } catch (error) {
    console.error('Error selling product to consumer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify product
router.post('/:consumerCode/verify', async (req, res) => {
  try {
    const { productSN } = req.body;
    
    const consumer = await Consumer.findOne({ consumerCode: req.params.consumerCode });
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    
    // Check if consumer owns the product
    const purchasedProduct = consumer.purchasedProducts.find(p => p.productSN === productSN);
    if (!purchasedProduct) {
      return res.status(404).json({ error: 'Product not found in consumer purchase history' });
    }
    
    const product = await Product.findOne({ productSN });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Verify the product
    const isGenuine = product.consumerCode === req.params.consumerCode;
    
    if (isGenuine) {
      purchasedProduct.verified = true;
      product.status = 'verified';
      product.transactionHistory.push({
        from: 'system',
        to: consumer.walletAddress,
        transactionType: 'verification'
      });
      
      await consumer.save();
      await product.save();
      
      res.json({ message: 'Product is genuine', genuine: true });
    } else {
      product.status = 'fake';
      await product.save();
      res.json({ message: 'Product is fake', genuine: false });
    }
  } catch (error) {
    console.error('Error verifying product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get consumer purchase history
router.get('/:consumerCode/history', async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ consumerCode: req.params.consumerCode });
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    
    // Get detailed product information for each purchased product
    const purchaseHistory = await Promise.all(
      consumer.purchasedProducts.map(async (purchase) => {
        const product = await Product.findOne({ productSN: purchase.productSN });
        return {
          ...purchase,  // removed .toObject()
          productDetails: product
        };
      })
    );
    
    res.json(purchaseHistory);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
