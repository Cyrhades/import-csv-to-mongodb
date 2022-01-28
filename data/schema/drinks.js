const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: Array, required: false },
  nutrients: {
    type: [{ 
      name: { type: String, required: true },  
      quantity: { type: Number, required: true }
    }],
  },
  image: { type: String, required: false },
  weight: { type: Number, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false }
});
