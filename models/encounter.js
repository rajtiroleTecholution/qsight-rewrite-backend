const mongoose = require("mongoose");

// Define the encounter schema with references to the Product model
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
  status: {
    type: String,
    enum: ['Ongoing Procedure', 'Completed', 'Upcoming'], // Valid status values
  },
  products_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Reference to the Product model
  }]
});

const Encounter = mongoose.model('Encounter', encounterSchema);
module.exports = Encounter;
