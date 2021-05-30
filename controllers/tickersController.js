const db = require('../models');

const index = (req, res) => {
  // Query DB for all tickers
  db.Ticker.find({}, (err, allTickers) => {
    if (err) return console.log(err)
  return res.json(allTickers);
  });
}

const show = (req, res) => {
  db.Ticker.findOne({ _id: req.params.id }, (err, foundTicker) => {
    if (err) return console.log(err);
    return res.json(foundTicker);
  });
}

module.exports = {
  index,
  show
};