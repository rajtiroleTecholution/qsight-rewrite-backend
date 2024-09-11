const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    manufacturer_name: {
        type: String,
      },
      brand_name: {
        type: String,
      },
      location:String,
  lot_number: {
    type: Number,
  },
  catalog_number: {
    type: Number,
  },
  serial_number: {
    type: Number,
  },
  product_id: {
    type: Number,
  },

  expiration_date: {
    type: String,
  },
  recorded_date: {
    type: String,
  },
  consumption: {
    type: String,
  },
  transaction_type: {
    type: String,
    enum: ['Used Patient Procedure', 'Remove - Return of Borrowed'], // Add valid transaction types
  },
  site: {
    type: String,
  },
  side: {
    type: String,
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
