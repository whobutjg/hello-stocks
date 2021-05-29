const db = require('../models');

const index = (req, res) => {
  // Query DB for all tickers
  db.Ticker.find({}, (err, allTickers) => {
    if (err) return console.log(err)
  return res.json(allTickers);
  });
}

module.exports = {
  index
};