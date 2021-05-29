const router = require('express').Router();
const controllers = require('../controllers/tickersController');

// Ticker Index
router.get('/', controllers.tickers.index);

// Ticker Show
router.get('/:id', controllers.tickers.show);

module.exports = router;