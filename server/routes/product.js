const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Manufacturer = require('../models/manufacturer');

// Add a new product
router.post('/add', async (req, res) => {
  try {
    const { manufacturerID, productName, productSN, productBrand, productPrice, walletAddress, qrCode } = req.body;
    
    // Check if manufacturer exists
    const manufacturer = await Manufacturer.findOne({ manufacturerId: manufacturerID });
    if (!manufacturer) {
      return res.status(400).json({ error: 'Manufacturer not found' });
    }
    
    // Check if product already exists
    const existingProduct = await Product.findOne({ productSN });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SN already exists' });
    }
    
    // Create new product
    const product = new Product({
      productSN,
      productName,
      productBrand,
      productPrice,
      manufacturerId: manufacturerID,
      manufacturerWallet: walletAddress,
      qrCode,
      transactionHistory: [{
        from: 'none',
        to: walletAddress,
        transactionType: 'manufacture'
      }]
    });
    
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by SN
router.get('/:productSN', async (req, res) => {
  try {
    const product = await Product.findOne({ productSN: req.params.productSN });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product status
router.put('/:productSN/status', async (req, res) => {
  try {
    const { status, from, to, transactionType } = req.body;
    
    const product = await Product.findOne({ productSN: req.params.productSN });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.status = status;
    if (from && to && transactionType) {
      product.transactionHistory.push({
        from,
        to,
        transactionType
      });
    }
    
    await product.save();
    res.json({ message: 'Product status updated', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;