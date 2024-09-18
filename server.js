const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Encounter = require('./models/encounter');
const Product = require('./models/products');
const cors = require('cors'); // Import the cors package
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors()); // Use the cors middleware

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all encounters
app.get('/api/encounters', async (req, res) => {
  try {
    const encounters = await Encounter.find();
    res.json(encounters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch encounters' });
  }
});
app.get('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findOne({ product_id: productId });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });
  app.post('/api/products', async (req, res) => {
    const { product_id, lot_number, catalog_number, serial_number, manufacturer_name, brand_name, expiration_date, recorded_date, consumption, transaction_type, site, side } = req.body;
  
    try {
      // Check if the product with the same product_id already exists
      const existingProduct = await Product.findOne({ product_id });
      
      if (existingProduct) {
        return res.status(400).json({ error: 'Product with this product_id already exists' });
      }
  console.log('ffasdfdsf');
      // Create a new product
      const newProduct = new Product({
        product_id,
        lot_number,
        catalog_number,
        serial_number,
        manufacturer_name,
        brand_name,
        expiration_date,
        recorded_date,
        consumption,
        transaction_type,
        site,
        side
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
  app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch encounters' });
      }
  });
app.post('/api/encounters', async (req, res) => {
    try {
      const { case_id, mrn_number, patient_name, procedure, scheduled_at, end_time, room, nurse, physician, status } = req.body;
  
      // Check if required fields are provided
      if (!case_id || !mrn_number || !patient_name || !procedure || !scheduled_at || !end_time || !room || !nurse || !physician || !status) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }
  
     
  
      // Check if encounter with the provided case_id already exists
      const existingEncounter = await Encounter.findOne({ case_id });
      if (existingEncounter) {
        return res.status(400).json({ error: `Encounter with case_id ${case_id} already exists` });
      }
  
      // Create and save new encounter
      const newEncounter = new Encounter({
        case_id,
        mrn_number,
        patient_name,
        procedure,
        scheduled_at,
        end_time,
        room,
        nurse,
        physician,
        status,
      });
      console.log(newEncounter);
      await newEncounter.save();
  
      res.status(201).json({ message: 'Encounter created successfully', encounter: newEncounter });
    } catch (err) {
      console.error('Error creating encounter:', err);
      res.status(500).json({ error: 'Error creating encounter' });
    }
  });
  
  

// Add a product to the products_list of an encounter (using case_id)
app.post('/api/encounters/:case_id/products', async (req, res) => {
    const { case_id } = req.params;
    const { product_id } = req.body; // Only the product_id is sent in the body
  console.log(case_id);
  console.log(product_id);
    try {
      // Find the encounter by case_id
      const encounter = await Encounter.findOne({ case_id });
      if (!encounter) {
        return res.status(404).json({ error: 'Encounter not found' });
      }
  
      // Find the product by product_id
      const product = await Product.findOne({ product_id });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Check if the product's MongoDB ObjectId is already in the encounter's products_list
      const productExists = encounter.products_list.some(p => p.equals(product._id));
      if (productExists) {
        return res.status(400).json({ error: 'Product already exists in the encounter' });
      }
  
      // Add the product's ObjectId to the products_list of the encounter
      encounter.products_list.push(product._id);
      
      // Save the updated encounter
      await encounter.save();
  
      res.json({ message: 'Product added to encounter successfully', encounter });
    } catch (error) {
      console.error('Failed to add product to encounter:', error);
      res.status(500).json({ error: 'Failed to add product to encounter' });
    }
  });
  
  app.get('/api/encounters/:case_id/products', async (req, res) => {
    const { case_id } = req.params;
  
    try {
      // Find the encounter by case_id
      const encounter = await Encounter.findOne({ case_id }).populate('products_list');
      
      if (!encounter) {
        return res.status(404).json({ error: 'Encounter not found' });
      }
  
      // `products_list` now contains the full product documents because of `.populate('products_list')`
      res.json({ products: encounter.products_list });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
  

// Remove a product from products_list by product_id (using case_id)
app.delete('/api/encounters/:case_id/products', async (req, res) => {
    const { case_id } = req.params;
    const { product_id } = req.body; // product_id should be sent in the body of the request
  
    try {
      // Find the product by product_id
      const product = await Product.findOne({ product_id });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Convert the product's MongoDB ObjectId to a string
      const productObjectId = product._id;
  
      // Find the encounter by case_id
      const encounter = await Encounter.findOne({ case_id });
  
      if (!encounter) {
        return res.status(404).json({ error: 'Encounter not found' });
      }
  
      // Find the index of the product to remove in the encounter's products_list
      const productIndex = encounter.products_list.findIndex(item => item.equals(productObjectId));
  
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found in the encounter' });
      }
  
      // Remove the product from the products_list array
      encounter.products_list.splice(productIndex, 1);
      await encounter.save();
  
      res.json({ message: 'Product removed from encounter successfully', encounter });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove product from encounter' });
    }
  });
  

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
