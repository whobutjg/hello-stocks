require('dotenv').config();
require('./db');
const express = require('express');
const port = process.env.PORT || '4000';
const app = express();
const cors = require('cors');
const apiCalls = require('./api');

app.use(cors());
app.use(express.json());
app.listen(port, () => console.log('Connected to port ' + port));

app.get('/', (req, res) => {
	res.send('<h1>Hello Stocks</h1>');
});

apiCalls.getTickerInfo();
// apiCalls.getNewsArticles();
