const mongoose = require("mongoose")
const encounterSchema = new mongoose.Schema({
    mrn_number: Number,
    patient_name: String,
    case_id: Number,
    procedure: String,
    scheduled_at: String,
    end_time: String,
    room: String,
    nurse: String,
    physician: String,
    status: String, // ongoing, completed, upcoming
    products_list: [{
      lot_number:Number,
      catalog_number:Number,
      serial_number:Number,
      product_id:Number,
      manufacturer_name:String,
      brand_name:String,
      expiration_date:String,
      recorded_date:String,
      consumption:String,
      transaction_type: {
          type: String,
          enum: ['Used, Patient Procedure'], // Add your allowed values here
        },
      site:String,
      sidee:String,
    }]
  });
  
  const Encounter = mongoose.model('Encounter', encounterSchema);
  module.exports = Encounter;