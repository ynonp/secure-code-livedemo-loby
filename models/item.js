const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image_file_name: String,
  color: { type: String, default: '#333' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, required: true },
});

module.exports = new mongoose.model('Item', itemSchema);
