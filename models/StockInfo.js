const mongoose = require('mongoose');

const stockSchema = new.mongoose.Schema({
  ticker: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  }
});

const Stocks = mongoose.model('Stocks', stockSchema);

module.exports = Stocks;