import React, {useState, useEffect,  useContext} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Animation } from '@devexpress/dx-react-chart';
import axios from 'axios';


const StockSearch = ( ) => {

  const confidence = [
  {
    year: 1993, tvNews: 19, church: 29, military: 32,
  }, {
    year: 1995, tvNews: 13, church: 32, military: 33,
  }, {
    year: 1997, tvNews: 14, church: 35, military: 30,
  }, {
    year: 1999, tvNews: 13, church: 32, military: 34,
  }, {
    year: 2001, tvNews: 15, church: 28, military: 32,
  }, {
    year: 2003, tvNews: 16, church: 27, military: 48,
  }, {
    year: 2006, tvNews: 12, church: 28, military: 41,
  }, {
    year: 2008, tvNews: 11, church: 26, military: 45,
  }, {
    year: 2010, tvNews: 10, church: 25, military: 44,
  }, {
    year: 2012, tvNews: 11, church: 25, military: 43,
  }, {
    year: 2014, tvNews: 10, church: 25, military: 39,
  }, {
    year: 2016, tvNews: 8, church: 20, military: 41,
  }, {
    year: 2018, tvNews: 10, church: 20, military: 43,
  },
];

const format = () => tick => tick;
const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendLabelStyles = theme => ({
  label: {
    paddingTop: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
});
const legendItemStyles = () => ({
  item: {
    flexDirection: 'column',
  },
});

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const legendItemBase = ({ classes, ...restProps }) => (
  <Legend.Item className={classes.item} {...restProps} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase);
const demoStyles = () => ({
  chart: {
    paddingRight: '20px',
  },
  title: {
    whiteSpace: 'pre',
  },
});

const ValueLabel = (props) => {
  const { text } = props;
  return (
    <ValueAxis.Label
      {...props}
      text={`${text}%`}
    />
  );
};

const titleStyles = {
  title: {
    whiteSpace: 'pre',
  },
};
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
  <Title.Text {...props} className={classes.title} />
));






  const [tickers, setTickers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentTicker, setCurrentTicker] = useState(null);
  const [newsStories, setNewsStories] = useState(null);

  useEffect(() => {
    if (currentTicker) {
      axios.get(`https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=${currentTicker}&published_utc.gte=2021-04-26&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      .then(res => setNewsStories(res.data.results));

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      let yearAgo = (yyyy - 1) + '-' + mm + '-' + dd;

      // axios.get(`https://api.polygon.io/v2/aggs/ticker/${currentTicker}/range/1/day/2019-10-14/2020-10-14?unadjusted=true&sort=asc&limit=1000&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
      axios.get(`https://api.polygon.io/v2/aggs/ticker/${currentTicker}/range/1/day/${yearAgo}/${today}?unadjusted=true&sort=asc&limit=1000&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
        .then(res => console.log(res.data));
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
    setNewsStories(null);
    setCurrentTicker(null);
  }

  const selectTicker = (event, value) => {
    if (value?.ticker) {
      setCurrentTicker(value.ticker);
      console.log(value.ticker);
    }
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
      renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
    />






    <Paper>
        <Chart
          data={confidence}
          // className={classes.chart}
        >
          <ArgumentAxis tickFormat={format} />
          <ValueAxis
            max={50}
            labelComponent={ValueLabel}
          />

          <LineSeries
            name="TV news"
            valueField="tvNews"
            argumentField="year"
          />
          <LineSeries
            name="Church"
            valueField="church"
            argumentField="year"
          />
          <LineSeries
            name="Military"
            valueField="military"
            argumentField="year"
          />
          <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} />
          <Title
            text={`Confidence in Institutions in American society ${'\n'}(Great deal)`}
            textComponent={TitleText}
          />
          <Animation />
        </Chart>
      </Paper>






    {(newsStories) ? 
      <div>
        {newsStories.map(story => {
          return <a href={story.amp_url}>
                    <div>
                      <h2>{story.title}</h2>
                      <h3>{story.author}</h3>
                      <p>{story.description}</p>
                    </div>
                  </a>
        })}
      </div>
    : <h1>Pick A Stock To See Stories!</h1>}
    </div>
  )
}

export default StockSearch;