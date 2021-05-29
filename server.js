require('dotenv').config();
require('./models');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || '4000';
const app = express();
const apiCalls = require('./api');
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.listen(port, () => console.log('Connected to port ' + port));

app.use('/', (req, res) => {
	res.send('<h1>Hello Stocks</h1>');
});

app.use('/api/tickers', routes.tickers);

apiCalls.getTickerInfo();
// apiCalls.getNewsArticles();
