const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');
const Product = require('../models/product');

// Add a new seller
router.post('/add', async (req, res) => {
  try {
    const { sellerName, sellerBrand, sellerCode, sellerPhoneNumber, sellerManager, sellerAddress, manufacturerId, walletAddress } = req.body;
    
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ sellerCode });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller with this code already exists' });
    }
    
    // Create new seller
    const seller = new Seller({
      sellerName,
      sellerBrand,
      sellerCode,
      sellerPhoneNumber,
      sellerManager,
      sellerAddress,
      manufacturerId,
      walletAddress
    });
    
    await seller.save();
    res.status(201).json({ message: 'Seller added successfully', seller });
  } catch (error) {
    console.error('Error adding seller:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all sellers
router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add product to seller
router.post('/:sellerCode/add-product', async (req, res) => {
  try {
    const { productSN } = req.body;
    
    const seller = await Seller.findOne({ sellerCode: req.params.sellerCode });
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    
    const product = await Product.findOne({ productSN });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product already assigned to this seller
    if (seller.products.some(p => p.productSN === productSN)) {
      return res.status(400).json({ error: 'Product already assigned to this seller' });
    }
    
    seller.products.push({ productSN });
    await seller.save();
    
    // Update product status
    product.status = 'with_seller';
    product.sellerCode = req.params.sellerCode;
    product.currentOwner = seller.walletAddress;
    product.transactionHistory.push({
      from: product.currentOwner,
      to: seller.walletAddress,
      transactionType: 'sell_to_seller'
    });
    await product.save();
    
    res.json({ message: 'Product added to seller', seller });
  } catch (error) {
    console.error('Error adding product to seller:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;