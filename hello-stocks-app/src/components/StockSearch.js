import React, {useState, useEffect,  useContext} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';


const StockSearch = ( ) => {

  const [tickers, setTickers] = useState([]);
  const [search, setSearch] = useState('');

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
    console.log(event.target.value);
    setSearch(event.target.value);
  }

  return (
    <div>
      <h2>Does this work? Test</h2>
      <Autocomplete
      id="combo-box-demo"
      options={tickers}
      getOptionLabel={(option) => option.ticker}
      style={{ width: 300 }}
      onInputChange={handleChange}
      renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
    />
    </div>
  )
}

export default StockSearch;