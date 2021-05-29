const mongoose = require('mongoose');

const tickerSchema = new.mongoose.Schema({
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

const Ticker = mongoose.model('Ticker', tickerSchema);

module.exports = Ticker;