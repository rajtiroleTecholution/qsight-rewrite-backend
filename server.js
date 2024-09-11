const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Encounter = require('./models/encounter');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

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

// Create a new encounter
app.post('/api/encounters', async (req, res) => {
    try {
      const { case_id } = req.body;
  
      // Check if case_id is provided
      if (!case_id) {
        return res.status(400).send({ error: 'case_id is required' });
      }
  
      // Check if encounter with the provided case_id already exists
      const existingEncounter = await Encounter.findOne({ case_id });
      if (existingEncounter) {
        return res.status(400).send({ error: `Encounter with case_id ${case_id} already exists` });
      }
  
      // Create and save new encounter
      const newEncounter = new Encounter(req.body);
      await newEncounter.save();
      
      res.status(201).send({ message: 'Encounter created successfully', encounter: newEncounter });
    } catch (err) {
      // Handle errors such as validation issues or database errors
      res.status(500).send({ error: 'Error creating encounter' });
    }
  });
  

// Add a product to the products_list of an encounter (using case_id)
app.post('/api/encounters/:case_id/products', async (req, res) => {
  const { case_id } = req.params;
  const product = req.body; // product details should be sent in the body of the request

  try {
    const encounter = await Encounter.findOne({ case_id });

    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    // Check if product_id is unique in the products_list
    const existingProduct = encounter.products_list.find(p => p.product_id === product.product_id);
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this product_id already exists in the encounter' });
    }

    // Add product to the products_list array
    encounter.products_list.push(product);
    await encounter.save();

    res.json({ message: 'Product added to encounter successfully', encounter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to encounter' });
  }
});

// Remove a product from products_list by product_id (using case_id)
app.delete('/api/encounters/:case_id/products', async (req, res) => {
  const { case_id } = req.params;
  const { product_id } = req.body; // product_id should be sent in the body of the request

  try {
    const encounter = await Encounter.findOne({ case_id });

    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    const productIndex = encounter.products_list.findIndex(item => item.product_id === product_id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the encounter' });
    }

    // Remove the product by its index
    encounter.products_list.splice(productIndex, 1);
    await encounter.save();

    res.json({ message: 'Product removed from encounter successfully', encounter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from encounter' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
