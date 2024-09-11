const mongoose = require("mongoose");

const encounterSchema = new mongoose.Schema({
  mrn_number: Number,
  patient_name: String,
  case_id: {
    type: Number,
    unique: true,  // Ensure case_id is unique
  },
  procedure: String,
  scheduled_at: String,
  end_time: String,
  room: String,
  nurse: String,
  physician: String,
  status: String, // ongoing, completed, upcoming
  products_list: [{
    lot_number: Number,
    catalog_number: Number,
    serial_number: Number,
    product_id: {
      type: Number,
      unique: true, 
    },
    manufacturer_name: String,
    brand_name: String,
    expiration_date: String,
    recorded_date: String,
    consumption: String,
    transaction_type: {
      type: String,
      enum: ['Used Patient Procedure'],  // Corrected enum values
    },
    site: String,
    side: String,
  }]
});

const Encounter = mongoose.model('Encounter', encounterSchema);
module.exports = Encounter;
