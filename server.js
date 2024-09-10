const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Encounter = require('./models/encounter');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI)

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => console.log('Connected to MongoDB'));
app.get('/api/encounters', async (req, res) => {
    try {
        const encounters = await Encounter.find();
        res.json(encounters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch encounters' });
    }
});

app.post('/api/encounters', async (req, res) => {
  try {
    const encounter = new Encounter(req.body);
    await encounter.save();
    res.status(201).send(encounter);
  } catch (err) {
    res.status(500).send({ error: 'Error creating encounter' });
  }
});
  // Add a product to the products_list of an encounter (using case_id)
  app.post('/api/encounters/:case_id/products', async (req, res) => {
    const { case_id } = req.params;
    const product = req.body; // product details should be sent in the body of the request
  
    try {
      const encounter = await Encounter.findOne({ case_id: case_id });
  
      if (!encounter) {
        return res.status(404).json({ error: 'Encounter not found' });
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
    const { product_id } = req.body; // Catalog number should be sent in the body of the request
  
    try {
     const encounter = await Encounter.findOne({ case_id: case_id });
     const productIndex = encounter?.products_list?.findIndex(item=>item?.product_id === product_id)
     
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Filter out the product that matches the catalog_number
      encounter.products_list = encounter.products_list.filter(product => product.product_id !== product_id);
  
      await encounter.save();
      res.json({ message: 'Product removed from encounter successfully', encounter });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove product from encounter' });
    }
  });
  
  
// app.get('/api/test', async (req, res) => {
//   try {
//    res.status(500).json({success:true,message:'server running'})
//   } catch (err) {
//     res.status(500).send({ error: 'Error fetching encounters' });
//   }
// });
// // CREATE a new encounter

// // READ all encounters
// app.get('/api/encounters', async (req, res) => {
//   try {
//     const encounters = await Encounter.find();
//     res.send(encounters);
//   } catch (err) {
//     res.status(500).send({ error: 'Error fetching encounters' });
//   }
// });

// READ a specific encounter by ID
// app.get('/api/encounters/:id', async (req, res) => {
//   try {
//     const encounter = await Encounter.findById(req.params.id);
//     if (!encounter) {
//       return res.status(404).send({ error: 'Encounter not found' });
//     }
//     res.send(encounter);
//   } catch (err) {
//     res.status(500).send({ error: 'Error fetching encounter' });
//   }
// });

// UPDATE an encounter
// app.put('/api/encounters/:id', async (req, res) => {
//   try {
//     const encounter = await Encounter.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!encounter) {
//       return res.status(404).send({ error: 'Encounter not found' });
//     }
//     res.send(encounter);
//   } catch (err) {
//     res.status(500).send({ error: 'Error updating encounter' });
//   }
// });

// DELETE an encounter
// app.delete('/api/encounters/:id', async (req, res) => {
//   try {
//     const encounter = await Encounter.findByIdAndDelete(req.params.id);
//     if (!encounter) {
//       return res.status(404).send({ error: 'Encounter not found' });
//     }
//     res.send({ message: 'Encounter deleted' });
//   } catch (err) {
//     res.status(500).send({ error: 'Error deleting encounter' });
//   }
// });

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




