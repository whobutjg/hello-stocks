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
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles';
import { Animation } from '@devexpress/dx-react-chart';
import axios from 'axios';
import moment from 'moment';
import SliderComponent from "./SliderComponent";


const StockSearch = ( ) => {

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
      text={`$${text}`}
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
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentChartData, setCurrentChartData] = useState(chartData);
  const [currentChartPoint, setCurrentChartPoint] = useState(null);

  // const [currentDate, setCurrentDate] = useState(new Date());
  // const [currentEpoch, setCurrentEpoch] = useState(Math.round(currentDate.getTime() / 1000));
  // const [yearAgoEpoch, setYearAgoEpoch] = useState(Math.round(currentDate.setFullYear(currentDate.getFullYear() - 1)));
  // const [sliderVal, setSliderVal] = useState([yearAgoEpoch, currentEpoch]);

  const [stockIndexes, setStockIndexes] = useState([0, 252]);
  const [monthsAxis, setMonthsAxis] = useState([]);

  useEffect(() => {
    console.log(stockIndexes);

    if (chartData) {
      setCurrentChartData(chartData.slice(...stockIndexes));

      const tempMonths = [];
      const hashMap = {};

      currentChartData.map(data => {
        if (!hashMap[data.monthYear]) {
          hashMap[data.monthYear] = 1;
        }
      })

      for (const key of Object.keys(hashMap)) {
        tempMonths.push(key);
      }

      setMonthsAxis(tempMonths);
      console.log(tempMonths);
    }
  }, [stockIndexes])



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
      axios.get(`https://api.polygon.io/v2/aggs/ticker/${currentTicker}/range/1/day/${yearAgo}/${today}?unadjusted=false&sort=asc&limit=252&apiKey=vHjNP5FWBDFMkOyTytTHerS_1MYNXG5z`)
        .then(res => {setStockData(res.data.results); console.log(res.data)});
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

  useEffect(() => {
    if (stockData) {

      const tempChartData = [];

      stockData.map(data => {
        console.log(moment(data.t).format('MMMM'));
        tempChartData.push({ month: moment(data.t).format('MMMM Do YYYY'), price: data.c, monthYear: moment(data.t).format('MMMM YYYY') })
      })

      console.log(tempChartData);
      setChartData(tempChartData);
      setCurrentChartData(tempChartData)
    }
  }, [stockData])

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





  // const labelHalfWidth = 50;
  const labelHalfWidth = 150;
  let lastLabelCoordinate;

  const ArgumentLabel = props => {
    const { x } = props;
    // filter Labels
    if (
      lastLabelCoordinate &&
      lastLabelCoordinate < x &&
      x - lastLabelCoordinate <= labelHalfWidth
    ) {
      return null;
    }
    lastLabelCoordinate = x;
    return <ArgumentAxis.Label {...props} />;
  };





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

   

    {(currentChartData) ? 
      <Paper>
        <Chart
          data={currentChartData}
          // className={classes.chart}
        >
          <ArgumentAxis 
            tickFormat={format}
            // showLabels={false}
            showTicks={false}
            labelComponent={ArgumentLabel}
          />
          <ValueAxis
            max={50}
            labelComponent={ValueLabel}
          />

          <LineSeries
            name={currentTicker}
            valueField="price"
            argumentField="month"
          />
          <EventTracker
            onPointerMove={(TargetData) => {
              // console.log(TargetData);

              if (TargetData.targets.length) {
                console.log(currentChartData[TargetData.targets[0].point]);
                setCurrentChartPoint(currentChartData[TargetData.targets[0].point])
              }
            }}
          />
          <Tooltip 
            contentComponent={() => <h5>{currentChartPoint.month} {currentChartPoint.price}</h5>}
          />
          {/* <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} /> */}
          <Title
            text={`${currentTicker} Price History`}
            textComponent={TitleText}
          />
          <Animation />
        </Chart>
        <SliderComponent
          setStockIndexes={setStockIndexes}
        />
      </Paper>
    : null}






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