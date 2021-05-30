const mongoose = require('mongoose');

const tickerSchema = new.mongoose.Schema(
  {
  ticker: {
    type: String,
    required: true,
  },
  name: String,
  price: Number,
},
  { timestamps: true }
);

const Ticker = mongoose.model('Ticker', tickerSchema);

module.exports = Ticker;