import React, {useState, useEffect,  useContext} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';


const StockSearch = ( ) => {

  const [tickers, setTickers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentTicker, setCurrentTicker] = useState(null);
  const [newsStories, setNewsStories] = useState(null);

  useEffect(() => {
    if (currentTicker) {
      axios.get(`https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=${currentTicker}&published_utc.gte=2021-04-26&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(res => console.log(res.data.results));
    }
    
  }, [currentTicker]);

  useEffect(() => {
    if (search === '') {
      return;
    }
    axios.get(`https://api.polygon.io/v3/reference/tickers?market=stocks&search=${search}&active=true&sort=ticker&order=asc&limit=10&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(res => {
        if (res.data.results) {
          setTickers(res.data.results);
        }
      })
  }, [search])

  const handleChange = (event) => {
    setSearch(event.target.value);
  }

  const selectTicker = (event, value) => {
    setCurrentTicker(value.ticker);
    console.log(value.ticker);
  }

  return (
    <div>
      <h2>Hello Stocks</h2>
      <Autocomplete
      id="combo-box-demo"
      options={tickers}
      getOptionLabel={(option) => option.ticker}
      style={{ width: 300 }}
      onInputChange={handleChange}
      onChange={selectTicker}
      // getOptionLabel={(option) => console.log(option)}
      renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
    />
    </div>
  )
}

export default StockSearch;